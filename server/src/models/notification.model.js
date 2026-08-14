const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        'BookingRequest',
        'BookingApproved',
        'BookingRejected',
        'DepositPaid',
        'ReadyForPickup',
        'RentalActive',
        'ReturnRequested',
        'RentalCompleted',
        'BusinessApproved',
        'BusinessRejected',
        'BusinessSubmitted',
        'EquipmentApproved',
        'EquipmentRejected',
        'RefundIssued',
        'RefundProcessed',
        'PayoutTransferred',
        'Welcome',
        'General',
      ],
      default: 'General',
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      default: null,
    },
    equipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment',
      default: null,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

module.exports = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
