const OrderService = require('../services/order.service');
const { asyncHandler, response } = require('../utils/init');

class OrderController {
  /**
   * Place a new order
   * @route POST /api/orders
   * @access User
   */
  static createOrder = asyncHandler(async (req, res) => {
    const actorId = req.account.id;
    const orderPayload = req.body;

    const order = await OrderService.createOrder(actorId, orderPayload);
    const { id, totalPrice, status, note } = order;

    return response.sendSuccess(res, 201, 'Order placed successfully', {
      id,
      actorId,
      totalPrice,
      status,
      note,
    });
  });

  /**
   * List orders (admin sees all, user sees own)
   * @route GET /api/orders
   * @access Admin and User
   */
  static getOrders = asyncHandler(async (req, res) => {
    const actorId = req.account.id;
    const role = req.account.role;
    const { page, limit } = req.query;

    const result = await OrderService.getOrders(actorId, role, { page, limit });
    return response.sendSuccess(res, 200, 'Orders retrieved successfully', null, result);
  });

  /**
   * Get a single order by ID
   * @route GET /api/orders/:id
   * @access Admin and owner
   */
  static getOrderById = asyncHandler(async (req, res) => {
    const actorId = req.account.id;
    const role = req.account.role;
    const { id } = req.params;

    const order = await OrderService.getOrderById(actorId, role, id);
    return response.sendSuccess(res, 200, 'Order retrieved successfully', order);
  });
}

module.exports = OrderController;
