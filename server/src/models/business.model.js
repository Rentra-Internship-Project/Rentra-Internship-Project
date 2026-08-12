const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    businessName: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    businessType: {
      type: String,
      default: 'Heavy Machinery Fleet Provider',
    },
    registrationNumber: {
      type: String,
      default: 'REG-991204',
    },
    taxId: {
      type: String,
      default: 'TAX-884102',
    },
    insurancePolicyNumber: {
      type: String,
      default: 'INS-774109',
    },
    documents: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

module.exports = mongoose.models.Business || mongoose.model('Business', businessSchema);
