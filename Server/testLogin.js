const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Import the actual User model
const User = require('./models/user.model');

async function testLogin() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB');

    const email = 'admin@wanderwise.com';
    const password = 'admin123';

    console.log('\n🔍 Testing login for:', email);

    // Find user by email
    const user = await User.findOne({ email });
    console.log('User found:', user ? {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
      isActive: user.isActive,
      hasPassword: !!user.password
    } : 'No user found');

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    if (!user.isActive) {
      console.log('❌ User is not active');
      return;
    }

    // Test password comparison
    console.log('\n🔒 Testing password...');
    const isMatch = await user.comparePassword(password);
    console.log('Password match result:', isMatch);

    if (isMatch) {
      console.log('✅ Login would succeed!');
      console.log('User data that would be returned:', {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      });
    } else {
      console.log('❌ Password does not match');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

testLogin();
