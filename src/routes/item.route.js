const itemRoute = require('express').Router();
const ItemController = require('../controllers/item.controller');
const { itemRules, validation, authMiddleware } = require('../middlewares/init');

itemRoute.use(authMiddleware.isLogin);

itemRoute
    .route('/')
    // Get all items with optional filters and pagination
    .get(
        authMiddleware.requireAdminAndUser,
        itemRules.getItemsFilterRules,
        validation.validate,
        ItemController.getAllItems
    )
    // Create a new item
    .post(
        authMiddleware.requireAdmin,
        itemRules.createItemRules,
        validation.validate,
        ItemController.createItem
    )

// Get item by ID (admin only)
itemRoute
    .route('/id/:id')
    .get(
        authMiddleware.requireAdmin,
        itemRules.getItemByIdRules,
        validation.validate,
        ItemController.getItemById
    );

// Get item by slug (admin and user)
itemRoute
    .route('/slug/:slug')
    .get(
        authMiddleware.requireAdminAndUser,
        itemRules.getItemBySlugRules,
        validation.validate,
        ItemController.getItemBySlug
    );

// Update item
itemRoute
    .route('/:id')
    .patch(
            authMiddleware.requireAdmin,
            itemRules.updateItemRules,
            validation.validate,
            ItemController.updateItem
    )
    .delete(
        authMiddleware.requireAdmin,
        itemRules.getItemByIdRules,
        validation.validate,
        ItemController.deleteItem
    );

// Update item quantity
itemRoute
    .patch(
        '/:id/quantity',
        authMiddleware.requireAdmin,
        itemRules.updateQuantityRules,
        validation.validate,
        ItemController.updateQuantity
    );

module.exports = itemRoute;
