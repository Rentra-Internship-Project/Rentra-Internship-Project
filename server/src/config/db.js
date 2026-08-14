const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', '..', 'data', 'db.json');

let isMongoConnected = false;
let activeDatabaseName = 'db.json (Local)';

function buildMongoConnectionString() {
  const fullUri = process.env.MONGO_URI || process.env.DATABASE_URL;
  if (fullUri) return fullUri;

  const clusterUrl = process.env.MONGO_URL || process.env.MONGO_CLUSTER_URL;
  const dbName = process.env.MONGO_DB_NAME || process.env.DB_NAME || 'rentra_db';

  if (clusterUrl) {
    let cleanCluster = clusterUrl.trim();
    // Ensure trailing slash removed before appending dbName
    if (cleanCluster.endsWith('/')) {
      cleanCluster = cleanCluster.slice(0, -1);
    }
    // Handle query params if clusterUrl already includes ?
    if (cleanCluster.includes('?')) {
      const parts = cleanCluster.split('?');
      let base = parts[0];
      if (base.endsWith('/')) {
        base = base.slice(0, -1);
      }
      return `${base}/${dbName}?${parts[1]}`;
    }
    return `${cleanCluster}/${dbName}?retryWrites=true&w=majority`;
  }

  return null;
}

async function connectDB() {
  const targetUri = buildMongoConnectionString();

  if (targetUri) {
    try {
      await mongoose.connect(targetUri, {
        serverSelectionTimeoutMS: 10000,
        family: 4, // Force IPv4
      });
      isMongoConnected = true;
      activeDatabaseName = mongoose.connection.name || process.env.MONGO_DB_NAME || 'rentra_db';

      console.log(`====================================================`);
      console.log(`🍃 MongoDB Atlas Cloud Connected via Mongoose 9`);
      console.log(`🗄️ Database Name: "${activeDatabaseName}"`);
      console.log(`🔗 Target URL: ${targetUri.replace(/:([^:@]+)@/, ':****@')}`);
      console.log(`====================================================`);

      // Seed MongoDB database with initial records if empty
      await seedMongoDatabase();
    } catch (err) {
      console.warn(`⚠️ MongoDB Atlas connection error (${err.message}).`);
      console.warn(`❌ Server cannot start without a valid database connection.`);
      isMongoConnected = false;
      activeDatabaseName = 'Disconnected';
      // Throw the error so the server stops if DB is required
      // or keep it running to show errors on endpoints
    }
  } else {
    console.log(`❌ No Database URL provided. Server cannot run without MongoDB.`);
    console.log(`💡 Tip: Add MONGO_URL=mongodb+srv://... and MONGO_DB_NAME=your_db to server/.env`);
  }
}

async function seedMongoDatabase() {
  try {
    const User = require('../models/user.model');
    const bcrypt = require('bcryptjs');

    const defaultPassword = await bcrypt.hash('password123', 10);
    const customerPassword = await bcrypt.hash('customer123', 10);
    const ownerPassword = await bcrypt.hash('owner123', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);

    const demoUsers = [
      {
        name: 'Demo Customer',
        email: 'customer@rentra.com',
        passwordHash: customerPassword,
        role: 'CUSTOMER',
      },
      {
        name: 'Demo Owner',
        email: 'owner@rentra.com',
        passwordHash: ownerPassword,
        role: 'OWNER',
        company: 'Titan Machinery Fleet Ltd',
      },
      {
        name: 'Demo Admin',
        email: 'admin@rentra.com',
        passwordHash: adminPassword,
        role: 'ADMIN',
      }
    ];

    let seededCount = 0;
    for (const u of demoUsers) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        await User.create(u);
        seededCount++;
      }
    }

    if (seededCount > 0) {
      console.log(`✅ MongoDB database "${activeDatabaseName}" seeded ${seededCount} Demo Accounts!`);
    } else {
      console.log(`✅ Demo accounts already exist in MongoDB.`);
    }

    const { seedDefaultCategories } = require('../controllers/category.controller');
    await seedDefaultCategories();

    const Business = require('../models/business.model');
    const Equipment = require('../models/equipment.model');

    const ownerUser = await User.findOne({ email: 'owner@rentra.com' });
    if (ownerUser) {
      let demoBusiness = await Business.findOne({ ownerId: ownerUser._id });
      if (!demoBusiness) {
        demoBusiness = await Business.create({
          ownerId: ownerUser._id,
          ownerName: ownerUser.name,
          businessName: 'Titan Machinery Fleet Ltd',
          registrationNumber: 'GSTIN27ABCDE1234F1Z5',
          taxId: 'PANABCDE1234F',
          status: 'Approved',
          verifiedAt: new Date()
        });
        console.log(`✅ Demo Business seeded for Owner`);
      }

      const equipCount = await Equipment.countDocuments({ ownerId: ownerUser._id });
      if (equipCount === 0) {
        await Equipment.create({
          name: 'Caterpillar CAT 320 Hydraulic Excavator',
          category: 'Earthmoving',
          description: 'Heavy duty hydraulic excavator suitable for large construction sites. Includes standard bucket.',
          location: 'Pune, Maharashtra',
          locationAddress: 'Pune, Maharashtra',
          pricePerDay: 4500,
          operatorAvailable: true,
          operatorDailyRate: 1500,
          availability: 'Available',
          image: 'https://images.unsplash.com/photo-1578491845187-b952b6510f2d?auto=format&fit=crop&q=80&w=800',
          ownerId: ownerUser._id,
          businessId: demoBusiness._id,
          status: 'Approved',
          approvedAt: new Date()
        });
        console.log(`✅ Demo Equipment seeded for Owner`);
      }
    }

  } catch (err) {
    console.warn('MongoDB Seeding note:', err.message);
  }
}

function readLocalDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      return { users: [], equipment: [], bookings: [], businesses: [] };
    }
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch (err) {
    console.error('Error reading db.json:', err);
    return { users: [], equipment: [], bookings: [], businesses: [] };
  }
}

function writeLocalDB(data) {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing db.json:', err);
  }
}

function getDatabaseStatus() {
  return {
    isMongoConnected,
    mode: isMongoConnected ? 'CUSTOM_MONGODB_ATLAS' : 'LOCAL_JSON',
    databaseName: activeDatabaseName,
    connectionConfigured: !!buildMongoConnectionString(),
  };
}

module.exports = { connectDB, readLocalDB, writeLocalDB, getDatabaseStatus };
