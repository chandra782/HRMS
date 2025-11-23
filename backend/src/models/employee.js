// employee.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('Employee', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    organisation_id: { type: DataTypes.INTEGER },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING
  }, { tableName: 'employees', timestamps: true, createdAt: 'created_at', updatedAt: false });
