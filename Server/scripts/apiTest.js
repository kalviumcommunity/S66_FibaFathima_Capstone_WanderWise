const http = require('http');

// Simple HTTP request function
function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: data
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

async function testAPI() {
  console.log('🧪 Testing API endpoints...\n');
  
  const baseUrl = 'localhost';
  const port = process.env.PORT || 8080;
  
  const tests = [
    {
      name: 'Health Check',
      path: '/health',
      expectedStatus: 200
    },
    {
      name: 'Root Endpoint',
      path: '/',
      expectedStatus: 200
    },
    {
      name: 'Destinations Endpoint',
      path: '/api/destinations',
      expectedStatus: 200
    },
    {
      name: 'Auth Signup Endpoint (POST)',
      path: '/api/auth/signup',
      method: 'POST',
      expectedStatus: 400 // Should fail without body, but endpoint should exist
    },
    {
      name: 'Non-existent Endpoint',
      path: '/api/nonexistent',
      expectedStatus: 404
    }
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  for (const test of tests) {
    try {
      const options = {
        hostname: baseUrl,
        port: port,
        path: test.path,
        method: test.method || 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const response = await makeRequest(options);
      
      if (response.statusCode === test.expectedStatus) {
        console.log(`✅ ${test.name}: PASS (${response.statusCode})`);
        passedTests++;
      } else {
        console.log(`❌ ${test.name}: FAIL (Expected: ${test.expectedStatus}, Got: ${response.statusCode})`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR (${error.message})`);
    }
  }

  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All API tests passed! Server is ready for deployment.');
  } else {
    console.log('⚠️  Some tests failed. Please check the server configuration.');
  }
}

// Check if server is running first
console.log('🔍 Checking if server is running...');
console.log('💡 Make sure to start the server first with: node server.js');
console.log('⏳ Waiting 3 seconds before testing...\n');

setTimeout(() => {
  testAPI().catch(error => {
    console.error('❌ API test failed:', error.message);
    console.log('\n💡 Make sure the server is running on port', process.env.PORT || 8080);
  });
}, 3000);
