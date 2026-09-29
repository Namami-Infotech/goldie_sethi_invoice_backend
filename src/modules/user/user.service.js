const { Op } = require('sequelize');
const User = require('./user.model');

class UserService {
  async getAllUsers(role = '', search = '', status = '') {
    const where = {};

    if (status) {
      where.status = status;
    } else {
      where.status = { [Op.ne]: 'INACTIVE' };
    }

    if (role && (role === 'USER' || role === 'ADMIN')) {
      where.role = role;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { contactNumber: { [Op.like]: `%${search}%` } },
        { state: { [Op.like]: `%${search}%` } },
        { city: { [Op.like]: `%${search}%` } }
      ];
    }

    return await User.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });
  }

  async getUserById(id) {
    return await User.findByPk(id);
  }

  async createUser(data) {
    return await User.create({
      name: data.name,
      role: data.role || 'USER',
      fullAddress: data.fullAddress || '',
      state: data.state || '',
      city: data.city || '',
      area: data.area || '',
      pincode: data.pincode || '',
      contactNumber: data.contactNumber || '',
      email: data.email || '',
      status: data.status || 'ACTIVE'
    });
  }

  async updateUser(id, data) {
    const user = await User.findByPk(id);
    if (!user) return null;

    return await user.update({
      name: data.name !== undefined ? data.name : user.name,
      role: data.role !== undefined ? data.role : user.role,
      fullAddress: data.fullAddress !== undefined ? data.fullAddress : user.fullAddress,
      state: data.state !== undefined ? data.state : user.state,
      city: data.city !== undefined ? data.city : user.city,
      area: data.area !== undefined ? data.area : user.area,
      pincode: data.pincode !== undefined ? data.pincode : user.pincode,
      contactNumber: data.contactNumber !== undefined ? data.contactNumber : user.contactNumber,
      email: data.email !== undefined ? data.email : user.email,
      status: data.status !== undefined ? data.status : user.status
    });
  }

  async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) {
      return { success: false, statusCode: 404, message: 'User not found' };
    }

    // Protection: Admin users cannot be deleted
    if (user.role === 'ADMIN') {
      return {
        success: false,
        statusCode: 400,
        message: 'Admin user cannot be deleted. Role ADMIN is protected.'
      };
    }

    // Soft delete: mark status as INACTIVE
    await user.update({ status: 'INACTIVE' });
    return {
      success: true,
      message: 'User status successfully updated to INACTIVE'
    };
  }
}

module.exports = new UserService();
