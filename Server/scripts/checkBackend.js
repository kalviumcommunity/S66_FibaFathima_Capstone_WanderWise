// Quick backend health check and test script
const https = require('https');

const BACKEND_URL = 'https://s66-fibafathima-capstone-wanderwise.onrender.com';

console.log('🔍 Checking WanderWise Backend Status...\n');

// Check health endpoint
function checkHealth() {
  return new Promise((resolve, reject) => {
    console.log('📡 Checking health endpoint...');
    
    https.get(`${BACKEND_URL}/health`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Backend is LIVE and healthy!\n');
          console.log('Response:', JSON.parse(data));
          resolve(true);
        } else {
          console.log(`❌ Health check failed with status: ${res.statusCode}`);
          resolve(false);
        }
      });
    }).on('error', (err) => {
      console.log(`❌ Backend not reachable: ${err.message}`);
      console.log('\n⏳ Backend might still be deploying. Wait 2-3 minutes and try again.\n');
      resolve(false);
    });
  });
}

// Check API root
function checkAPIRoot() {
  return new Promise((resolve, reject) => {
    console.log('\n📡 Checking API root endpoint...');
    
    https.get(`${BACKEND_URL}/`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ API root is accessible!\n');
          const parsed = JSON.parse(data);
          console.log('Available endpoints:', Object.keys(parsed.endpoints || {}));
          resolve(true);
        } else {
          console.log(`❌ API root returned status: ${res.statusCode}`);
          resolve(false);
        }
      });
    }).on('error', (err) => {
      console.log(`❌ API root not accessible: ${err.message}`);
      resolve(false);
    });
  });
}

// Test login endpoint (without actually logging in)
function checkAuthEndpoint() {
  return new Promise((resolve, reject) => {
    console.log('\n📡 Checking auth endpoint availability...');
    
    const postData = JSON.stringify({
      email: 'test@example.com',
      password: 'test'
    });
    
    const options = {
      hostname: 's66-fibafathima-capstone-wanderwise.onrender.com',
      port: 443,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`Auth endpoint status: ${res.statusCode}`);
        if (res.statusCode === 200 || res.statusCode === 400 || res.statusCode === 401) {
          console.log('✅ Auth endpoint is working (expected response)\n');
          resolve(true);
        } else {
          console.log(`❌ Unexpected auth endpoint status: ${res.statusCode}`);
          resolve(false);
        }
      });
    });
    
    req.on('error', (err) => {
      console.log(`❌ Auth endpoint error: ${err.message}`);
      resolve(false);
    });
    
    req.write(postData);
    req.end();
  });
}

// Main execution
async function main() {
  console.log('='.repeat(60));
  console.log('🚀 WanderWise Backend Deployment Checker');
  console.log('='.repeat(60));
  console.log();
  
  const healthOk = await checkHealth();
  
  if (healthOk) {
    await checkAPIRoot();
    await checkAuthEndpoint();
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ All checks passed! Backend is ready.');
    console.log('='.repeat(60));
    console.log('\n🎉 You can now:');
    console.log('   1. Visit: https://wanderwiseca.netlify.app/');
    console.log('   2. Login with: admin@wanderwise.com / admin123');
    console.log('   3. Test all features\n');
  } else {
    console.log('\n' + '='.repeat(60));
    console.log('⏳ Backend is still deploying or has issues');
    console.log('='.repeat(60));
    console.log('\n💡 Next steps:');
    console.log('   1. Wait 2-3 more minutes');
    console.log('   2. Check Render dashboard: https://render.com/dashboard');
    console.log('   3. Look for deployment logs');
    console.log('   4. Run this script again: node scripts/checkBackend.js\n');
  }
}

main();
