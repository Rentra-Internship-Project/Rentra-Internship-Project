const mongoose = require('mongoose');
require('dotenv').config({path: './.env'});

const clusterUrl = process.env.MONGO_URL;
const dbName = process.env.MONGO_DB_NAME || 'rentra_db';

const parts = clusterUrl.split('?');
const uri = `${parts[0]}/${dbName}?${parts[1]}`;

console.log('Connecting to:', uri);

mongoose.connect(uri)
  .then(async () => {
    const Booking = require('./src/models/booking.model.js');
    const Equipment = require('./src/models/equipment.model.js');
    
    const allBookings = await Booking.find({});
    console.log('Total bookings:', allBookings.length);
    
    for (const b of allBookings) {
        console.log(`- Booking ID: ${b._id}, Status: ${b.status}, Rating: ${b.rating}, Review: ${b.review}`);
    }
    
    const rated = allBookings.filter(b => b.rating > 0);
    console.log('Rated bookings found:', rated.length);
    
    mongoose.connection.close();
  })
  .catch(err => { console.error(err); process.exit(1); });
