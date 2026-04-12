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

    const itemIds = items.map((item) => item.itemId);
    const existingItems = await Item.findAll({ where: { id: itemIds } });
    const itemMap = existingItems.reduce((map, item) => {
      map[item.id] = item;
      return map;
    }, {});

    let totalPrice = 0;
    const orderItems = [];

    for (const requestedItem of items) {
      const { itemId, quantity } = requestedItem;
      const parsedQuantity = parseInt(quantity, 10);

      if (!itemId || parsedQuantity <= 0) {
        throw {
          status: 400,
          message: 'Each item must include a valid itemId and positive quantity',
        };
      }

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
    }

    const transaction = await sequelize.transaction();

    try {
      const order = await Order.create(
        {
          actorId,
          totalPrice,
          status: 'pending',
          note,
        },
        { transaction }
      );

      // console.log('Order created with ID:', order.dataValues);

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
