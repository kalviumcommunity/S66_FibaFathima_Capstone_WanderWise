const mongoose = require('mongoose');
const User = require('../models/user.model');
require('dotenv').config();

async function setupUser() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to database');

        const email = 'fibaaminnu@gmail.com';
        const password = 'password123';

        let user = await User.findOne({ email });

        if (user) {
            console.log(`User ${email} found, updating password and role...`);
            user.password = password;
            user.role = 'admin';
            await user.save();
            console.log('✅ User updated successfully!');
        } else {
            console.log(`User ${email} not found, creating new account...`);
            user = new User({
                username: 'Fiba',
                email,
                password,
                role: 'admin',
                isActive: true
            });
            await user.save();
            console.log('✅ User created successfully!');
        }

        console.log('\n--- Credentials ---');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('-------------------\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

setupUser();
