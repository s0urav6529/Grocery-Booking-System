const ItemService = require('../services/item.service');

class ItemController {
  /**
   * Get all items or search
   * @route GET /api/items
   * @access Admin and User
   */
  static async getAllItems(req, res) {
    try {
      const { search, page, limit } = req.query;

      const pagination = {
        page: page || 1,
        limit: limit || 10,
      };

      let result;
      if (search) {
        result = await ItemService.searchItems(search, pagination);
      } else {
        result = await ItemService.getAllItems({}, pagination);
      }

      return res.status(200).json({
        success: true,
        message: 'Items retrieved successfully',
        ...result,
      });
    } catch (error) {
      console.error('Error fetching items:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  /**
   * Get single item by ID
   * @route GET /api/items/id/:id
   * @access Admin only
   */
  static async getItemById(req, res) {
    try {
      const { id } = req.params;

      const item = await ItemService.getItemById(id);

      return res.status(200).json({
        success: true,
        message: 'Item retrieved successfully',
        data: item,
      });
    } catch (error) {
      console.error('Error fetching item:', error);

      if (error.status === 404) {
        return res.status(404).json({
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

  /**
   * Get single item by slug
   * @route GET /api/items/slug/:slug
   * @access Admin and User
   */
  static async getItemBySlug(req, res) {
    try {
      const { slug } = req.params;

      const item = await ItemService.getItemBySlug(slug);

      return res.status(200).json({
        success: true,
        message: 'Item retrieved successfully',
        data: item,
      });
    } catch (error) {
      console.error('Error fetching item:', error);

      if (error.status === 404) {
        return res.status(404).json({
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
  static async createItem(req, res) {
    try {
      const { name, description, price, quantity, sku, unit, isActive } = req.body;
      const actorId = req.account.id; // From auth middleware
      const newItem = await ItemService.createItem({
        name,
        description,
        price,
        quantity,
        sku,
        unit,
        isActive
      }, actorId);

      return res.status(201).json({
        success: true,
        message: 'Item created successfully',
        data: newItem,
      });
    } catch (error) {
      console.error('Error creating item:', error);

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

  /**
   * Update item
   * @route PATCH /api/items/:id
   * @access Admin only
   */
  static async updateItem(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedItem = await ItemService.updateItem(id, updateData);

      return res.status(200).json({
        success: true,
        message: 'Item updated successfully',
        data: updatedItem,
      });
    } catch (error) {
      console.error('Error updating item:', error);

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

  /**
   * Delete item
   * @route DELETE /api/items/:id
   * @access Admin only
   */
  static async deleteItem(req, res) {
    try {
      const { id } = req.params;

      const result = await ItemService.deleteItem(id);

      return res.status(200).json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (error) {
      console.error('Error deleting item:', error);

      if (error.status === 404) {
        return res.status(404).json({
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

  /**
   * Add stock to item
   * @route POST /api/items/:id/inventory/add
   * @access Admin only
   */
  static async addStock(req, res) {
    try {
      const { id } = req.params;
      const { quantity, reason } = req.body;
      const adminId = req.account.id;

      if (!quantity || quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Valid quantity is required',
        });
      }

      const result = await ItemService.addStock(id, parseInt(quantity), adminId, reason);

      return res.status(200).json({
        success: true,
        message: 'Stock added successfully',
        data: result,
      });
    } catch (error) {
      console.error('Error adding stock:', error);

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

  /**
   * Reduce stock from item
   * @route POST /api/items/:id/inventory/reduce
   * @access Admin only
   */
  static async reduceStock(req, res) {
    try {
      const { id } = req.params;
      const { quantity, reason } = req.body;
      const adminId = req.account.id; // From auth middleware

      if (!quantity || quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Valid quantity is required',
        });
      }

      const result = await ItemService.reduceStock(id, parseInt(quantity), adminId, reason);

      return res.status(200).json({
        success: true,
        message: 'Stock reduced successfully',
        data: result,
      });
    } catch (error) {
      console.error('Error reducing stock:', error);

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

  /**
   * Set item stock quantity
   * @route PUT /api/items/:id/inventory
   * @access Admin only
   */
  static async setStock(req, res) {
    try {
      const { id } = req.params;
      const { quantity, reason } = req.body;
      const adminId = req.account.id; // From auth middleware

      if (quantity === undefined || quantity < 0) {
        return res.status(400).json({
          success: false,
          message: 'Valid quantity (>= 0) is required',
        });
      }

      const result = await ItemService.setStock(id, parseInt(quantity), adminId, reason);

      return res.status(200).json({
        success: true,
        message: 'Stock set successfully',
        data: result,
      });
    } catch (error) {
      console.error('Error setting stock:', error);

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

  /**
   * Get inventory history for an item
   * @route GET /api/items/:id/inventory/history
   * @access Admin only
   */
  static async getInventoryHistory(req, res) {
    try {
      const { id } = req.params;
      const { page, limit } = req.query;

      const pagination = {
        page: page || 1,
        limit: limit || 20,
      };

      const result = await ItemService.getInventoryHistory(id, pagination);

      return res.status(200).json({
        success: true,
        message: 'Inventory history retrieved successfully',
        ...result,
      });
    } catch (error) {
      console.error('Error fetching inventory history:', error);

      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }
}

module.exports = ItemController;
