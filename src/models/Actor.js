const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

class Actor extends Model {}

Actor.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    contact: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
      comment: 'Contact information: email or phone',
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      allowNull: false,
      defaultValue: 'user',
    },
  },
  {
    sequelize,
    modelName: 'Actor',
    tableName: 'actors',
    timestamps: true,
  }
);

module.exports = Actor;