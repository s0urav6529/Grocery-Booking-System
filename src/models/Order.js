const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

class Order extends Model {}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    actorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'actors',
        key: 'id',
      },
      comment: 'Reference to the actor who placed the order',
    },
    totalPrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.0,
      comment: 'Total order amount',
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
      comment: 'Order status',
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Optional customer note',
    },
  },
  {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    timestamps: true,
  }
);

module.exports = Order;
