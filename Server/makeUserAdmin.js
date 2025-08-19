const mongoose = require('mongoose');
require('dotenv').config();

// Simple User schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  bio: String,
  profilePicture: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function makeUserAdmin() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB');

    // Get email from command line argument or use default
    const email = process.argv[2] || 'admin@wanderwise.com';
    
    console.log(`🔍 Looking for user with email: ${email}`);
    
    // Find and update user
    const user = await User.findOneAndUpdate(
      { email: email },
      { role: 'admin' },
      { new: true }
    );

    if (user) {
      console.log('🎉 User updated to admin successfully!');
      console.log('👤 Username:', user.username);
      console.log('📧 Email:', user.email);
      console.log('🔑 Role:', user.role);
      console.log('\n🌐 You can now access admin page at: http://localhost:5173/admin');
    } else {
      console.log('❌ User not found with email:', email);
      console.log('💡 Create a user account first, then run:');
      console.log(`node makeUserAdmin.js your-email@example.com`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

makeUserAdmin();
