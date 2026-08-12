const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const Equipment = require('../src/models/equipment.model');
const Booking = require('../src/models/booking.model');
const User = require('../src/models/user.model');

async function seedFrontendData() {
  const uri = process.env.MONGO_URI || process.env.DATABASE_URL || process.env.MONGO_URL;
  if (!uri) {
    console.error('No Mongo URI found in .env');
    process.exit(1);
  }
  
  let targetUri = uri.trim();
  if (targetUri.endsWith('/')) targetUri = targetUri.slice(0, -1);
  if (!targetUri.includes('rentra_db')) {
    if (targetUri.includes('?')) {
        const parts = targetUri.split('?');
        let base = parts[0];
        if (base.endsWith('/')) base = base.slice(0, -1);
        targetUri = `${base}/rentra_db?${parts[1]}`;
    } else {
        targetUri = `${targetUri}/rentra_db?retryWrites=true&w=majority`;
    }
  }

  await mongoose.connect(targetUri);
  console.log('Connected to MongoDB. Seeding frontend data...');

  const owner = await User.findOne({ email: 'owner@rentra.com' });
  const customer = await User.findOne({ email: 'customer@rentra.com' });

  if (!owner || !customer) {
      console.log('Owner or Customer not found. Please ensure server has started once to seed demo accounts.');
      process.exit(1);
  }

  const mockEquipment =[
  {
    name: 'Komatsu D65P-18 Crawler Bulldozer',
    category: 'Earthmoving',
    pricePerDay: 5500,
    locationAddress: 'Houston, TX',
    availability: 'Available',
    rating: 4.8,
    reviewsCount: 19,
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Buldo%C5%BEer.jpg',
    ownerId: owner._id,
    description: 'Heavy-duty Komatsu crawler bulldozer designed for earthmoving, grading, road construction, and site preparation.',
    weightTons: 21.8
  },

  {
    name: 'Caterpillar 336 Hydraulic Excavator',
    category: 'Earthmoving',
    pricePerDay: 6200,
    locationAddress: 'Dallas, TX',
    availability: 'Available',
    rating: 4.9,
    reviewsCount: 27,
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Caterpillar_Excavator.jpg',
    ownerId: owner._id,
    description: 'Large hydraulic excavator suitable for excavation, trenching, demolition, and heavy construction work.',
    weightTons: 36.0
  },

  {
    name: 'Caterpillar 307 Compact Excavator',
    category: 'Earthmoving',
    pricePerDay: 3900,
    locationAddress: 'Austin, TX',
    availability: 'Available',
    rating: 4.7,
    reviewsCount: 16,
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Caterpillar_excavator_307%2C_2025051701.jpg',
    ownerId: owner._id,
    description: 'Compact Caterpillar excavator ideal for utility work, landscaping, trenching, and confined construction sites.',
    weightTons: 7.5
  },

  {
    name: 'Volvo L120E Wheel Loader',
    category: 'Material Handling',
    pricePerDay: 4600,
    locationAddress: 'Fort Worth, TX',
    availability: 'Available',
    rating: 4.8,
    reviewsCount: 24,
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Wheel-loader02.jpg',
    ownerId: owner._id,
    description: 'Powerful Volvo wheel loader designed for loading, stockpiling, aggregate handling, and construction material movement.',
    weightTons: 21.0
  },

  {
    name: 'Wheel Loader Construction Machine',
    category: 'Material Handling',
    pricePerDay: 4200,
    locationAddress: 'San Antonio, TX',
    availability: 'Available',
    rating: 4.7,
    reviewsCount: 18,
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Wheel_Loader_%282271465419%29.jpg',
    ownerId: owner._id,
    description: 'Versatile front-end wheel loader for moving soil, gravel, lumber, aggregate, and other heavy materials.',
    weightTons: 17.5
  },

  {
    name: 'Caterpillar D6 Crawler Bulldozer',
    category: 'Earthmoving',
    pricePerDay: 5800,
    locationAddress: 'Phoenix, AZ',
    availability: 'Available',
    rating: 4.8,
    reviewsCount: 22,
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Caterpillar_dozer.jpg',
    ownerId: owner._id,
    description: 'Tracked Caterpillar bulldozer designed for pushing soil, leveling ground, roadwork, and large-scale site preparation.',
    weightTons: 23.5
  },

  {
    name: 'John Deere Crawler Bulldozer',
    category: 'Earthmoving',
    pricePerDay: 5400,
    locationAddress: 'Denver, CO',
    availability: 'Available',
    rating: 4.8,
    reviewsCount: 21,
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bulldozer_2.jpg',
    ownerId: owner._id,
    description: 'Heavy crawler bulldozer designed for grading, land clearing, construction, and earthmoving operations.',
    weightTons: 20.5
  },

  {
    name: 'JCB 3DX Backhoe Loader',
    category: 'Earthmoving',
    pricePerDay: 3500,
    locationAddress: 'Houston, TX',
    availability: 'Available',
    rating: 4.9,
    reviewsCount: 42,
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/JCB_-_Backhoe_loader.jpg',
    ownerId: owner._id,
    description: 'Versatile JCB backhoe loader combining digging and loading capabilities for construction and utility projects.',
    weightTons: 8.5
  },

  {
    name: 'Heavy-Duty Backhoe Loader',
    category: 'Earthmoving',
    pricePerDay: 3300,
    locationAddress: 'Dallas, TX',
    availability: 'Available',
    rating: 4.7,
    reviewsCount: 26,
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/BackhoeLoader.jpg',
    ownerId: owner._id,
    description: 'Multi-purpose backhoe loader suitable for excavation, trenching, material loading, landscaping, and roadwork.',
    weightTons: 8.2
  },

  {
    name: 'Caterpillar Motor Grader',
    category: 'Road Construction',
    pricePerDay: 5600,
    locationAddress: 'Austin, TX',
    availability: 'Available',
    rating: 4.8,
    reviewsCount: 21,
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/A_MOTOR_GRADER.jpg',
    ownerId: owner._id,
    description: 'Precision motor grader designed for road construction, surface leveling, grading, ditching, and finishing operations.',
    weightTons: 19.5
  },

  {
    name: 'Heavy-Duty Dump Truck',
    category: 'Hauling',
    pricePerDay: 6500,
    locationAddress: 'Houston, TX',
    availability: 'Available',
    rating: 4.8,
    reviewsCount: 25,
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/A_dump_truck.jpg',
    ownerId: owner._id,
    description: 'Heavy-duty dump truck designed to transport soil, gravel, sand, construction debris, and other bulk materials.',
    weightTons: 24.0
  },

  {
    name: 'Construction Dump Truck',
    category: 'Hauling',
    pricePerDay: 6100,
    locationAddress: 'San Antonio, TX',
    availability: 'Available',
    rating: 4.7,
    reviewsCount: 19,
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Dump_Truck.jpg',
    ownerId: owner._id,
    description: 'Reliable construction dump truck suitable for hauling aggregate, soil, debris, and materials between job sites.',
    weightTons: 22.0
  },

  {
    name: 'Mobile Construction Crane',
    category: 'Lifting Equipment',
    pricePerDay: 8500,
    locationAddress: 'Dallas, TX',
    availability: 'Available',
    rating: 4.9,
    reviewsCount: 17,
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mobile_crane.jpg',
    ownerId: owner._id,
    description: 'Mobile crane designed for lifting structural steel, machinery, concrete components, and heavy construction materials.',
    weightTons: 38.0
  },

  {
    name: 'Tadano Mobile Crane',
    category: 'Lifting Equipment',
    pricePerDay: 7900,
    locationAddress: 'Fort Worth, TX',
    availability: 'Available',
    rating: 4.8,
    reviewsCount: 15,
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mobile_Cranes.jpg',
    ownerId: owner._id,
    description: 'All-terrain mobile crane suitable for construction lifting, industrial projects, infrastructure work, and equipment placement.',
    weightTons: 32.0
  },

  {
    name: 'Construction Road Roller',
    category: 'Compaction',
    pricePerDay: 3200,
    locationAddress: 'Phoenix, AZ',
    availability: 'Available',
    rating: 4.8,
    reviewsCount: 20,
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Roller_machine.jpg',
    ownerId: owner._id,
    description: 'Heavy vibratory road roller designed for compacting soil, gravel, asphalt, and road foundations.',
    weightTons: 12.5
  },

  {
    name: 'Toyota Industrial Forklift',
    category: 'Material Handling',
    pricePerDay: 1800,
    locationAddress: 'Houston, TX',
    availability: 'Available',
    rating: 4.8,
    reviewsCount: 29,
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Forklift.jpeg',
    ownerId: owner._id,
    description: 'Industrial forklift designed for warehouses, construction yards, loading areas, and heavy material handling.',
    weightTons: 4.0
  }
];

  await Equipment.deleteMany({});
  const insertedEquipment = await Equipment.insertMany(mockEquipment);
  console.log(`Inserted ${insertedEquipment.length} equipment items.`);

  const mockBookings = [
    {
      equipmentId: insertedEquipment[0]._id,
      equipmentName: insertedEquipment[0].name,
      customerId: customer._id,
      startDate: new Date('2026-08-12'),
      endDate: new Date('2026-08-14'),
      durationDays: 2,
      dailyRate: 5000,
      rentalCost: 10000,
      haulingFee: 0,
      deposit: 2000,
      platformFee: 200,
      gst: 900,
      totalValue: 13100,
      amountPaidNow: 2000,
      remainingBalance: 11100,
      status: 'Pending Owner Approval',
      depositStatus: 'Deposit Paid',
      refundStatus: 'Held in Escrow'
    },
    {
      equipmentId: insertedEquipment[1]._id,
      equipmentName: insertedEquipment[1].name,
      customerId: customer._id,
      startDate: new Date('2026-08-15'),
      endDate: new Date('2026-08-17'),
      durationDays: 2,
      dailyRate: 5500,
      rentalCost: 11000,
      haulingFee: 0,
      deposit: 2000,
      platformFee: 220,
      gst: 990,
      totalValue: 14210,
      amountPaidNow: 2000,
      remainingBalance: 12210,
      status: 'APPROVED',
      depositStatus: 'Deposit Paid',
      refundStatus: 'Held in Escrow'
    }
  ];

  await Booking.deleteMany({});
  await Booking.insertMany(mockBookings);
  console.log(`Inserted ${mockBookings.length} bookings.`);

  console.log('✅ Seed complete!');
  process.exit(0);
}

seedFrontendData();
