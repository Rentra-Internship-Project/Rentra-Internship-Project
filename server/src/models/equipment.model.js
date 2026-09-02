const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      default: null,
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
      default: 0,
    },
    locationAddress: {
      type: String,
      default: '',
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
        default: [73.8567, 18.5204], // Pune, Maharashtra, India
      },
    },
    availability: {
      type: String,
      enum: ['Available', 'Rented', 'Maintenance'],
      default: 'Available',
    },
    platformFeeRate: {
      type: Number,
      default: 2, // 2% default platform fee
    },
    // Admin approval status — equipment is only public when Approved
    status: {
      type: String,
      enum: ['Pending Approval', 'Approved', 'Rejected', 'Disabled'],
      default: 'Pending Approval',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviewsCount: {
      type: Number,
      default: 0,
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

equipmentSchema.index({ location: '2dsphere' });
// Advanced MongoDB text indexing for high-performance string searches
equipmentSchema.index({ name: 'text', description: 'text', category: 'text' });
// Compound index to heavily optimize the public catalog queries
equipmentSchema.index({ status: 1, availability: 1 });

module.exports = mongoose.models.Equipment || mongoose.model('Equipment', equipmentSchema);
