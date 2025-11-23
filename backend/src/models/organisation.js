const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Organisation = sequelize.define('Organisation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'organisations',
  timestamps: true
});

module.exports = Organisation;
