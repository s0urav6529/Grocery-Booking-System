require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 20,
      min: 0,
      idle: 30000,
      acquire: 20000,
    },
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true,
    },
  }
);

const DB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

    // Import models
    const { Actor, Item, Order, OrderItem, InventoryHistory } = require('../models/init');

    // Sync models in correct order (dependencies first)
    await Actor.sync();
    await Item.sync();
    await Order.sync();
    await OrderItem.sync();
    await InventoryHistory.sync();

    console.log("Database synced successfully");

    return sequelize;
  } catch (error) {
    console.error("Database initialization error:", error);
    process.exit(1);
  }
};

module.exports = { sequelize, DB };