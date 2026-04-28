const { sequelize } = require('../config/db.config');
const { Item, Order, OrderItem } = require('../models/init');

class OrderService {
  static async createOrder(actorId, orderPayload) {
    const items = orderPayload.items || [];
    const note = orderPayload.note || null;

    if (!Array.isArray(items) || items.length === 0) {
      throw {
        status: 400,
        message: 'Order must contain at least one item',
      };
    }

    // Validate basic shape before acquiring locks
    for (const requestedItem of items) {
      const parsedQuantity = parseInt(requestedItem.quantity, 10);
      if (!requestedItem.itemId || parsedQuantity <= 0) {
        throw {
          status: 400,
          message: 'Each item must include a valid itemId and positive quantity',
        };
      }
    }

    const itemIds = items.map((item) => item.itemId);

    // Start a SERIALIZABLE transaction so that concurrent reads of the same
    // rows are serialised and cannot both pass the stock check simultaneously.
    const transaction = await sequelize.transaction({
      isolationLevel: sequelize.constructor.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    });

    try {
      // Acquire a pessimistic write-lock on every item row involved in this
      // order (FOR UPDATE / LOCK IN SHARE MODE depending on dialect).  Any
      // concurrent request that tries to lock the same rows will block here
      // until this transaction commits or rolls back.
      const existingItems = await Item.findAll({
        where: { id: itemIds },
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      const itemMap = existingItems.reduce((map, item) => {
        map[item.id] = item;
        return map;
      }, {});

      let totalPrice = 0;
      const orderItems = [];

      for (const requestedItem of items) {
        const { itemId, quantity } = requestedItem;
        const parsedQuantity = parseInt(quantity, 10);

        const item = itemMap[itemId];
        if (!item) {
          throw {
            status: 404,
            message: `Item not found: ${itemId}`,
          };
        }

        if (!item.isActive) {
          throw {
            status: 400,
            message: `Item is not available: ${item.name}`,
          };
        }

        // Stock check now happens on the locked row — safe from race conditions
        if (parsedQuantity > item.quantity) {
          throw {
            status: 400,
            message: `Insufficient stock for item: ${item.name}`,
          };
        }

        const unitPrice = parseFloat(item.price);
        const subtotal = unitPrice * parsedQuantity;
        totalPrice += subtotal;

        orderItems.push({
          itemId,
          quantity: parsedQuantity,
          unitPrice,
          subtotal,
        });

        // Decrement stock atomically within the same transaction
        await item.decrement('quantity', { by: parsedQuantity, transaction });
      }

      const order = await Order.create(
        {
          actorId,
          totalPrice,
          status: 'pending',
          note,
        },
        { transaction }
      );

      const orderItemsPayload = orderItems.map((orderItem) => ({
        ...orderItem,
        orderId: order.id,
      }));

      await OrderItem.bulkCreate(orderItemsPayload, { transaction });
      await transaction.commit();

      return order.dataValues;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async getOrders(actorId, role, pagination = {}) {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const offset = (page - 1) * limit;

    const where = {};
    if (role !== 'admin') {
      where.actorId = actorId;
    }

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Item,
              as: 'item',
              attributes: ['id', 'name', 'price', 'sku', 'unit'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  static async getOrderById(actorId, role, orderId) {
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Item,
              as: 'item',
              attributes: ['id', 'name', 'price', 'sku', 'unit'],
            },
          ],
        },
      ],
    });

    if (!order) {
      throw {
        status: 404,
        message: 'Order not found',
      };
    }

    if (role !== 'admin' && order.actorId !== actorId) {
      throw {
        status: 403,
        message: 'Access denied for this order',
      };
    }

    return order;
  }
}

module.exports = OrderService;
