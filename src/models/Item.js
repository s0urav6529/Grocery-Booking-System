const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

class Item extends Model {}

Item.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: 'Name of the grocery item',
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
      comment: 'Slug for the item name',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Detailed description of the item',
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
      comment: 'Price of the item',
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
      comment: 'Available quantity in stock',
    },
    sku: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
      comment: 'Stock Keeping Unit - unique identifier',
    },
    unit: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'pcs',
      comment: 'Unit of measurement (kg, liter, pcs, etc.)',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Item availability status',
    },
  },
  {
    sequelize,
    modelName: 'Item',
    tableName: 'items',
    timestamps: true,
  }
);

module.exports = Item;
