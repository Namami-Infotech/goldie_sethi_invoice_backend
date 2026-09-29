const itemService = require('./item.service');

class ItemController {
  getAll = async (req, res) => {
    try {
      const { search, status } = req.query;
      const items = await itemService.getAllItems(search, status);
      res.json({ success: true, data: items });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getById = async (req, res) => {
    try {
      const item = await itemService.getItemById(req.params.id);
      if (!item) {
        return res.status(404).json({ success: false, message: 'Item not found' });
      }
      res.json({ success: true, data: item });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  create = async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ success: false, message: 'Item name is required' });
      }
      const item = await itemService.createItem(req.body);
      res.status(201).json({ success: true, message: 'Item created successfully', data: item });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  update = async (req, res) => {
    try {
      const item = await itemService.updateItem(req.params.id, req.body);
      if (!item) {
        return res.status(404).json({ success: false, message: 'Item not found' });
      }
      res.json({ success: true, message: 'Item updated successfully', data: item });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  delete = async (req, res) => {
    try {
      const success = await itemService.deleteItem(req.params.id);
      if (!success) {
        return res.status(404).json({ success: false, message: 'Item not found' });
      }
      res.json({ success: true, message: 'Item deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}

module.exports = new ItemController();
