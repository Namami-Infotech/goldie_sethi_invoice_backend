const settingService = require('./setting.service');

class SettingController {
  get = async (req, res) => {
    try {
      const setting = await settingService.getSettings();
      res.json({ success: true, data: setting });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  update = async (req, res) => {
    try {
      const setting = await settingService.updateSettings(req.body);
      res.json({ success: true, message: 'Settings updated successfully', data: setting });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}

module.exports = new SettingController();
