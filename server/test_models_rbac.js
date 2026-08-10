const { requireRole } = require('./src/middleware/rbacMiddleware');
const errorMiddleware = require('./src/middleware/errorMiddleware');
const User = require('./src/models/user.model');
const Equipment = require('./src/models/equipment.model');
const Booking = require('./src/models/booking.model');
const Business = require('./src/models/business.model');

function runModelsRbacTests() {
  console.log('🧪 Starting Task: Mongoose Schemas & RBAC Middleware Tests...\n');

  try {
    // 1. Verify Model Definitions
    console.log('1️⃣ Testing Mongoose Model Declarations...');
    console.log('   User Model:', User.modelName);
    console.log('   Equipment Model:', Equipment.modelName);
    console.log('   Booking Model:', Booking.modelName);
    console.log('   Business Model:', Business.modelName);
    console.log('✅ All Mongoose models loaded successfully!');

    // 2. Test RBAC Guard Middleware
    console.log('\n2️⃣ Testing RBAC Role Guard Middleware...');
    const ownerGuard = requireRole('OWNER', 'ADMIN');

    // Case A: Customer attempting Owner route -> should return 403
    let resCode = null;
    let resError = null;
    const mockRes = {
      status: (code) => {
        resCode = code;
        return {
          json: (data) => {
            resError = data.error;
          },
        };
      },
    };

    const mockCustomerReq = { user: { role: 'CUSTOMER' } };
    ownerGuard(mockCustomerReq, mockRes, () => {});

    if (resCode === 403) {
      console.log('✅ RBAC Guard SUCCESS! Rejection code 403 for Customer accessing Owner route.');
    } else {
      console.error('❌ RBAC Guard FAILED:', resCode, resError);
      process.exit(1);
    }

    // Case B: Owner accessing Owner route -> should call next()
    let nextCalled = false;
    const mockOwnerReq = { user: { role: 'OWNER' } };
    ownerGuard(mockOwnerReq, mockRes, () => {
      nextCalled = true;
    });

    if (nextCalled) {
      console.log('✅ RBAC Guard SUCCESS! Allowed Owner role to proceed.');
    } else {
      console.error('❌ RBAC Guard allowed check FAILED');
      process.exit(1);
    }

    // 3. Test Centralized Error Middleware (Duplicate Key Trap)
    console.log('\n3️⃣ Testing Centralized Error Middleware (MongoDB 11000 Trap)...');
    let errCode = null;
    let errBody = null;
    const mockErrRes = {
      status: (code) => {
        errCode = code;
        return {
          json: (data) => {
            errBody = data;
          },
        };
      },
    };

    const mockDupError = { code: 11000, keyValue: { email: 'test@rentra.com' } };
    errorMiddleware(mockDupError, {}, mockErrRes, () => {});

    if (errCode === 400 && errBody.error.includes('email already exists')) {
      console.log('✅ Error Middleware SUCCESS! Caught duplicate email error (400).');
    } else {
      console.error('❌ Error Middleware FAILED:', errCode, errBody);
      process.exit(1);
    }

    console.log('\n🎉 ALL MONGOOSE MODEL & RBAC MIDDLEWARE TESTS PASSED WITH 0 ERRORS!');
  } catch (err) {
    console.error('💥 Model & RBAC test execution error:', err.message);
    process.exit(1);
  }
}

runModelsRbacTests();
