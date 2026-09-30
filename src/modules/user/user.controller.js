const userService = require('./user.service');

class UserController {
  getAll = async (req, res) => {
    try {
      const { role, search, status } = req.query;
      // Admin users should not be returned in user listing
      const targetRole = (role && role !== 'ADMIN') ? role : 'USER';
      const users = await userService.getAllUsers(targetRole, search, status);
      res.json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getById = async (req, res) => {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  create = async (req, res) => {
    try {
      const { name, state } = req.body;
      if (!name) {
        return res.status(400).json({ success: false, message: 'Name is required' });
      }
      if (!state) {
        return res.status(400).json({ success: false, message: 'State is required' });
      }
      const user = await userService.createUser(req.body);
      res.status(201).json({ success: true, message: 'User created successfully', data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  update = async (req, res) => {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.json({ success: true, message: 'User updated successfully', data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  delete = async (req, res) => {
    try {
      const result = await userService.deleteUser(req.params.id);
      if (!result.success) {
        return res.status(result.statusCode || 400).json({ success: false, message: result.message });
      }
      res.json({ success: true, message: result.message });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}

module.exports = new UserController();
