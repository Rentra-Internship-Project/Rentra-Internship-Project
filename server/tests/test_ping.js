const http = require('http');
const app = require('../src/app');

async function runTests() {
  console.log('🧪 Starting /ping and keep-alive verification tests...\n');

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  function makeRequest(path, method = 'GET') {
    return new Promise((resolve, reject) => {
      const req = http.request(
        `${baseUrl}${path}`,
        { method },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              body: data,
            });
          });
        }
      );
      req.on('error', reject);
      req.end();
    });
  }

  try {
    // 1. GET /ping
    const pingRes = await makeRequest('/ping', 'GET');
    assert(pingRes.statusCode === 200, 'GET /ping returns 200 OK');
    assert(
      pingRes.headers['cache-control'] &&
        pingRes.headers['cache-control'].includes('no-cache'),
      'GET /ping has Cache-Control: no-cache headers'
    );
    const pingData = JSON.parse(pingRes.body);
    assert(pingData.status === 'ok', 'GET /ping payload has status: "ok"');
    assert(pingData.message === 'pong', 'GET /ping payload has message: "pong"');
    assert(typeof pingData.uptime === 'number', 'GET /ping payload includes numeric uptime');
    assert(Boolean(pingData.timestamp), 'GET /ping payload includes ISO timestamp');

    // 2. HEAD /ping
    const headRes = await makeRequest('/ping', 'HEAD');
    assert(headRes.statusCode === 200, 'HEAD /ping returns 200 OK');
    assert(headRes.body === '', 'HEAD /ping body is empty');

    // 3. GET /api/ping
    const apiPingRes = await makeRequest('/api/ping', 'GET');
    assert(apiPingRes.statusCode === 200, 'GET /api/ping returns 200 OK');
    const apiPingData = JSON.parse(apiPingRes.body);
    assert(apiPingData.status === 'ok', 'GET /api/ping payload has status: "ok"');

    // 4. HEAD /api/ping
    const headApiRes = await makeRequest('/api/ping', 'HEAD');
    assert(headApiRes.statusCode === 200, 'HEAD /api/ping returns 200 OK');

    // 5. Verify / root healthcheck remains functional
    const rootRes = await makeRequest('/', 'GET');
    assert(rootRes.statusCode === 200, 'GET / returns 200 OK');
    const rootData = JSON.parse(rootRes.body);
    assert(rootData.service === 'Rentra MERN REST API', 'GET / returns service metadata');

    // 6. Rapid consecutive requests to /ping (verify no rate limiter blocking)
    let allPingsPassed = true;
    for (let i = 0; i < 15; i++) {
      const res = await makeRequest('/ping', 'GET');
      if (res.statusCode !== 200) {
        allPingsPassed = false;
        break;
      }
    }
    assert(allPingsPassed, '15 rapid consecutive pings succeed without 429 rate-limiting');

    // 7. Keep-Alive URL resolution tests
    const { resolveTargetUrl, startKeepAlive } = require('../src/utils/keepAlive');
    
    // Save original env
    const origRenderUrl = process.env.RENDER_EXTERNAL_URL;
    const origRender = process.env.RENDER;
    const origServiceName = process.env.RENDER_SERVICE_NAME;
    const origKeepAliveUrl = process.env.KEEP_ALIVE_URL;

    delete process.env.RENDER_EXTERNAL_URL;
    delete process.env.RENDER;
    delete process.env.RENDER_SERVICE_NAME;
    delete process.env.KEEP_ALIVE_URL;
    assert(resolveTargetUrl() === null, 'resolveTargetUrl() returns null when not on Render');

    process.env.RENDER_EXTERNAL_URL = 'https://rentra-backend.onrender.com';
    assert(
      resolveTargetUrl() === 'https://rentra-backend.onrender.com',
      'resolveTargetUrl() resolves RENDER_EXTERNAL_URL'
    );
    delete process.env.RENDER_EXTERNAL_URL;

    process.env.RENDER = 'true';
    process.env.RENDER_SERVICE_NAME = 'rentra-backend';
    assert(
      resolveTargetUrl() === 'https://rentra-backend.onrender.com',
      'resolveTargetUrl() auto-derives https://<service>.onrender.com from RENDER_SERVICE_NAME'
    );

    // 8. Test keepAlive worker trigger against test server
    process.env.KEEP_ALIVE_URL = baseUrl;
    process.env.KEEP_ALIVE_INTERVAL_MS = '1000';
    process.env.KEEP_ALIVE_INITIAL_DELAY_MS = '50';
    const keepAliveInstance = startKeepAlive();
    assert(Boolean(keepAliveInstance), 'startKeepAlive() creates timers when KEEP_ALIVE_URL configured');

    // Wait for initial verification ping to execute
    await new Promise((resolve) => setTimeout(resolve, 200));
    clearInterval(keepAliveInstance.intervalId);
    clearTimeout(keepAliveInstance.initialTimer);

    // Restore env
    if (origRenderUrl) process.env.RENDER_EXTERNAL_URL = origRenderUrl;
    else delete process.env.RENDER_EXTERNAL_URL;
    if (origRender) process.env.RENDER = origRender;
    else delete process.env.RENDER;
    if (origServiceName) process.env.RENDER_SERVICE_NAME = origServiceName;
    else delete process.env.RENDER_SERVICE_NAME;
    if (origKeepAliveUrl) process.env.KEEP_ALIVE_URL = origKeepAliveUrl;
    else delete process.env.KEEP_ALIVE_URL;
    delete process.env.KEEP_ALIVE_INTERVAL_MS;
    delete process.env.KEEP_ALIVE_INITIAL_DELAY_MS;

    console.log(`\n========================================`);
    console.log(`Test Results: ${passed} passed, ${failed} failed`);
    console.log(`========================================\n`);

    if (server.closeAllConnections) server.closeAllConnections();
    server.close();
    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Unexpected test error:', err);
    if (server.closeAllConnections) server.closeAllConnections();
    server.close();
    process.exit(1);
  }
}

runTests();
