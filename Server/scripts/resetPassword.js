const mongoose = require('mongoose');
const User = require('../models/user.model');
require('dotenv').config();

async function resetPassword() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to database');

        const email = 'fibaaminnu@gmail.com';
        const newPassword = '123456'; // 6 chars to match user's persistent input

        const user = await User.findOne({ email });

        if (user) {
            user.password = newPassword;
            user.role = 'admin';
            await user.save();
            console.log(`✅ Success! User ${email} password reset to: ${newPassword}`);
        } else {
            console.log(`❌ User ${email} not found.`);
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

resetPassword();
