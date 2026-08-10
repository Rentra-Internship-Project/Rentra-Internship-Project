const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', '..', 'data', 'db.json');

async function connectDB() {
  const mongoUri = process.env.MONGO_URI;
  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri);
      console.log('🍃 MongoDB Atlas Connected via Mongoose 9');
    } catch (err) {
      console.warn('⚠️ Mongoose connection warning, falling back to db.json:', err.message);
    }
  } else {
    console.log('📁 Evaluation Mode Active: Using persistent local database server/data/db.json');
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

module.exports = { connectDB, readLocalDB, writeLocalDB };
