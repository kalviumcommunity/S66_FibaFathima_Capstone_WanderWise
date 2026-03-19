const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/user.model');

async function verifyAndFixAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB\n');

    // Find admin user
    const admin = await User.findOne({ email: 'admin@wanderwise.com' });

    if (!admin) {
      console.log('❌ Admin user not found!');
      console.log('Creating admin user...\n');
      
      const newAdmin = new User({
        username: 'admin',
        email: 'admin@wanderwise.com',
        password: 'admin123',
        role: 'admin',
        bio: 'System Administrator',
        isActive: true
      });

      await newAdmin.save();
      console.log('✅ Admin user created successfully!\n');
      console.log('🔑 Login Credentials:');
      console.log('   Email: admin@wanderwise.com');
      console.log('   Password: admin123\n');
      return;
    }

    console.log('✅ Admin user found:');
    console.log('   Email:', admin.email);
    console.log('   Username:', admin.username);
    console.log('   Role:', admin.role);
    console.log('   Active:', admin.isActive);
    console.log('   Has Password:', !!admin.password);
    console.log('   Password Hash Length:', admin.password ? admin.password.length : 0);

    // Test if current password works
    const testPassword = await bcrypt.compare('admin123', admin.password);
    console.log('\n🔒 Testing password "admin123":', testPassword ? '✅ VALID' : '❌ INVALID');

    if (!testPassword) {
      console.log('\n⚠️  Password does not match. Resetting to "admin123"...\n');
      admin.password = 'admin123';
      await admin.save();
      console.log('✅ Password reset successfully!\n');
    }

    console.log('🔑 Login Credentials:');
    console.log('   Email: admin@wanderwise.com');
    console.log('   Password: admin123\n');
    console.log('💡 Try logging in now at: https://wanderwiseca.netlify.app/login\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

verifyAndFixAdmin();
