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

      console.log('Creating item with data:', req.body);

      const newItem = await ItemService.createItem({
        name,
        description,
        price,
        quantity,
        sku,
        unit,
        isActive,
      });

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
   * Update item quantity
   * @route PATCH /api/items/:id/quantity
   * @access Admin only
   */
  static async updateQuantity(req, res) {
    try {
      const { id } = req.params;
      const { quantityChange } = req.body;

      if (quantityChange === undefined) {
        return res.status(400).json({
          success: false,
          message: 'quantityChange is required',
        });
      }

      const updatedItem = await ItemService.updateQuantity(id, parseInt(quantityChange));

      return res.status(200).json({
        success: true,
        message: 'Item quantity updated successfully',
        data: updatedItem,
      });
    } catch (error) {
      console.error('Error updating quantity:', error);

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

module.exports = ItemController;
