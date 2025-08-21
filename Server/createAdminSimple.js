const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Simple User schema for admin creation
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  bio: String,
  profilePicture: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB');

    // Check if admin exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists:');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Username:', existingAdmin.username);
      console.log('\n🔑 Use these credentials to login:');
      console.log('Email: admin@wanderwise.com');
      console.log('Password: admin123');
      return;
    }

    // Create new admin
    console.log('👤 Creating admin user...');
    const admin = new User({
      username: 'admin',
      email: 'admin@wanderwise.com',
      password: 'admin123',
      role: 'admin',
      bio: 'System Administrator',
      isActive: true
    });

    await admin.save();
    console.log('🎉 Admin user created successfully!');
    console.log('\n🔑 Admin Login Credentials:');
    console.log('📧 Email: admin@wanderwise.com');
    console.log('🔒 Password: admin123');
    console.log('\n🌐 Access admin page at: http://localhost:5173/admin');
    console.log('⚠️  Remember to change the password after first login!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 11000) {
      console.log('ℹ️  Admin user might already exist. Try logging in with:');
      console.log('📧 Email: admin@wanderwise.com');
      console.log('🔒 Password: admin123');
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createAdmin();
