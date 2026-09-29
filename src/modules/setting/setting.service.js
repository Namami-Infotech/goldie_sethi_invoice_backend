const Setting = require('./setting.model');

class SettingService {
  async getSettings() {
    let setting = await Setting.findOne();
    if (!setting) {
      setting = await Setting.create({
        companyName: 'Namami Enterprises Pvt Ltd',
        fullAddress: 'Plot No. 42, GIDC Phase 2, Industrial Area',
        state: 'Gujarat',
        city: 'Ahmedabad',
        pincode: '380001',
        phoneNo: '+91 98765 43210',
        gstin: '24AAACN1234F1Z8',
        hsa: 'HSA-998822',
        email: 'billing@namamienterprises.com',
        bankName: 'State Bank of India',
        accountNumber: '382910482910',
        ifscCode: 'SBIN0001234',
        accountHolderName: 'Namami Enterprises Pvt Ltd'
      });
    }
    return setting;
  }

  async updateSettings(data) {
    let setting = await Setting.findOne();
    if (!setting) {
      setting = await Setting.create(data);
    } else {
      await setting.update(data);
    }
    return setting;
  }
}

module.exports = new SettingService();
