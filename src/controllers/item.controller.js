const ItemService = require('../services/item.service');
const { asyncHandler, response } = require('../utils/init');

class ItemController {
  /**
   * Get all items or search
   * @route GET /api/items
   * @access Admin and User
   */
  static getAllItems = asyncHandler(async (req, res) => {
    const { search, page, limit } = req.query;

    const pagination = { page: page || 1, limit: limit || 10 };

    const result = search
      ? await ItemService.searchItems(search, pagination)
      : await ItemService.getAllItems({}, pagination);

    return response.sendSuccess(res, 200, 'Items retrieved successfully', null, result);
  });

  /**
   * Get single item by ID
   * @route GET /api/items/id/:id
   * @access Admin only
   */
  static getItemById = asyncHandler(async (req, res) => {
    const item = await ItemService.getItemById(req.params.id);
    return response.sendSuccess(res, 200, 'Item retrieved successfully', item);
  });

  /**
   * Get single item by slug
   * @route GET /api/items/slug/:slug
   * @access Admin and User
   */
  static getItemBySlug = asyncHandler(async (req, res) => {
    const item = await ItemService.getItemBySlug(req.params.slug);
    return response.sendSuccess(res, 200, 'Item retrieved successfully', item);
  });

  /**
   * Create a new item
   * @route POST /api/items
   * @access Admin only
   */
  static createItem = asyncHandler(async (req, res) => {
    const { name, description, price, quantity, sku, unit, isActive } = req.body;
    const actorId = req.account.id;

    const newItem = await ItemService.createItem(
      { name, description, price, quantity, sku, unit, isActive },
      actorId
    );

    return response.sendSuccess(res, 201, 'Item created successfully', newItem);
  });

  /**
   * Update item
   * @route PATCH /api/items/:id
   * @access Admin only
   */
  static updateItem = asyncHandler(async (req, res) => {
    const updatedItem = await ItemService.updateItem(req.params.id, req.body);
    return response.sendSuccess(res, 200, 'Item updated successfully', updatedItem);
  });

  /**
   * Delete item
   * @route DELETE /api/items/:id
   * @access Admin only
   */
  static deleteItem = asyncHandler(async (req, res) => {
    const result = await ItemService.deleteItem(req.params.id);
    return response.sendSuccess(res, 200, result.message, result);
  });

  /**
   * Add stock to item
   * @route POST /api/items/:id/inventory/add
   * @access Admin only
   */
  static addStock = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { quantity, reason } = req.body;
    const adminId = req.account.id;

    if (!quantity || quantity <= 0) {
      return response.sendError(res, 400, 'Valid quantity is required');
    }

    const result = await ItemService.addStock(id, parseInt(quantity), adminId, reason);
    return response.sendSuccess(res, 200, 'Stock added successfully', result);
  });

  /**
   * Reduce stock from item
   * @route POST /api/items/:id/inventory/reduce
   * @access Admin only
   */
  static reduceStock = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { quantity, reason } = req.body;
    const adminId = req.account.id;

    if (!quantity || quantity <= 0) {
      return response.sendError(res, 400, 'Valid quantity is required');
    }

    const result = await ItemService.reduceStock(id, parseInt(quantity), adminId, reason);
    return response.sendSuccess(res, 200, 'Stock reduced successfully', result);
  });

  /**
   * Set item stock quantity
   * @route PUT /api/items/:id/inventory
   * @access Admin only
   */
  static setStock = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { quantity, reason } = req.body;
    const adminId = req.account.id;

    if (quantity === undefined || quantity < 0) {
      return response.sendError(res, 400, 'Valid quantity (>= 0) is required');
    }

    const result = await ItemService.setStock(id, parseInt(quantity), adminId, reason);
    return response.sendSuccess(res, 200, 'Stock set successfully', result);
  });

  /**
   * Get inventory history for an item
   * @route GET /api/items/:id/inventory/history
   * @access Admin only
   */
  static getInventoryHistory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { page, limit } = req.query;

    const result = await ItemService.getInventoryHistory(id, { page: page || 1, limit: limit || 20 });
    return response.sendSuccess(res, 200, 'Inventory history retrieved successfully', null, result);
  });
}

module.exports = ItemController;
