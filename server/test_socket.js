const { io } = require('socket.io-client');

async function runSocketTests() {
  console.log('🧪 Starting Task 6.1 & 6.2: Socket.IO Real-Time Communications Tests...\n');

  const URL = 'http://localhost:3000';

  const clientCustomer = io(URL, { autoConnect: true });
  const clientOwner = io(URL, { autoConnect: true });

  await new Promise((resolve) => {
    let connectedCount = 0;
    const checkConnected = () => {
      connectedCount++;
      if (connectedCount === 2) resolve();
    };
    clientCustomer.on('connect', checkConnected);
    clientOwner.on('connect', checkConnected);
  });

  console.log('1️⃣ Testing Socket.IO Connection Handshakes...');
  console.log(`   Customer Socket ID: ${clientCustomer.id}`);
  console.log(`   Owner Socket ID: ${clientOwner.id}`);
  console.log('✅ Connection handshakes SUCCESS!');

  // 2. Room Joining
  console.log('\n2️⃣ Testing Room Joining (user_u-101 and user_u-102)...');
  clientCustomer.emit('join_room', 'u-101');
  clientOwner.emit('join_room', 'u-102');
  console.log('✅ Room join requests sent!');

  // 3. Real-Time Chat Test
  console.log('\n3️⃣ Testing Real-Time Customer -> Owner Direct Messaging...');
  const chatPromise = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Chat message response timed out')), 4000);

    clientOwner.on('receive_chat', (data) => {
      clearTimeout(timeout);
      resolve(data);
    });

    clientCustomer.emit('send_chat', {
      senderId: 'u-101',
      recipientId: 'u-102',
      message: 'Hello, is the CAT 320 excavator ready for lowboy hauling dispatch?',
    });
  });

  try {
    const chatData = await chatPromise;
    console.log('✅ Real-time chat received by Owner!');
    console.log('   Message:', `"${chatData.message}"`);
    console.log('   Timestamp:', chatData.timestamp);
  } catch (err) {
    console.error('❌ Real-time chat test FAILED:', err.message);
    process.exit(1);
  }

  // 4. Telematics Geofence Alert Test
  console.log('\n4️⃣ Testing Real-Time Telematics Geofence Breach Alert...');
  const geofencePromise = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Geofence alert response timed out')), 4000);

    clientOwner.on('geofence_warning', (data) => {
      clearTimeout(timeout);
      resolve(data);
    });

    clientCustomer.emit('telematics_alert', {
      ownerId: 'u-102',
      equipmentId: 'EQ-1001',
      alertType: 'GEOFENCE_BREACH_OUT_OF_BOUNDS',
      location: 'Site Latitude 30.2672, Longitude -97.7431',
    });
  });

  try {
    const alertData = await geofencePromise;
    console.log('✅ Geofence warning received by Owner!');
    console.log('   Alert Type:', alertData.alertType);
    console.log('   Location:', alertData.location);
  } catch (err) {
    console.error('❌ Telematics alert test FAILED:', err.message);
    process.exit(1);
  }

  clientCustomer.disconnect();
  clientOwner.disconnect();

  console.log('\n🎉 ALL TASK 6.1 & 6.2 SOCKET.IO TESTS PASSED WITH 0 ERRORS!');
}

runSocketTests();
