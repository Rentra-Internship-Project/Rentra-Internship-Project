const http = require('http');

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ statusCode: res.statusCode, headers: res.headers, body: parsed });
        } catch (e) {
          resolve({ statusCode: res.statusCode, headers: res.headers, body: data });
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

async function runHelperTests() {
  console.log('🧪 Starting Task 7.1 & 7.2: PDF Contract & Media Upload Helper APIs Tests...\n');

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

    const token = customerLogin.body.token;

    // 1. GET /api/bookings/BK-94825/contract-pdf
    console.log('1️⃣ Testing GET /api/bookings/BK-94825/contract-pdf (PDF Contract Generator)...');
    const pdfRes = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/bookings/BK-94825/contract-pdf',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (pdfRes.statusCode === 200 && pdfRes.headers['content-type'] === 'application/pdf' && pdfRes.body.startsWith('%PDF-')) {
      console.log('✅ PDF Contract Generator SUCCESS!');
      console.log('   Content-Type:', pdfRes.headers['content-type']);
      console.log('   Content-Disposition:', pdfRes.headers['content-disposition']);
    } else {
      console.error('❌ PDF Contract Generator FAILED:', pdfRes);
      process.exit(1);
    }

    // 2. POST /api/upload
    console.log('\n2️⃣ Testing POST /api/upload (Cloudinary Photo Upload Pipeline)...');
    const uploadRes = await makeRequest(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/upload',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      { filename: 'cat320_front_walkaround.jpg' }
    );

    if (uploadRes.statusCode === 201 && uploadRes.body.url) {
      console.log('✅ Cloudinary Photo Upload SUCCESS!');
      console.log('   Media URL:', uploadRes.body.url);
      console.log('   Format:', uploadRes.body.format, `(${uploadRes.body.bytes} bytes)`);
    } else {
      console.error('❌ Photo Upload FAILED:', uploadRes);
      process.exit(1);
    }

    console.log('\n🎉 ALL TASK 7.1 & 7.2 HELPER TESTS PASSED WITH 0 ERRORS!');
  } catch (err) {
    console.error('💥 Helper test execution error:', err.message);
    process.exit(1);
  }
}

runHelperTests();
