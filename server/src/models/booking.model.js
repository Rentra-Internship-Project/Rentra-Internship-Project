const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    equipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment',
      required: true,
    },
    equipmentName: {
      type: String,
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    durationDays: {
      type: Number,
      required: true,
    },
    dailyRate: {
      type: Number,
      required: true,
    },
    includeOperator: {
      type: Boolean,
      default: false,
    },
    operatorCostPerDay: {
      type: Number,
      default: 0,
    },
    distanceKm: {
      type: Number,
      default: 25,
    },
    haulingFee: {
      type: Number,
      required: true,
    },
    rentalCost: {
      type: Number,
      required: true,
    },
    deposit: {
      type: Number,
      required: true,
    },
    platformFee: {
      type: Number,
      required: true,
    },
    gst: {
      type: Number,
      required: true,
    },
    totalValue: {
      type: Number,
      required: true,
    },
    amountPaidNow: {
      type: Number,
      required: true,
    },
    remainingBalance: {
      type: Number,
      required: true,
    },
    allowedEngineHours: {
      type: Number,
      default: 8,
    },
    loggedEngineHours: {
      type: Number,
      default: 0,
    },
    overtimeHours: {
      type: Number,
      default: 0,
    },
    overtimeSurcharge: {
      type: Number,
      default: 0,
    },
    signatureDataUrl: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: [
        'Pending Deposit',
        'Pending Owner Approval',
        'APPROVED',
        'ACTIVE',
        'Returned & Inspected',
        'COMPLETED',
        'CANCELLED',
      ],
      default: 'Pending Owner Approval',
    },
    depositStatus: {
      type: String,
      default: 'Deposit Paid',
    },
    refundStatus: {
      type: String,
      default: 'Held in Escrow',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
