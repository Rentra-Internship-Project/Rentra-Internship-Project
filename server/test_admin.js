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

async function runAdminTests() {
  console.log('🧪 Starting Task 5.1: Admin Analytics & Governance APIs Tests...\n');

  try {
    // 0. Login as Admin to get Bearer token
    const adminLogin = await makeRequest(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'admin@rentra.com', password: 'password123' }
    );

    const adminToken = adminLogin.body.token;

    // 1. GET /api/admin/stats
    console.log('1️⃣ Testing GET /api/admin/stats (Platform Analytics & Aggregations)...');
    const statsRes = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/stats',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
    });

    if (statsRes.statusCode === 200 && statsRes.body.totalUsers !== undefined) {
      const s = statsRes.body;
      console.log('✅ Admin Platform Analytics SUCCESS!');
      console.log(`   Users: ${s.totalUsers} | Equipment: ${s.totalEquipment} | Bookings: ${s.totalBookings}`);
      console.log(`   Total Platform Revenue: ₹${s.totalRevenue.toLocaleString()} | Pending KYBs: ${s.pendingVerifications}`);
    } else {
      console.error('❌ Admin Platform Analytics FAILED:', statsRes);
      process.exit(1);
    }

    // 2. GET /api/admin/businesses
    console.log('\n2️⃣ Testing GET /api/admin/businesses (Owner Business KYB Verifications)...');
    const bizRes = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/businesses',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
    });

    if (bizRes.statusCode === 200 && Array.isArray(bizRes.body) && bizRes.body.length > 0) {
      console.log(`✅ Business Verification List SUCCESS! Returned ${bizRes.body.length} business registrations.`);
    } else {
      console.error('❌ Business Verification List FAILED:', bizRes);
      process.exit(1);
    }

    // 3. PUT /api/admin/businesses/biz-1/verify
    console.log('\n3️⃣ Testing PUT /api/admin/businesses/biz-1/verify (Approve Owner Business)...');
    const verifyRes = await makeRequest(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/admin/businesses/biz-1/verify',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
      },
      { status: 'Approved' }
    );

    if (verifyRes.statusCode === 200 && verifyRes.body.status === 'Approved') {
      console.log('✅ Business KYB Moderation SUCCESS! Business status updated to Approved.');
    } else {
      console.error('❌ Business KYB Moderation FAILED:', verifyRes);
      process.exit(1);
    }

    console.log('\n🎉 ALL TASK 5.1 ADMIN & GOVERNANCE TESTS PASSED WITH 0 ERRORS!');
  } catch (err) {
    console.error('💥 Admin test execution error:', err.message);
    process.exit(1);
  }
}

runAdminTests();
