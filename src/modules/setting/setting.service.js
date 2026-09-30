const Setting = require('./setting.model');

class SettingService {
  async getSettings() {
    let setting = await Setting.findOne();
    if (!setting) {
      setting = await Setting.create({
        companyName: '',
        fullAddress: '',
        state: '',
        city: '',
        pincode: '',
        phoneNo: '',
        gstin: '',
        hsa: '',
        email: '',
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        accountHolderName: ''
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
