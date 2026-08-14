/**
 * RENTRA Database Migration Script
 * 
 * Run this ONCE to:
 * 1. Approve all existing equipment that has no status (was created before the status field was added)
 * 2. Set default business status for existing businesses
 * 3. Ensure all bookings have the ownerId field set from equipment lookup
 * 
 * Usage: node scripts/migrate.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');

// Build URI the same way db.js does
function buildMongoURI() {
  const fullUri = process.env.MONGO_URI || process.env.DATABASE_URL;
  if (fullUri) return fullUri;

  const clusterUrl = process.env.MONGO_URL || process.env.MONGO_CLUSTER_URL;
  const dbName = process.env.MONGO_DB_NAME || 'rentra_db';

  if (clusterUrl) {
    let clean = clusterUrl.trim().replace(/\/$/, '');
    if (clean.includes('?')) {
      const [base, query] = clean.split('?');
      return `${base.replace(/\/$/, '')}/${dbName}?${query}`;
    }
    return `${clean}/${dbName}?retryWrites=true&w=majority`;
  }
  return null;
}

const Equipment = require('../src/models/equipment.model');
const Booking = require('../src/models/booking.model');
const Business = require('../src/models/business.model');

async function migrate() {
  const mongoUri = buildMongoURI();
  console.log('🔄 Starting RENTRA database migration...');
  console.log('MongoDB URI:', mongoUri ? '✅ Found' : '❌ Missing');

  if (!mongoUri) {
    console.error('❌ No MongoDB URI found. Check MONGO_URL in .env');
    process.exit(1);
  }

  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
  console.log('✅ Connected to MongoDB\n');


  // ─── 1. Fix Equipment without status ─────────────────────────────────────────
  const equipmentWithoutStatus = await Equipment.countDocuments({
    status: { $exists: false }
  });
  console.log(`📦 Equipment without status field: ${equipmentWithoutStatus}`);

  if (equipmentWithoutStatus > 0) {
    const result = await Equipment.updateMany(
      { status: { $exists: false } },
      { $set: { status: 'Approved', approvedAt: new Date() } }
    );
    console.log(`   ✅ Set ${result.modifiedCount} existing equipment to 'Approved'`);
  }

  // ─── 2. Fix Equipment with null/empty status ──────────────────────────────────
  const equipmentNullStatus = await Equipment.countDocuments({
    $or: [{ status: null }, { status: '' }]
  });
  console.log(`📦 Equipment with null/empty status: ${equipmentNullStatus}`);

  if (equipmentNullStatus > 0) {
    const result = await Equipment.updateMany(
      { $or: [{ status: null }, { status: '' }] },
      { $set: { status: 'Approved', approvedAt: new Date() } }
    );
    console.log(`   ✅ Fixed ${result.modifiedCount} equipment`);
  }

  // ─── 3. Fix Equipment with 'Active' or 'Listed' status (old values) ──────────
  const oldStatusEquipment = await Equipment.countDocuments({
    status: { $in: ['Active', 'Listed', 'Available', 'active', 'listed'] }
  });
  console.log(`📦 Equipment with old status values: ${oldStatusEquipment}`);

  if (oldStatusEquipment > 0) {
    const result = await Equipment.updateMany(
      { status: { $in: ['Active', 'Listed', 'Available', 'active', 'listed'] } },
      { $set: { status: 'Approved', approvedAt: new Date() } }
    );
    console.log(`   ✅ Migrated ${result.modifiedCount} equipment to 'Approved'`);
  }

  // ─── 4. Fix Business without status ──────────────────────────────────────────
  const businessWithoutStatus = await Business.countDocuments({
    status: { $exists: false }
  });
  console.log(`\n🏢 Business without status field: ${businessWithoutStatus}`);

  if (businessWithoutStatus > 0) {
    const result = await Business.updateMany(
      { status: { $exists: false } },
      { $set: { status: 'Approved', verifiedAt: new Date() } }
    );
    console.log(`   ✅ Set ${result.modifiedCount} existing businesses to 'Approved'`);
  }

  // ─── 5. Fix Bookings without ownerId ──────────────────────────────────────────
  const bookingsWithoutOwner = await Booking.find({ ownerId: { $exists: false } });
  console.log(`\n📋 Bookings without ownerId: ${bookingsWithoutOwner.length}`);

  let fixedBookings = 0;
  for (const booking of bookingsWithoutOwner) {
    const equip = await Equipment.findById(booking.equipmentId);
    if (equip && equip.ownerId) {
      await Booking.findByIdAndUpdate(booking._id, {
        $set: { ownerId: equip.ownerId }
      });
      fixedBookings++;
    }
  }
  console.log(`   ✅ Fixed ${fixedBookings} bookings with ownerId`);

  // ─── 6. Fix Bookings with old status values ───────────────────────────────────
  const statusMap = {
    'ACTIVE': 'Rental Active',
    'Active': 'Rental Active',
    'COMPLETED': 'Completed',
    'CANCELLED': 'Cancelled',
    'Cancelled': 'Cancelled',
    'PENDING': 'Pending Approval',
    'Pending': 'Pending Approval',
    'Pending Owner Approval': 'Pending Approval',
  };

  console.log('\n📋 Fixing booking status values...');
  for (const [oldVal, newVal] of Object.entries(statusMap)) {
    const count = await Booking.countDocuments({ status: oldVal });
    if (count > 0) {
      await Booking.updateMany({ status: oldVal }, { $set: { status: newVal } });
      console.log(`   ✅ Migrated ${count} bookings: "${oldVal}" → "${newVal}"`);
    }
  }

  // ─── 7. Set depositStatus for bookings that don't have it ────────────────────
  const bookingsWithoutDepositStatus = await Booking.countDocuments({
    depositStatus: { $exists: false }
  });
  console.log(`\n💰 Bookings without depositStatus: ${bookingsWithoutDepositStatus}`);
  if (bookingsWithoutDepositStatus > 0) {
    await Booking.updateMany(
      { depositStatus: { $exists: false } },
      { $set: { depositStatus: 'Pending' } }
    );
    console.log(`   ✅ Set depositStatus to 'Pending' for ${bookingsWithoutDepositStatus} bookings`);
  }

  // ─── Summary ──────────────────────────────────────────────────────────────────
  const totalEquipment = await Equipment.countDocuments();
  const approvedEquipment = await Equipment.countDocuments({ status: 'Approved' });
  const pendingEquipment = await Equipment.countDocuments({ status: 'Pending Approval' });
  const totalBookings = await Booking.countDocuments();
  const totalBusinesses = await Business.countDocuments();
  const approvedBusinesses = await Business.countDocuments({ status: 'Approved' });

  console.log('\n============================');
  console.log('📊 Migration Summary:');
  console.log(`   Equipment: ${totalEquipment} total | ${approvedEquipment} approved | ${pendingEquipment} pending`);
  console.log(`   Bookings:  ${totalBookings} total`);
  console.log(`   Businesses: ${totalBusinesses} total | ${approvedBusinesses} approved`);
  console.log('============================');
  console.log('✅ Migration complete!');

  await mongoose.disconnect();
  process.exit(0);
}

migrate().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
