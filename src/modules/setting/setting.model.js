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
    allowNull: false,
    defaultValue: 'Namami Enterprises Pvt Ltd'
  },
  fullAddress: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: 'Plot No. 42, GIDC Phase 2, Industrial Area'
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Gujarat'
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Ahmedabad'
  },
  pincode: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '380001'
  },
  phoneNo: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '+91 98765 43210'
  },
  gstin: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '24AAACN1234F1Z8'
  },
  hsa: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'HSA-998822'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'billing@namamienterprises.com'
  },
  // Bank Details
  bankName: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'State Bank of India'
  },
  accountNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '382910482910'
  },
  ifscCode: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'SBIN0001234'
  },
  accountHolderName: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Namami Enterprises Pvt Ltd'
  }
}, {
  timestamps: true,
  tableName: 'settings'
});

module.exports = Setting;
