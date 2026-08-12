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
        serverSelectionTimeoutMS: 5000,
        family: 6, // Force IPv6 for NAT64 networks
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
      console.warn(`⚠️ MongoDB connection error (${err.message}).`);
      console.warn(`📁 Falling back to local database server/data/db.json`);
      isMongoConnected = false;
      activeDatabaseName = 'db.json (Local Fallback)';
    }
  } else {
    console.log(`📁 Database Mode: Persistent Local DB (server/data/db.json)`);
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
