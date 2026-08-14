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
    // Denormalized for efficient owner-scoped queries
    ownerId: {
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
      default: 0,
    },
    haulingFee: {
      type: Number,
      default: 0,
    },
    rentalCost: {
      type: Number,
      required: true,
    },
    // Deposit = 20% of rentalCost — paid online via Razorpay
    deposit: {
      type: Number,
      required: true,
    },
    platformFee: {
      type: Number,
      default: 0,
    },
    gst: {
      type: Number,
      default: 0,
    },
    // totalValue = rentalCost + haulingFee + platformFee + gst (deposit NOT added — it's paid separately)
    totalValue: {
      type: Number,
      required: true,
    },
    // Amount actually paid online (deposit) — 0 until Razorpay payment succeeds
    amountPaidOnline: {
      type: Number,
      default: 0,
    },
    // Remaining cash to pay to owner in person
    remainingCash: {
      type: Number,
      required: true,
    },
    siteAddress: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    // Standardized booking status lifecycle
    status: {
      type: String,
      enum: [
        'Pending Approval',    // Customer submitted, waiting for owner
        'Approved',            // Owner approved, waiting for deposit
        'Rejected',            // Owner rejected
        'Deposit Paid',        // Customer paid deposit online via Razorpay
        'Ready For Pickup',    // Owner prepared equipment for handover
        'Rental Active',       // Equipment handed over, rental in progress
        'Return Requested',    // Customer requested return
        'Completed',           // Owner confirmed return, booking closed
        'Cancelled',           // Cancelled by customer or auto-cancelled
      ],
      default: 'Pending Approval',
    },
    depositStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Refunded'],
      default: 'Pending',
    },
    payoutStatus: {
      type: String,
      enum: ['Pending', 'Transferred'],
      default: 'Pending',
    },
    // Razorpay payment tracking
    razorpayOrderId: {
      type: String,
      default: '',
    },
    razorpayPaymentId: {
      type: String,
      default: '',
    },
    // Engine hours tracking (for inspection at return)
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
    rejectionReason: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    review: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

module.exports = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
