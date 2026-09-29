const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Item = sequelize.define('Item', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
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
  gstRate: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 18 // Default 18%
  },
  gstAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
    allowNull: false,
    defaultValue: 'ACTIVE'
  }
}, {
  timestamps: true,
  tableName: 'items',
  hooks: {
    beforeSave: (item) => {
      const taxable = (item.pricePerUnit || 0) * (item.qty || 1);
      const rate = item.gstRate || 0;
      item.gstAmount = Number(((taxable * rate) / 100).toFixed(2));
      item.totalAmount = Number((taxable + item.gstAmount).toFixed(2));
    }
  }
});

module.exports = Item;
