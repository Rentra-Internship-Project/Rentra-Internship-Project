const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Equipment name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Machinery category is required'],
    },
    pricePerDay: {
      type: Number,
      required: [true, 'Price per day is required'],
    },
    operatorAvailable: {
      type: Boolean,
      default: false,
    },
    operatorDailyRate: {
      type: Number,
      default: 1500,
    },
    weightTons: {
      type: Number,
      default: 15.0,
    },
    locationAddress: {
      type: String,
      default: 'Austin, TX',
    },
    // MongoDB 2dsphere Geospatial Location Index
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [-97.7431, 30.2672],
      },
    },
    availability: {
      type: String,
      enum: ['Available', 'Rented', 'Maintenance'],
      default: 'Available',
    },
    rating: {
      type: Number,
      default: 5.0,
    },
    reviewsCount: {
      type: Number,
      default: 1,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=800',
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

equipmentSchema.index({ location: '2dsphere' });

module.exports = mongoose.models.Equipment || mongoose.model('Equipment', equipmentSchema);
