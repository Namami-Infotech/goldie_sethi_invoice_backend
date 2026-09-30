const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../user/user.model');

const JWT_SECRET = process.env.JWT_SECRET || 'namami_invoice_secret_key_2025';

class AuthService {
  /**
   * Ensure at least one Admin account exists in the database
   */
  async ensureDefaultAdmin() {
    try {
      const existingAdmin = await User.findOne({ where: { role: 'ADMIN' } });
      if (!existingAdmin) {
        const hashedPassword = bcrypt.hashSync('123456', 10);
        await User.create({
          name: 'Admin',
          role: 'ADMIN',
          email: 'admin@namamienterprises.com',
          contactNumber: '9999999999',
          state: 'Gujarat',
          city: 'Surat',
          status: 'ACTIVE',
          password: hashedPassword
        });
        console.log('👑 [Auth] Admin account seeded (admin@namamienterprises.com / 123456)');
      } else if (!existingAdmin.password) {
        existingAdmin.password = bcrypt.hashSync('123456', 10);
        await existingAdmin.save();
        console.log('👑 [Auth] Added password (123456) to existing Admin account');
      }
    } catch (err) {
      console.warn('⚠️ [Auth] ensureDefaultAdmin warning:', err.message);
    }
  }

  /**
   * Only ADMIN users are permitted to log in
   */
  async login(identifier, password) {
    const idStr = String(identifier || '').trim();
    const pwdStr = String(password || '').trim();

    if (!idStr || !pwdStr) {
      return { success: false, statusCode: 400, message: 'Please provide both username/email and password' };
    }

    // Ensure default admin exists if DB is fresh
    await this.ensureDefaultAdmin();

    // Look up user by email, contactNumber, or name
    let user = await User.findOne({
      where: {
        [Op.or]: [
          { email: idStr },
          { contactNumber: idStr },
          { name: idStr }
        ]
      }
    });

    if (!user) {
      return { success: false, statusCode: 401, message: 'Invalid username/email or password' };
    }

    // STRICT CHECK: Only ADMIN is allowed to log in
    if (user.role !== 'ADMIN') {
      return {
        success: false,
        statusCode: 403,
        message: 'Access Denied: Only Administrator accounts can log in.'
      };
    }

    if (user.status === 'INACTIVE') {
      return {
        success: false,
        statusCode: 403,
        message: 'Account is inactive. Please contact system support.'
      };
    }

    // Validate password
    let isMatch = false;
    if (user.password) {
      isMatch = bcrypt.compareSync(pwdStr, user.password) || (user.password === pwdStr);
    } else {
      // Fallback for admin without password yet
      if (pwdStr === 'admin123' || pwdStr === 'admin') {
        user.password = bcrypt.hashSync(pwdStr, 10);
        await user.save();
        isMatch = true;
      }
    }

    if (!isMatch) {
      return { success: false, statusCode: 401, message: 'Invalid username/email or password' };
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        contactNumber: user.contactNumber,
        role: user.role
      }
    };
  }

  /**
   * Verify token and return user
   */
  async verifyToken(token) {
    if (!token) return null;
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.role !== 'ADMIN') return null;
      const user = await User.findByPk(decoded.id);
      if (!user || user.role !== 'ADMIN' || user.status === 'INACTIVE') return null;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        contactNumber: user.contactNumber,
        role: user.role
      };
    } catch {
      return null;
    }
  }
}

module.exports = new AuthService();
