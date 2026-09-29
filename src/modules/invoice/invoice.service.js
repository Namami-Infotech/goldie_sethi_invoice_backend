const { Op } = require('sequelize');
const { Invoice, InvoiceItem } = require('./invoice.model');
const Setting = require('../setting/setting.model');

class InvoiceService {
  // Helper method to compute tax for items based on states
  computeItemTax(item, isSameState) {
    const qty = Number(item.qty) || 1;
    const pricePerUnit = Number(item.pricePerUnit) || 0;
    const taxableAmount = Number((qty * pricePerUnit).toFixed(2));
    const gstRate = Number(item.gstRate) || 0;

    let cgstRate = 0;
    let cgstAmount = 0;
    let sgstRate = 0;
    let sgstAmount = 0;
    let igstRate = 0;
    let igstAmount = 0;

    if (isSameState) {
      // Intra-state: Split GST equally into CGST & SGST
      cgstRate = Number((gstRate / 2).toFixed(2));
      sgstRate = Number((gstRate / 2).toFixed(2));
      cgstAmount = Number(((taxableAmount * cgstRate) / 100).toFixed(2));
      sgstAmount = Number(((taxableAmount * sgstRate) / 100).toFixed(2));
    } else {
      // Inter-state: Full GST applies as IGST
      igstRate = gstRate;
      igstAmount = Number(((taxableAmount * igstRate) / 100).toFixed(2));
    }

    const totalTax = Number((cgstAmount + sgstAmount + igstAmount).toFixed(2));
    const totalAmount = Number((taxableAmount + totalTax).toFixed(2));

    return {
      itemId: item.itemId || null,
      itemName: item.itemName || item.name || 'Item',
      hsnSac: item.hsnSac || '',
      qty,
      unit: item.unit || 'Pcs',
      pricePerUnit,
      taxableAmount,
      gstRate,
      cgstRate,
      cgstAmount,
      sgstRate,
      sgstAmount,
      igstRate,
      igstAmount,
      totalAmount
    };
  }

  async generateInvoiceNumber() {
    const year = new Date().getFullYear();
    const count = await Invoice.count();
    const sequence = String(count + 1).padStart(4, '0');
    return `INV-${year}-${sequence}`;
  }

  async getAllInvoices(status = '', search = '') {
    const where = {};

    if (status) {
      where.status = status;
    } else {
      where.status = { [Op.ne]: 'INACTIVE' };
    }

    if (search) {
      where[Op.or] = [
        { invoiceNumber: { [Op.like]: `%${search}%` } },
        { customerName: { [Op.like]: `%${search}%` } },
        { customerState: { [Op.like]: `%${search}%` } },
        { companyState: { [Op.like]: `%${search}%` } }
      ];
    }

    return await Invoice.findAll({
      where,
      include: [{ model: InvoiceItem, as: 'items' }],
      order: [['createdAt', 'DESC']]
    });
  }

  async getInvoiceById(id) {
    return await Invoice.findByPk(id, {
      include: [{ model: InvoiceItem, as: 'items' }]
    });
  }

  async createInvoice(payload) {
    const {
      userId,
      customerName,
      customerState,
      customerCity,
      customerAddress,
      customerPhone,
      customerEmail,
      invoiceDate,
      dueDate,
      status,
      notes,
      items = []
    } = payload;

    // Get current company settings
    let setting = await Setting.findOne();
    if (!setting) {
      setting = {
        companyName: 'Namami Enterprises Pvt Ltd',
        state: 'Gujarat',
        city: 'Ahmedabad',
        fullAddress: 'Plot No. 42, GIDC Phase 2, Industrial Area',
        gstin: '24AAACN1234F1Z8',
        phoneNo: '+91 98765 43210'
      };
    }

    const companyStateClean = (setting.state || '').trim().toLowerCase();
    const customerStateClean = (customerState || '').trim().toLowerCase();
    const isSameState = Boolean(companyStateClean && customerStateClean && companyStateClean === customerStateClean);

    // Compute all items with tax
    const computedItems = items.map(item => this.computeItemTax(item, isSameState));

    let subtotal = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    let totalIgst = 0;

    for (const item of computedItems) {
      subtotal += item.taxableAmount;
      totalCgst += item.cgstAmount;
      totalSgst += item.sgstAmount;
      totalIgst += item.igstAmount;
    }

    subtotal = Number(subtotal.toFixed(2));
    totalCgst = Number(totalCgst.toFixed(2));
    totalSgst = Number(totalSgst.toFixed(2));
    totalIgst = Number(totalIgst.toFixed(2));
    const totalTax = Number((totalCgst + totalSgst + totalIgst).toFixed(2));
    const grandTotal = Number((subtotal + totalTax).toFixed(2));

    const invoiceNumber = payload.invoiceNumber || await this.generateInvoiceNumber();

    const invoice = await Invoice.create({
      invoiceNumber,
      invoiceDate: invoiceDate || new Date(),
      dueDate: dueDate || null,
      userId: userId || null,
      customerName: customerName || 'Customer',
      customerState: customerState || '',
      customerCity: customerCity || '',
      customerAddress: customerAddress || '',
      customerPhone: customerPhone || '',
      customerEmail: customerEmail || '',
      companyName: setting.companyName,
      companyState: setting.state,
      companyAddress: setting.fullAddress,
      companyGstin: setting.gstin,
      companyPhone: setting.phoneNo,
      isSameState,
      subtotal,
      totalCgst,
      totalSgst,
      totalIgst,
      totalTax,
      grandTotal,
      status: status || 'PENDING',
      notes: notes || ''
    });

    const invoiceItemsData = computedItems.map(item => ({
      ...item,
      invoiceId: invoice.id
    }));

    await InvoiceItem.bulkCreate(invoiceItemsData);

    return await this.getInvoiceById(invoice.id);
  }

  async updateInvoiceStatus(id, status) {
    const invoice = await Invoice.findByPk(id);
    if (!invoice) return null;
    return await invoice.update({ status });
  }

  async deleteInvoice(id) {
    const invoice = await Invoice.findByPk(id);
    if (!invoice) return false;
    await invoice.update({ status: 'INACTIVE' });
    return true;
  }
}

module.exports = new InvoiceService();
