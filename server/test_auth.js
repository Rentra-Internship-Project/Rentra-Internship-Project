const http = require('http');

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ statusCode: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ statusCode: res.statusCode, body: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
}

async function runAuthTests() {
  console.log('🧪 Starting Task 2.1: Authentication System Tests...\n');

  try {
    // 1. Test Seeded Login (Owner)
    console.log('1️⃣ Testing Login with seeded user (owner@rentra.com)...');
    const loginRes = await makeRequest(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'owner@rentra.com', password: 'password123' }
    );

    if (loginRes.statusCode === 200 && loginRes.body.token) {
      console.log('✅ Login SUCCESS! Token received.');
      console.log('   User:', loginRes.body.user.name, `(${loginRes.body.user.role})`);
    } else {
      console.error('❌ Login FAILED:', loginRes);
      process.exit(1);
    }

    const authToken = loginRes.body.token;

    // 2. Test GET /api/auth/me with Bearer token
    console.log('\n2️⃣ Testing Profile Retrieval (GET /api/auth/me)...');
    const meRes = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/me',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (meRes.statusCode === 200 && meRes.body.user.email === 'owner@rentra.com') {
      console.log('✅ Profile retrieval SUCCESS! Returned profile for:', meRes.body.user.email);
    } else {
      console.error('❌ Profile retrieval FAILED:', meRes);
      process.exit(1);
    }

    // 3. Test New User Registration
    const testEmail = `newcontractor_${Date.now()}@test.com`;
    console.log(`\n3️⃣ Testing User Registration (${testEmail})...`);
    const regRes = await makeRequest(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        name: 'Samantha Contractor',
        email: testEmail,
        password: 'securePassword123',
        role: 'CUSTOMER',
      }
    );

    if (regRes.statusCode === 201 && regRes.body.token) {
      console.log('✅ User registration SUCCESS! Created user ID:', regRes.body.user.id);
    } else {
      console.error('❌ User registration FAILED:', regRes);
      process.exit(1);
    }

    // 4. Test Duplicate Email Prevention
    console.log('\n4️⃣ Testing Duplicate Email Rejection...');
    const dupRes = await makeRequest(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        name: 'Duplicate User',
        email: testEmail,
        password: 'anotherPassword123',
        role: 'CUSTOMER',
      }
    );

    if (dupRes.statusCode === 400 && dupRes.body.error) {
      console.log('✅ Duplicate email rejection SUCCESS! Error message:', dupRes.body.error);
    } else {
      console.error('❌ Duplicate email test FAILED:', dupRes);
      process.exit(1);
    }

    console.log('\n🎉 ALL TASK 2.1 AUTHENTICATION TESTS PASSED WITH 0 ERRORS!');
  } catch (err) {
    console.error('💥 Test execution error:', err.message);
    process.exit(1);
  }
}

runAuthTests();
