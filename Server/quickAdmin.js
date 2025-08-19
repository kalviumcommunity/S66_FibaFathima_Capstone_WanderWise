// Quick admin creator - run this after creating a user account
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config();

async function makeAdmin() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to database');

    // Update user to admin
    const result = await mongoose.connection.db.collection('users').updateOne(
      { email: 'admin@wanderwise.com' },
      { $set: { role: 'admin' } }
    );

    if (result.matchedCount > 0) {
      console.log('✅ User updated to admin successfully!');
      console.log('🔑 Login with: admin@wanderwise.com / admin123');
      console.log('🌐 Access admin at: http://localhost:5173/admin');
    } else {
      console.log('❌ User not found. Please create account first at http://localhost:5173/signup');
    }

  } catch (error) {
    console.log('Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

makeAdmin();
