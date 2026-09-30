const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Setting = sequelize.define('Setting', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ''
  },
  fullAddress: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: ''
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ''
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ''
  },
  pincode: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  phoneNo: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  gstin: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  hsa: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  // Bank Details
  bankName: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  accountNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  ifscCode: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  accountHolderName: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  }
}, {
  timestamps: true,
  tableName: 'settings'
});

module.exports = Setting;
