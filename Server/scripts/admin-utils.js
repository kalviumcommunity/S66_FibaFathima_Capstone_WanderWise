const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import the actual User model
const User = require('../models/user.model');

async function showMenu() {
    console.log('\n=== WanderWise Admin Utilities ===\n');
    console.log('1. Create Admin User');
    console.log('2. Make Existing User Admin');
    console.log('3. Verify Admin Credentials');
    console.log('4. Reset User Password');
    console.log('5. List All Admins');
    console.log('6. Check Database Status');
    console.log('0. Exit\n');
    console.log('Usage: node scripts/admin-utils.js [option_number]\n');
}

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('✅ Connected to MongoDB');

        // Check if admin exists
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('ℹ️  Admin user already exists:');
            console.log('📧 Email:', existingAdmin.email);
            console.log('👤 Username:', existingAdmin.username);
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
        console.log('\n⚠️  Remember to change the password after first login!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.code === 11000) {
            console.log('ℹ️  Admin user might already exist.');
        }
    } finally {
        await mongoose.disconnect();
    }
}

async function makeUserAdmin(email) {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('✅ Connected to MongoDB');

        const targetEmail = email || 'admin@wanderwise.com';
        console.log(`🔍 Looking for user with email: ${targetEmail}`);

        const user = await User.findOneAndUpdate(
            { email: targetEmail },
            { role: 'admin' },
            { new: true }
        );

        if (user) {
            console.log('🎉 User updated to admin successfully!');
            console.log('👤 Username:', user.username);
            console.log('📧 Email:', user.email);
            console.log('🔑 Role:', user.role);
        } else {
            console.log('❌ User not found with email:', targetEmail);
            console.log('💡 Create a user account first, then run this command again.');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
    }
}

async function verifyAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('✅ Connected to MongoDB');

        const admin = await User.findOne({ email: 'admin@wanderwise.com' });

        if (!admin) {
            console.log('❌ Admin user not found!');
            console.log('Creating admin user...');
            await createAdmin();
            return;
        }

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

        console.log('\n🔑 Admin Login Credentials:');
        console.log('📧 Email: admin@wanderwise.com');
        console.log('🔒 Password: admin123');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
    }
}

async function resetPassword(email, newPassword) {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('✅ Connected to MongoDB');

        const targetEmail = email || 'fibaaminnu@gmail.com';
        const password = newPassword || '123456';

        const user = await User.findOne({ email: targetEmail });

        if (user) {
            user.password = password;
            await user.save();
            console.log(`✅ Success! User ${targetEmail} password reset to: ${password}`);
        } else {
            console.log(`❌ User ${targetEmail} not found.`);
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.disconnect();
    }
}

async function listAdmins() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('✅ Connected to MongoDB');

        const admins = await User.find({ role: 'admin' }).select('username email isActive createdAt');

        if (admins.length === 0) {
            console.log('❌ No admin users found.');
            return;
        }

        console.log(`\n📋 Found ${admins.length} admin user(s):\n`);
        admins.forEach((admin, index) => {
            console.log(`${index + 1}. ${admin.username}`);
            console.log(`   Email: ${admin.email}`);
            console.log(`   Active: ${admin.isActive ? '✅' : '❌'}`);
            console.log(`   Created: ${admin.createdAt.toLocaleDateString()}\n`);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
    }
}

async function checkDatabaseStatus() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('✅ Connected to MongoDB');

        const totalUsers = await User.countDocuments();
        const adminCount = await User.countDocuments({ role: 'admin' });
        const activeUsers = await User.countDocuments({ isActive: true });

        console.log('\n📊 Database Status:');
        console.log(`Total Users: ${totalUsers}`);
        console.log(`Admin Users: ${adminCount}`);
        console.log(`Active Users: ${activeUsers}`);
        console.log(`Inactive Users: ${totalUsers - activeUsers}\n`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
    }
}

// Main execution
async function main() {
    const option = process.argv[2];

    if (!option) {
        showMenu();
        return;
    }

    const email = process.argv[3];
    const newPassword = process.argv[4];

    switch (option) {
        case '1':
            await createAdmin();
            break;
        case '2':
            await makeUserAdmin(email);
            break;
        case '3':
            await verifyAdmin();
            break;
        case '4':
            await resetPassword(email, newPassword);
            break;
        case '5':
            await listAdmins();
            break;
        case '6':
            await checkDatabaseStatus();
            break;
        default:
            console.log('❌ Invalid option. Please choose 0-6.\n');
            showMenu();
    }
}

main();
