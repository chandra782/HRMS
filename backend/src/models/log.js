const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Log = sequelize.define('Log', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  organisation_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'organisations',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false
  },
  meta: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'logs',
  timestamps: false
});

module.exports = Log;
