const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: 3306, // Default MySQL port
  dialect: 'mysql',
  // You can specify additional options here, such as port, logging, etc.
});

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING(64), // Adjust the length according to your database schema
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(64), // Adjust the length according to your database schema
    allowNull: false
  }
}, {
  timestamps: false, // This tells Sequelize not to look for the `createdAt` and `updatedAt` columns
});

const Flat = sequelize.define('Flat', {
  flat_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(64), // Adjust the length according to your database schema
    allowNull: false
  },
  address: {
    type: DataTypes.STRING(64), // Adjust the length according to your database schema
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true // Set to true if latitude can be null, or false if it must be provided
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true // Set to true if longitude can be null, or false if it must be provided
  }
}, {
  timestamps: false,
  tableName: 'Flat'
});

const FlatRecord = sequelize.define('FlatRecord', {
  record_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id'
    }
  },
  flat_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Flat,
      key: 'flat_id'
    }
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  review: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW  // Sets the default value to the current date and time
  },
}, {
  timestamps: false,
  tableName: 'FlatRecord'
});


module.exports = {
  sequelize,
  User,
  Flat,
  FlatRecord,
};

Flat.hasMany(FlatRecord, { foreignKey: 'flat_id' });
FlatRecord.belongsTo(Flat, { foreignKey: 'flat_id' });