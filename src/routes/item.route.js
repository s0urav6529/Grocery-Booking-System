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

// Add stock to item
itemRoute
    .route('/:id/inventory/add')
    .post( authMiddleware.requireAdmin,
        itemRules.addStockRules,
        validation.validate,
        ItemController.addStock
    );

// Reduce stock from item
itemRoute
    .route('/:id/inventory/reduce')
    .post( authMiddleware.requireAdmin,
        itemRules.reduceStockRules,
        validation.validate,
        ItemController.reduceStock
    );

// Set item stock quantity
itemRoute
    .route('/:id/inventory')
    .put( authMiddleware.requireAdmin,
        itemRules.setStockRules,
        validation.validate,
        ItemController.setStock
    );

// Get inventory history for an item
itemRoute
    .route('/:id/inventory/history')
    .get( authMiddleware.requireAdmin,
        itemRules.getInventoryHistoryRules,
        validation.validate,
        ItemController.getInventoryHistory
    );

module.exports = itemRoute;
