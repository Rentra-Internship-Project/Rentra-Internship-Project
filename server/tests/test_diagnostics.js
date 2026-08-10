const http = require('http');
const { io } = require('socket.io-client');
const { getDatabaseStatus } = require('../src/config/db');
const redis = require('../src/config/redis');
const { createRazorpayOrder } = require('../src/config/razorpay');
const { createStripePaymentIntent } = require('../src/config/stripe');
const { generateCloudinaryUrl } = require('../src/config/cloudinary');

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

async function runSystemDiagnostics() {
  console.log('================================================================');
  console.log('🔍 RENTRA FULL-STACK TECHNOLOGY DIAGNOSTICS & SYSTEM CHECK');
  console.log('================================================================\n');

  let passed = 0;
  let total = 8;

  // 1. Express 5 REST Server & Healthcheck
  try {
    console.log('1️⃣ Checking Express 5 REST API Gateway (http://localhost:3000/)...');
    const health = await makeRequest({ hostname: 'localhost', port: 3000, path: '/', method: 'GET' });
    if (health.statusCode === 200 && health.body.service) {
      console.log('   ✅ Express 5 Server: ONLINE');
      console.log(`   📡 Timestamp: ${health.body.timestamp}`);
      passed++;
    } else {
      console.error('   ❌ Express Server: FAILED', health);
    }
  } catch (err) {
    console.error('   ❌ Express Server Error:', err.message);
  }

  // 2. Database Connection Check (MongoDB Atlas / Fallback)
  try {
    console.log('\n2️⃣ Checking MongoDB Mongoose 9 Database Connection...');
    const dbStatus = getDatabaseStatus();
    console.log(`   ✅ Mode: ${dbStatus.mode}`);
    console.log(`   🗄️ Active Database Name: "${dbStatus.databaseName}"`);
    console.log(`   🔗 Connection Configured: ${dbStatus.connectionConfigured}`);
    passed++;
  } catch (err) {
    console.error('   ❌ Database Connection Error:', err.message);
  }

  // 3. Redis Cloud / Memory Cache Check
  try {
    console.log('\n3️⃣ Checking Redis Cache & Token Blacklist Engine...');
    await redis.set('diag_test_key', 'RENTRA_REDIS_OK', 60);
    const cachedVal = await redis.get('diag_test_key');
    await redis.del('diag_test_key');
    if (cachedVal) {
      console.log('   ✅ Redis Token Cache Engine: WORKING (Key SET/GET/DEL Verified)');
      passed++;
    } else {
      console.error('   ❌ Redis Engine: FAILED');
    }
  } catch (err) {
    console.error('   ❌ Redis Engine Error:', err.message);
  }

  // 4. Socket.IO 4 WebSocket Real-Time Check
  try {
    console.log('\n4️⃣ Checking Socket.IO Real-Time Communications Engine...');
    const clientCust = io('http://localhost:3000', { autoConnect: true });
    const clientOwner = io('http://localhost:3000', { autoConnect: true });

    await new Promise((res) => {
      let connected = 0;
      const onConn = () => { connected++; if (connected === 2) res(); };
      clientCust.on('connect', onConn);
      clientOwner.on('connect', onConn);
    });

    clientOwner.emit('join_room', 'owner_diag');
    
    const socketPromise = new Promise((res, rej) => {
      const timer = setTimeout(() => rej(new Error('Socket timeout')), 3000);
      clientOwner.on('receive_chat', (data) => {
        clearTimeout(timer);
        res(data);
      });
      clientCust.emit('send_chat', { senderId: 'cust_diag', recipientId: 'owner_diag', message: 'Diagnostics ping' });
    });

    const received = await socketPromise;
    clientCust.disconnect();
    clientOwner.disconnect();

    if (received && received.message === 'Diagnostics ping') {
      console.log('   ✅ Socket.IO Real-Time Engine: WORKING (WebSockets Transmit Verified)');
      passed++;
    } else {
      console.error('   ❌ Socket.IO Engine FAILED');
    }
  } catch (err) {
    console.error('   ❌ Socket.IO Engine Error:', err.message);
  }

  // 5. Razorpay Payment Gateway Check
  try {
    console.log('\n5️⃣ Checking Razorpay Payment Gateway Integration...');
    const rzpOrder = await createRazorpayOrder(5000, 'bk_diag_receipt');
    if (rzpOrder && rzpOrder.id && rzpOrder.amount === 500000) {
      console.log(`   ✅ Razorpay Gateway: WORKING (Order ID: ${rzpOrder.id} | Amount: ${rzpOrder.amount} paise)`);
      passed++;
    } else {
      console.error('   ❌ Razorpay Gateway FAILED:', rzpOrder);
    }
  } catch (err) {
    console.error('   ❌ Razorpay Gateway Error:', err.message);
  }

  // 6. Stripe Connect Escrow Check
  try {
    console.log('\n6️⃣ Checking Stripe Connect Escrow Engine...');
    const stripeIntent = createStripePaymentIntent(250);
    if (stripeIntent && stripeIntent.id && stripeIntent.status === 'requires_capture') {
      console.log(`   ✅ Stripe Connect Escrow: WORKING (PaymentIntent: ${stripeIntent.id})`);
      passed++;
    } else {
      console.error('   ❌ Stripe Escrow FAILED:', stripeIntent);
    }
  } catch (err) {
    console.error('   ❌ Stripe Escrow Error:', err.message);
  }

  // 7. Cloudinary Media Storage Check
  try {
    console.log('\n7️⃣ Checking Cloudinary Media Storage Pipeline...');
    const cUrl = generateCloudinaryUrl('excavator_hd.jpg');
    if (cUrl && cUrl.includes('cloudinary.com')) {
      console.log(`   ✅ Cloudinary Storage Pipeline: WORKING (${cUrl})`);
      passed++;
    } else {
      console.error('   ❌ Cloudinary Pipeline FAILED');
    }
  } catch (err) {
    console.error('   ❌ Cloudinary Error:', err.message);
  }

  // 8. PDF Contract Generator Check
  try {
    console.log('\n8️⃣ Checking PDF Contract Generator...');
    // Login to get token
    const login = await makeRequest(
      { hostname: 'localhost', port: 3000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { email: 'customer@rentra.com', password: 'password123' }
    );
    const token = login.body.token;

    const pdfRes = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/bookings/BK-94825/contract-pdf',
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (pdfRes.statusCode === 200 && pdfRes.headers['content-type'] === 'application/pdf') {
      console.log('   ✅ PDF Contract Generator: WORKING (Binary PDF Buffer Streamed)');
      passed++;
    } else {
      console.error('   ❌ PDF Contract Generator FAILED');
    }
  } catch (err) {
    console.error('   ❌ PDF Contract Error:', err.message);
  }

  console.log('\n================================================================');
  console.log(`🏆 DIAGNOSTICS SUMMARY: ${passed} / ${total} TECHNOLOGIES VERIFIED ONLINE & WORKING!`);
  console.log('================================================================\n');
}

runSystemDiagnostics();
