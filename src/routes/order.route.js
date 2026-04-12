const orderRoute = require('express').Router();
const OrderController = require('../controllers/order.controller');
const { authMiddleware, validation, orderRules } = require('../middlewares/init');

orderRoute.use(authMiddleware.isLogin);

orderRoute
  .route('/')
  .post(
    authMiddleware.requireUser,
    orderRules.createOrderRules,
    validation.validate,
    OrderController.createOrder
  )
  .get(
    authMiddleware.requireUser,
    orderRules.getOrdersRules,
    validation.validate,
    OrderController.getOrders
  );

orderRoute
  .route('/id/:id')
  .get(
    authMiddleware.requireUser,
    orderRules.getOrderByIdRules,
    validation.validate,
    OrderController.getOrderById
  );

module.exports = orderRoute;
