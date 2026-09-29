const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const InvoiceItem = sequelize.define('InvoiceItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  invoiceId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  itemId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  itemName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  hsnSac: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ''
  },
  qty: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 1
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Pcs'
  },
  pricePerUnit: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  taxableAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  gstRate: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 18
  },
  cgstRate: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  cgstAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  sgstRate: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  sgstAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  igstRate: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  igstAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  }
}, {
  timestamps: true,
  tableName: 'invoice_items'
});

module.exports = InvoiceItem;
