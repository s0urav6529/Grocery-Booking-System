const { Item } = require('../models/init');
const { generateSlug } = require('../utils/slug.utils');

class ItemService {

    /**
     * Get all items with pagination
     */
    static async getAllItems(filter = {}, pagination = {}) {
        try {
        const query = {};
        
        if (filter.isActive !== undefined) {
            query.isActive = filter.isActive;
        }

        // Handle pagination
        const page = pagination.page || 1;
        const limit = pagination.limit || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Item.findAndCountAll({
            where: query,
            order: [['createdAt', 'DESC']],
            limit,
            offset,
        });

        const totalPages = Math.ceil(count / limit);

        return {
            data: rows,
            pagination: {
                page,
                limit,
                total: count,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
        };
        } catch (error) {
            throw new Error(`Error fetching items: ${error.message}`);
        }
    }

    /**
     * Get item by ID
     */
    static async getItemById(itemId) {
        try {
            const item = await Item.findByPk(itemId);
            if (!item) {
                throw {
                    status: 404,
                    message: 'Item not found',
                };
            }
            return item;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get item by slug
     */
    static async getItemBySlug(slug) {
        try {
            const item = await Item.findOne({ where: { slug } });
            if (!item) {
                throw {
                    status: 404,
                    message: 'Item not found',
                };
            }
            return item;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Create new item with slug generation and duplicate checks
     */
    static async createItem(itemData) {

        try {

            // Validate required fields
            if (!itemData.name)
                throw {
                    status: 400,
                    message: 'Name is required',
                };

            if (!itemData.description)
                throw {
                    status: 400,
                    message: 'Description is required',
                };
            if (itemData.price === undefined)
                throw {
                    status: 400,
                    message: 'Price is required',
                };

            if (itemData.quantity === undefined)
                throw {
                    status: 400,
                    message: 'Quantity is required',
                };

            if (itemData.isActive === undefined)
                throw {
                    status: 400,
                    message: 'isActive is required',
                };
            

            // Check for duplicate SKU if provided
            if (itemData.sku) {
                const existingSku = await Item.findOne({ where: { sku: itemData.sku } });
                if (existingSku) {
                    throw {
                        status: 409,
                        message: 'SKU already exists',
                    };
                }
            }

            // Generate slug from name
            let slug = generateSlug(itemData.name);

            // Check if slug already exists and append counter if needed
            let counter = 1;
            let existingSlug = await Item.findOne({ where: { slug } });
            
            while (existingSlug) {
                slug = `${generateSlug(itemData.name)}-${counter}`;
                existingSlug = await Item.findOne({ where: { slug } });
                counter++;
            }

            console.log('Final slug for new item:', slug);

            const newItem = await Item.create({
                name: itemData.name,
                slug: slug,
                description: itemData.description || null,
                price: parseFloat(itemData.price),
                quantity: parseInt(itemData.quantity) || 0,
                sku: itemData.sku || null,
                unit: itemData.unit || 'pcs',
                isActive: itemData.isActive !== undefined ? itemData.isActive : true,
            });

            return newItem;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Update item with slug regeneration if name changes
     */
    static async updateItem(itemId, updateData) {
        try {
            const item = await this.getItemById(itemId);

            // Check for duplicate SKU if being updated
            if (updateData.sku && updateData.sku !== item.sku) {
                const existingSku = await Item.findOne({ where: { sku: updateData.sku } });
                if (existingSku) {
                    throw {
                        status: 409,
                        message: 'SKU already exists',
                    };
                }
            }

            // Update only provided fields
            if (updateData.name !== undefined) {
                item.name = updateData.name;
                
                // Regenerate slug when name changes
                let newSlug = generateSlug(updateData.name);
                let counter = 1;
                let existingSlug = await Item.findOne({
                    where: { slug: newSlug, id: { [require('sequelize').Op.ne]: itemId } },
                });
                
                while (existingSlug) {
                    newSlug = `${generateSlug(updateData.name)}-${counter}`;
                    existingSlug = await Item.findOne({
                        where: { slug: newSlug, id: { [require('sequelize').Op.ne]: itemId } },
                    });
                    counter++;
                }
                
                item.slug = newSlug;
            }

            if (updateData.description !== undefined) item.description = updateData.description;
            if (updateData.price !== undefined) item.price = parseFloat(updateData.price);
            if (updateData.quantity !== undefined) item.quantity = parseInt(updateData.quantity);
            if (updateData.sku !== undefined) item.sku = updateData.sku;
            if (updateData.unit !== undefined) item.unit = updateData.unit;
            if (updateData.isActive !== undefined) item.isActive = updateData.isActive;

            await item.save();
            return item;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Delete item
     */
    static async deleteItem(itemId) {
        try {
            const item = await this.getItemById(itemId);
            await item.destroy();
            return {
                id: item.id,
                message: 'Item deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Search items by name or slug
     */
    static async searchItems(searchTerm, pagination = {}) {
        try {
            const page = pagination.page || 1;
            const limit = pagination.limit || 10;
            const offset = (page - 1) * limit;

            const { count, rows } = await Item.findAndCountAll({
                where: {
                    [require('sequelize').Op.or]: [
                        { name: { [require('sequelize').Op.iLike]: `%${searchTerm}%` } },
                        { slug: { [require('sequelize').Op.iLike]: `%${searchTerm}%` } },
                    ],
                },
                order: [['createdAt', 'DESC']],
                limit,
                offset,
            });

            const totalPages = Math.ceil(count / limit);

            return {
                data: rows,
                pagination: {
                page,
                limit,
                total: count,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
                },
            };
        } catch (error) {
            throw new Error(`Error searching items: ${error.message}`);
        }
    }
    /**
     * Update item quantity (for inventory management)
     */
    static async updateQuantity(itemId, quantityChange) {
        try {
            const item = await this.getItemById(itemId);
            const newQuantity = item.quantity + quantityChange;

            if (newQuantity < 0) {
                throw {
                    status: 400,
                    message: 'Insufficient stock',
                };
            }

            item.quantity = newQuantity;
            await item.save();
            return item;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ItemService;
