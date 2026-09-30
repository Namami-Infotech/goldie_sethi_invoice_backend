const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');
const { sequelize, initDatabase } = require('../config/database');
const User = require('../modules/user/user.model');

async function setAdminPassword() {
  try {
    await initDatabase();
    await sequelize.sync({ alter: true });

    const targetEmail = 'admin@namamienterprises.com';
    const plainPassword = '123456';
    const hashedPassword = bcrypt.hashSync(plainPassword, 10);

    let user = await User.findOne({ where: { email: targetEmail } });

    if (user) {
      user.password = hashedPassword;
      user.role = 'ADMIN';
      user.status = 'ACTIVE';
      await user.save();
      console.log(`✅ [Success] Updated existing user ${targetEmail} (ID: ${user.id})`);
      console.log(`👑 Role: ${user.role} | Status: ${user.status} | Password hashed: 123456`);
    } else {
      user = await User.create({
        name: 'Admin',
        role: 'ADMIN',
        email: targetEmail,
        contactNumber: '9999999999',
        state: 'Gujarat',
        city: 'Surat',
        status: 'ACTIVE',
        password: hashedPassword
      });
      console.log(`✅ [Success] Created new ADMIN user ${targetEmail} (ID: ${user.id})`);
      console.log(`👑 Password hashed: 123456`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting admin password:', error.message);
    process.exit(1);
  }
}

setAdminPassword();
