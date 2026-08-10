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

async function runBookingTests() {
  console.log('🧪 Starting Task 4.1: Bookings, Lowboy Hauling & Engine Overtime APIs Tests...\n');

  try {
    // 0. Login as Customer to get token
    const customerLogin = await makeRequest(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'customer@rentra.com', password: 'password123' }
    );

    const customerToken = customerLogin.body.token;

    // 0. Login as Owner to get token
    const ownerLogin = await makeRequest(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'owner@rentra.com', password: 'password123' }
    );

    const ownerToken = ownerLogin.body.token;

    // 1. POST /api/bookings (Create booking with Operator & 35 km Hauling)
    console.log('1️⃣ Testing POST /api/bookings (Create Booking with Operator & Lowboy Hauling)...');
    const createRes = await makeRequest(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/bookings',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken}`,
        },
      },
      {
        equipmentId: 'EQ-1001',
        startDate: '2026-08-15',
        endDate: '2026-08-17',
        includeOperator: true,
        distanceKm: 35,
        siteAddress: '450 Commercial Way, Site C, Austin TX',
        notes: 'Gate passcode 9912. Heavy excavation.',
      }
    );

    if (createRes.statusCode === 201 && createRes.body.id) {
      const b = createRes.body;
      console.log(`✅ Booking Creation SUCCESS! Ref ID: ${b.id}`);
      console.log(`   Duration: ${b.durationDays} days | Base + Operator: ₹${b.rentalCost.toLocaleString()}`);
      console.log(`   Lowboy Hauling (35 km): ₹${b.haulingFee} | Security Deposit (20%): ₹${b.deposit.toLocaleString()}`);
      console.log(`   Grand Total: ₹${b.totalValue.toLocaleString()} | Status: ${b.status}`);
    } else {
      console.error('❌ Booking Creation FAILED:', createRes);
      process.exit(1);
    }

    const bookingId = createRes.body.id;

    // 2. GET /api/bookings
    console.log('\n2️⃣ Testing GET /api/bookings (Fetch User Bookings)...');
    const getRes = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/bookings',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`,
      },
    });

    if (getRes.statusCode === 200 && Array.isArray(getRes.body) && getRes.body.length > 0) {
      console.log(`✅ Fetch Bookings SUCCESS! Returned ${getRes.body.length} booking records.`);
    } else {
      console.error('❌ Fetch Bookings FAILED:', getRes);
      process.exit(1);
    }

    // 3. PUT /api/bookings/:id/status (Owner Approves Booking)
    console.log(`\n3️⃣ Testing PUT /api/bookings/${bookingId}/status (Owner Approves Request)...`);
    const statusRes = await makeRequest(
      {
        hostname: 'localhost',
        port: 3000,
        path: `/api/bookings/${bookingId}/status`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ownerToken}`,
        },
      },
      { status: 'APPROVED' }
    );

    if (statusRes.statusCode === 200 && statusRes.body.status === 'APPROVED') {
      console.log('✅ Booking Status Update SUCCESS! Status updated to APPROVED.');
    } else {
      console.error('❌ Booking Status Update FAILED:', statusRes);
      process.exit(1);
    }

    // 4. POST /api/bookings/:id/inspection (Submit E-Signature & Log 22 Engine Hours -> 6 Overtime Hours)
    console.log(`\n4️⃣ Testing POST /api/bookings/${bookingId}/inspection (E-Signature & Engine Overtime Surcharge)...`);
    const mockSignature = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    
    const inspectRes = await makeRequest(
      {
        hostname: 'localhost',
        port: 3000,
        path: `/api/bookings/${bookingId}/inspection`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken}`,
        },
      },
      {
        signatureDataUrl: mockSignature,
        loggedEngineHours: 22, // Max allowed for 2 days is 16 hrs -> 6 overtime hrs @ $45/hr = +$270
      }
    );

    if (inspectRes.statusCode === 200 && inspectRes.body.overtimeHours === 6 && inspectRes.body.overtimeSurcharge === 270) {
      console.log('✅ Digital E-Signature & Engine Overtime Meter SUCCESS!');
      console.log(`   Logged Engine Hours: 22 / 16 Allowed | Overtime Hours: ${inspectRes.body.overtimeHours} hrs`);
      console.log(`   Overtime Surcharge: +₹${inspectRes.body.overtimeSurcharge} | Status: ${inspectRes.body.status}`);
    } else {
      console.error('❌ Inspection & Overtime Surcharge FAILED:', inspectRes);
      process.exit(1);
    }

    console.log('\n🎉 ALL TASK 4.1 BOOKINGS & OVERTIME TESTS PASSED WITH 0 ERRORS!');
  } catch (err) {
    console.error('💥 Booking test execution error:', err.message);
    process.exit(1);
  }
}

runBookingTests();
