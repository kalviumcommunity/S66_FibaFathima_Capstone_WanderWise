const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function checkDeploymentReadiness() {
  console.log('🔍 Checking deployment readiness...\n');

  // Check environment variables
  console.log('📋 Environment Variables:');
  const requiredEnvVars = ['MONGO_URL', 'JWT_SECRET', 'PORT'];
  const optionalEnvVars = ['GOOGLE_CLIENT_ID', 'CLIENT_ORIGIN', 'NODE_ENV'];
  
  let envIssues = 0;
  
  requiredEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
      console.log(`✅ ${envVar}: Set`);
    } else {
      console.log(`❌ ${envVar}: Missing (REQUIRED)`);
      envIssues++;
    }
  });
  
  optionalEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
      console.log(`✅ ${envVar}: Set`);
    } else {
      console.log(`⚠️  ${envVar}: Missing (Optional)`);
    }
  });

  // Check MongoDB connection
  console.log('\n🗄️  Database Connection:');
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ MongoDB: Connected successfully');
    
    // Test basic operations
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`✅ Collections found: ${collections.length}`);
    
    await mongoose.disconnect();
  } catch (error) {
    console.log('❌ MongoDB: Connection failed');
    console.log(`   Error: ${error.message}`);
    envIssues++;
  }

  // Check dependencies
  console.log('\n📦 Dependencies:');
  try {
    const packageJson = require('../package.json');
    const requiredDeps = [
      'express', 'mongoose', 'jsonwebtoken', 'bcryptjs', 
      'cors', 'dotenv', 'google-auth-library'
    ];
    
    requiredDeps.forEach(dep => {
      if (packageJson.dependencies[dep]) {
        console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
      } else {
        console.log(`❌ ${dep}: Missing`);
        envIssues++;
      }
    });
  } catch (error) {
    console.log('❌ Could not read package.json');
    envIssues++;
  }

  // Check critical files
  console.log('\n📁 Critical Files:');
  const fs = require('fs');
  const criticalFiles = [
    'server.js',
    'Routes/Auth.js',
    'Routes/destination.js',
    'Routes/Trip.js',
    'Routes/journals.js',
    'models/user.model.js',
    'models/destination.model.js',
    'models/Trip.model.js',
    'models/Journal.model.js',
    'middleware/auth.js',
    'db/database.js'
  ];

  criticalFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}: Exists`);
    } else {
      console.log(`❌ ${file}: Missing`);
      envIssues++;
    }
  });

  // Summary
  console.log('\n📊 Deployment Readiness Summary:');
  if (envIssues === 0) {
    console.log('🎉 All checks passed! Ready for deployment.');
    console.log('\n🚀 Deployment Instructions:');
    console.log('1. Set environment variables in Render dashboard');
    console.log('2. Connect GitHub repository to Render');
    console.log('3. Set build command: npm install');
    console.log('4. Set start command: npm start');
    console.log('5. Deploy from main branch');
  } else {
    console.log(`❌ ${envIssues} issues found. Please fix before deployment.`);
  }

  process.exit(envIssues === 0 ? 0 : 1);
}

// Run the check
checkDeploymentReadiness().catch(error => {
  console.error('❌ Deployment check failed:', error);
  process.exit(1);
});
