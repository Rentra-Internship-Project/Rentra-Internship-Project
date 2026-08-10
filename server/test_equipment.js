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

async function runEquipmentTests() {
  console.log('🧪 Starting Task 3.1: Equipment Catalog & Fleet Package APIs Tests...\n');

  try {
    // 0. Login as Owner to get token
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

    const ownerToken = loginRes.body.token;

    // 1. GET /api/equipment
    console.log('1️⃣ Testing GET /api/equipment (Fetch Full Machinery Catalog)...');
    const catalogRes = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/equipment',
      method: 'GET',
    });

    if (catalogRes.statusCode === 200 && Array.isArray(catalogRes.body)) {
      console.log(`✅ Equipment Catalog SUCCESS! Returned ${catalogRes.body.length} machinery units.`);
    } else {
      console.error('❌ Equipment Catalog FAILED:', catalogRes);
      process.exit(1);
    }

    // 2. GET /api/equipment?hasOperator=true
    console.log('\n2️⃣ Testing GET /api/equipment?hasOperator=true (Certified Operator Filter)...');
    const operatorRes = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/equipment?hasOperator=true',
      method: 'GET',
    });

    if (operatorRes.statusCode === 200 && operatorRes.body.every((e) => e.operatorAvailable === true)) {
      console.log(`✅ Certified Operator Filter SUCCESS! Returned ${operatorRes.body.length} units with drivers.`);
    } else {
      console.error('❌ Certified Operator Filter FAILED:', operatorRes);
      process.exit(1);
    }

    // 3. GET /api/equipment/bundles
    console.log('\n3️⃣ Testing GET /api/equipment/bundles (Project Fleet Package Bundles)...');
    const bundleRes = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/equipment/bundles',
      method: 'GET',
    });

    if (bundleRes.statusCode === 200 && bundleRes.body.length > 0) {
      console.log(`✅ Fleet Package Bundles SUCCESS! Returned ${bundleRes.body.length} package bundles.`);
      console.log('   Package 1:', bundleRes.body[0].name, `(${bundleRes.body[0].discountPercent}% OFF)`);
    } else {
      console.error('❌ Fleet Package Bundles FAILED:', bundleRes);
      process.exit(1);
    }

    // 4. GET /api/equipment/:id
    console.log('\n4️⃣ Testing GET /api/equipment/EQ-1001 (Fetch Single Machinery Unit)...');
    const singleRes = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/equipment/EQ-1001',
      method: 'GET',
    });

    if (singleRes.statusCode === 200 && singleRes.body.id === 'EQ-1001') {
      console.log('✅ Single Equipment Fetch SUCCESS! Unit:', singleRes.body.name);
    } else {
      console.error('❌ Single Equipment Fetch FAILED:', singleRes);
      process.exit(1);
    }

    // 5. POST /api/equipment (Create new listing as Owner)
    console.log('\n5️⃣ Testing POST /api/equipment (Owner Listing Creation)...');
    const newEqRes = await makeRequest(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/equipment',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ownerToken}`,
        },
      },
      {
        name: 'Volvo A40G Articulated Hauler Dump Truck',
        category: 'Earthmoving',
        pricePerDay: 6200,
        operatorAvailable: true,
        operatorDailyRate: 1600,
        weightTons: 30,
        location: 'San Antonio, TX',
        description: 'Heavy-duty articulated haul truck designed for tough off-road hauling operations.',
      }
    );

    if (newEqRes.statusCode === 201 && newEqRes.body.id) {
      console.log('✅ Equipment Listing Creation SUCCESS! New Unit ID:', newEqRes.body.id);
    } else {
      console.error('❌ Equipment Listing Creation FAILED:', newEqRes);
      process.exit(1);
    }

    console.log('\n🎉 ALL TASK 3.1 EQUIPMENT CATALOG TESTS PASSED WITH 0 ERRORS!');
  } catch (err) {
    console.error('💥 Equipment test execution error:', err.message);
    process.exit(1);
  }
}

runEquipmentTests();
