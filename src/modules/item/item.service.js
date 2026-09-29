const { Op } = require('sequelize');
const Item = require('./item.model');

class ItemService {
  async getAllItems(search = '', status = '') {
    const where = {};
    if (status) {
      where.status = status;
    } else {
      where.status = { [Op.ne]: 'INACTIVE' };
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { hsnSac: { [Op.like]: `%${search}%` } }
      ];
    }
    return await Item.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });
  }

  async getItemById(id) {
    return await Item.findByPk(id);
  }

  async createItem(data) {
    const qty = Number(data.qty) || 1;
    const pricePerUnit = Number(data.pricePerUnit) || 0;
    const gstRate = Number(data.gstRate) || 0;
    const taxable = qty * pricePerUnit;
    const gstAmount = Number(((taxable * gstRate) / 100).toFixed(2));
    const totalAmount = Number((taxable + gstAmount).toFixed(2));

    return await Item.create({
      name: data.name,
      hsnSac: data.hsnSac || '',
      qty,
      unit: data.unit || 'Pcs',
      pricePerUnit,
      gstRate,
      gstAmount,
      totalAmount,
      status: data.status || 'ACTIVE'
    });
  }

  async updateItem(id, data) {
    const item = await Item.findByPk(id);
    if (!item) return null;

    const qty = data.qty !== undefined ? Number(data.qty) : item.qty;
    const pricePerUnit = data.pricePerUnit !== undefined ? Number(data.pricePerUnit) : item.pricePerUnit;
    const gstRate = data.gstRate !== undefined ? Number(data.gstRate) : item.gstRate;
    const taxable = qty * pricePerUnit;
    const gstAmount = Number(((taxable * gstRate) / 100).toFixed(2));
    const totalAmount = Number((taxable + gstAmount).toFixed(2));

    return await item.update({
      name: data.name !== undefined ? data.name : item.name,
      hsnSac: data.hsnSac !== undefined ? data.hsnSac : item.hsnSac,
      qty,
      unit: data.unit !== undefined ? data.unit : item.unit,
      pricePerUnit,
      gstRate,
      gstAmount,
      totalAmount,
      status: data.status !== undefined ? data.status : item.status
    });
  }

  async deleteItem(id) {
    const item = await Item.findByPk(id);
    if (!item) return false;
    await item.update({ status: 'INACTIVE' });
    return true;
  }
}

module.exports = new ItemService();
