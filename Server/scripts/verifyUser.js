const mongoose = require('mongoose');
const User = require('../models/user.model');
require('dotenv').config();

async function verify() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to database');

        const email = 'fibaaminnu@gmail.com';
        const user = await User.findOne({ email });

        if (user) {
            console.log('✅ User Found:');
            console.log(`- Email: ${user.email}`);
            console.log(`- Role: ${user.role}`);
            console.log(`- Has Password: ${!!user.password}`);
            console.log(`- Hashed Password Length: ${user.password ? user.password.length : 'N/A'}`);
            console.log(`- Google ID: ${user.googleId || 'None'}`);
        } else {
            console.log(`❌ User ${email} not found in database.`);
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

verify();
