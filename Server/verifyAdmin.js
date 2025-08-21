const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Simple User schema for verification
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

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

async function verifyAdmin() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB');

    // Find admin user
    const admin = await User.findOne({ email: 'admin@wanderwise.com' });
    
    if (!admin) {
      console.log('❌ Admin user not found!');
      console.log('Creating admin user...');
      
      const newAdmin = new User({
        username: 'admin',
        email: 'admin@wanderwise.com',
        password: 'admin123',
        role: 'admin',
        bio: 'System Administrator',
        isActive: true
      });

      await newAdmin.save();
      console.log('✅ Admin user created successfully!');
    } else {
      console.log('✅ Admin user found:');
      console.log('📧 Email:', admin.email);
      console.log('👤 Username:', admin.username);
      console.log('🔑 Role:', admin.role);
      console.log('✅ Active:', admin.isActive);
      
      // Test password
      const isPasswordValid = await admin.comparePassword('admin123');
      console.log('🔒 Password test:', isPasswordValid ? '✅ Valid' : '❌ Invalid');
      
      if (!isPasswordValid) {
        console.log('🔧 Fixing password...');
        admin.password = 'admin123';
        await admin.save();
        console.log('✅ Password updated!');
      }
    }

    console.log('\n🔑 Admin Login Credentials:');
    console.log('📧 Email: admin@wanderwise.com');
    console.log('🔒 Password: admin123');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

verifyAdmin();
