const { body, param, query } = require('express-validator');

const createOrderRules = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one item is required for an order'),
  body('items.*.itemId')
    .isInt({ min: 1 })
    .withMessage('Each item must include a valid itemId'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Each item must include a valid quantity'),
  body('note')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Note must not exceed 500 characters'),
];

const getOrdersRules = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
];

const getOrderByIdRules = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Order ID must be a positive integer'),
];

module.exports = {
  createOrderRules,
  getOrdersRules,
  getOrderByIdRules,
};
