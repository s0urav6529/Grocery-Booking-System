const OrderService = require('../services/order.service');

class OrderController {
  static async createOrder(req, res) {
    try {
      const actorId = req.account.id;
      const orderPayload = req.body;

      const order = await OrderService.createOrder(actorId, orderPayload);
      const { id, totalPrice, status, note } = order;

      return res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        data: {
          id,
          actorId,
          totalPrice,
          status,
          note
        },
      });
    } catch (error) {
      console.error('Error creating order:', error);
      if (error.status) {
        return res.status(error.status).json({
          success: false,
          message: error.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  static async getOrders(req, res) {
    try {
      const actorId = req.account.id;
      const role = req.account.role;
      const { page, limit } = req.query;

      const result = await OrderService.getOrders(actorId, role, { page, limit });

      return res.status(200).json({
        success: true,
        message: 'Orders retrieved successfully',
        ...result,
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  static async getOrderById(req, res) {
    try {
      const actorId = req.account.id;
      const role = req.account.role;
      const { id } = req.params;

      const order = await OrderService.getOrderById(actorId, role, id);

      return res.status(200).json({
        success: true,
        message: 'Order retrieved successfully',
        data: order,
      });
    } catch (error) {
      console.error('Error fetching order:', error);
      if (error.status) {
        return res.status(error.status).json({
          success: false,
          message: error.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }
}

module.exports = OrderController;
