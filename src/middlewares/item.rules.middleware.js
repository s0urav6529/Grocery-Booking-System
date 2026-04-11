const { body, param, query } = require('express-validator');

const createItemRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Item name is required')
    .isLength({ min: 2, max: 255 })
    .withMessage('Item name must be between 2 and 255 characters'),

  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),

  body('description')
    .notEmpty()
    .withMessage('Description is required'),

  body('sku')
    .notEmpty()
    .withMessage('SKU is required')
    .trim()
    .isLength({ max: 100 })
    .withMessage('SKU must not exceed 100 characters'),

  body('unit')
    .notEmpty()
    .withMessage('Unit is required')
    .trim()
    .isLength({ max: 50 })
    .withMessage('Unit must not exceed 50 characters'),

  body('isActive')
    .notEmpty()
    .withMessage('isActive is required')
    .isBoolean()
    .withMessage('isActive must be a boolean value'),
];

const updateItemRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Item name must be between 2 and 255 characters'),

  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  body('quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),

  body('description')
    .optional()
    .trim(),

  body('sku')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('SKU must not exceed 100 characters'),

  body('unit')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Unit must not exceed 50 characters'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value'),
];

const getItemByIdRules = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Item ID must be a positive integer'),
];

const getItemBySlugRules = [
  param('slug')
    .trim()
    .notEmpty()
    .withMessage('Slug is required')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug must contain only lowercase letters, numbers, and hyphens'),
];

const updateQuantityRules = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Item ID must be a positive integer'),

  body('quantityChange')
    .notEmpty()
    .withMessage('quantityChange is required')
    .isInt()
    .withMessage('quantityChange must be an integer'),
];

const getItemsFilterRules = [
  query('search')
    .optional()
    .trim(),

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

module.exports = {
  createItemRules,
  updateItemRules,
  getItemByIdRules,
  getItemBySlugRules,
  updateQuantityRules,
  getItemsFilterRules,
};
