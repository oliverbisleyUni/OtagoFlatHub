const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: 3306, // Default MySQL port
  dialect: 'mysql',
  // You can specify additional options here, such as port, logging, etc.
});

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  timestamps: false, // This tells Sequelize not to look for the `createdAt` and `updatedAt` columns
});

module.exports = {
  sequelize,
  User
};
