const itemRoute = require('express').Router();
const ItemController = require('../controllers/item.controller');
const { itemRules, validation, authMiddleware } = require('../middlewares/init');

// Get all items with optional filters and pagination
// public endpoint, no authentication required
itemRoute
    .route('/')
    .get(
        itemRules.getItemsFilterRules,
        validation.validate,
        ItemController.getAllItems
    )

// Get item by slug (public endpoint)
itemRoute
    .route('/slug/:slug')
    .get(
        itemRules.getItemBySlugRules,
        validation.validate,
        ItemController.getItemBySlug
    );

// All routes below require authentication
itemRoute.use(authMiddleware.isLogin);

itemRoute
    .route('/')
    .post(  // Admin only create item endpoint
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


// Update item and delete item (admin only)
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

// Add stock to item (admin only)
itemRoute
    .route('/:id/inventory/add')
    .post( authMiddleware.requireAdmin,
        itemRules.addStockRules,
        validation.validate,
        ItemController.addStock
    );

// Reduce stock from item (admin only)
itemRoute
    .route('/:id/inventory/reduce')
    .post( authMiddleware.requireAdmin,
        itemRules.reduceStockRules,
        validation.validate,
        ItemController.reduceStock
    );

// Set item stock quantity (admin only)
itemRoute
    .route('/:id/inventory')
    .put( authMiddleware.requireAdmin,
        itemRules.setStockRules,
        validation.validate,
        ItemController.setStock
    );

// Get inventory history for an item (admin only)
itemRoute
    .route('/:id/inventory/history')
    .get( authMiddleware.requireAdmin,
        itemRules.getInventoryHistoryRules,
        validation.validate,
        ItemController.getInventoryHistory
    );

module.exports = itemRoute;
