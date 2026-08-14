const Booking = require('../models/booking.model');
const Equipment = require('../models/equipment.model');
const Notification = require('../models/notification.model');
const { issueRefund } = require('./razorpay.controller');

// Helper: create and emit a notification
async function createNotification(io, userId, data) {
  try {
    const notif = await Notification.create({ userId, ...data });
    if (io) {
      io.to(`user_${userId}`).emit('notification', {
        id: notif._id,
        title: notif.title,
        message: notif.message,
        type: notif.type,
        bookingId: notif.bookingId,
        timestamp: notif.createdAt,
      });
    }
  } catch (err) {
    console.error('Notification error:', err.message);
  }
}

// Valid status transitions — who can make which transition
const VALID_TRANSITIONS = {
  'Pending Approval': {
    OWNER: ['Approved', 'Rejected'],
    ADMIN: ['Cancelled'],
    CUSTOMER: ['Cancelled'],
  },
  'Approved': {
    CUSTOMER: ['Cancelled'],
  },
  'Deposit Paid': {
    OWNER: ['Ready For Pickup'],
    CUSTOMER: ['Cancelled'], // Can cancel after paying deposit (triggers refund)
  },
  'Ready For Pickup': {
    OWNER: ['Rental Active'],
    CUSTOMER: ['Rental Active'],
  },
  'Rental Active': {
    CUSTOMER: ['Return Requested'],
  },
  'Return Requested': {
    OWNER: ['Completed'],
  },
  'Rejected': {},
  'Completed': {},
  'Cancelled': {},
};

// CUSTOMER: Get own bookings only
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.user.id })
      .populate('equipmentId', 'name image category locationAddress')
      .populate('ownerId', 'name phone email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings', details: err.message });
  }
};

// OWNER: Get bookings for owner's equipment only
exports.getOwnerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ ownerId: req.user.id })
      .populate('equipmentId', 'name image category locationAddress')
      .populate('customerId', 'name email phone avatar')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch owner bookings', details: err.message });
  }
};

// CUSTOMER: Create a booking
exports.createBooking = async (req, res) => {
  try {
    const { equipmentId, startDate, endDate, includeOperator, distanceKm, siteAddress, notes } = req.body;

    if (!equipmentId || !startDate || !endDate) {
      return res.status(400).json({ error: 'equipmentId, startDate, and endDate are required' });
    }

    // Fetch equipment
    const equip = await Equipment.findById(equipmentId).populate('ownerId', 'name');
    if (!equip) return res.status(404).json({ error: 'Equipment not found' });

    // Only allow booking Approved equipment
    if (equip.status !== 'Approved') {
      return res.status(400).json({ error: 'This equipment is not available for booking' });
    }
    if (equip.availability !== 'Available') {
      return res.status(400).json({ error: 'This equipment is currently not available' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end) || end <= start) {
      return res.status(400).json({ error: 'Invalid date range' });
    }

    // Date overlap validation — check for conflicting active bookings
    const conflicting = await Booking.findOne({
      equipmentId,
      status: { $in: ['Approved', 'Deposit Paid', 'Ready For Pickup', 'Rental Active'] },
      $or: [
        { startDate: { $lt: end }, endDate: { $gt: start } },
      ],
    });
    if (conflicting) {
      return res.status(409).json({
        error: 'Equipment is already booked for the selected dates',
        conflict: {
          startDate: conflicting.startDate,
          endDate: conflicting.endDate,
        },
      });
    }

    const durationDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));

    const baseRate = equip.pricePerDay;
    const operatorDailyRate = includeOperator ? (equip.operatorDailyRate || 1500) : 0;
    const rentalCost = (baseRate + operatorDailyRate) * durationDays;

    const haulingFee = distanceKm ? Math.round(150 + (Number(distanceKm) * 3.5)) : 0;
    const platformFeePercent = equip.platformFeeRate !== undefined ? equip.platformFeeRate : 2;
    const platformFee = Math.round(rentalCost * (platformFeePercent / 100));
    const gst = Math.round((rentalCost + haulingFee + platformFee) * 0.18);
    
    const totalValue = rentalCost + haulingFee + platformFee + gst;
    
    // Deposit is an advance payment = 20% of total amount
    const deposit = Math.round(totalValue * 0.20);
    
    // Remaining balance to be paid later
    const remainingCash = totalValue - deposit;

    const newBooking = await Booking.create({
      equipmentId,
      equipmentName: equip.name,
      customerId: req.user.id,
      ownerId: equip.ownerId._id,
      startDate,
      endDate,
      durationDays,
      dailyRate: baseRate,
      includeOperator: includeOperator || false,
      operatorCostPerDay: operatorDailyRate,
      distanceKm: distanceKm || 0,
      haulingFee,
      rentalCost,
      deposit,
      platformFee,
      gst,
      totalValue,
      amountPaidOnline: 0,
      remainingCash,
      siteAddress: siteAddress || '',
      notes: notes || '',
      status: 'Pending Approval',
      depositStatus: 'Pending',
    });

    const io = req.app.get('io');

    // Notify owner of new booking request
    await createNotification(io, equip.ownerId._id.toString(), {
      title: 'New Booking Request',
      message: `You have a new booking request for "${equip.name}"`,
      type: 'BookingRequest',
      bookingId: newBooking._id,
    });

    res.status(201).json({
      booking: newBooking,
      message: 'Booking request sent to owner. Awaiting approval.',
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create booking', details: err.message });
  }
};

// Update booking status with transition validation
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const userRole = req.user.role;
    const userId = req.user.id;

    // Authorization check
    const isOwner = booking.ownerId.toString() === userId;
    const isCustomer = booking.customerId.toString() === userId;
    const isAdmin = userRole === 'ADMIN';

    if (!isOwner && !isCustomer && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized to update this booking' });
    }

    // Transition validation
    const currentStatus = booking.status;
    
    // Determine the role the user is acting as for this specific booking
    // This allows an OWNER to act as a CUSTOMER when renting from others
    const roleForThisBooking = isAdmin ? 'ADMIN' : (isOwner ? 'OWNER' : 'CUSTOMER');
    
    const allowedForRole = VALID_TRANSITIONS[currentStatus]?.[roleForThisBooking] || [];

    if (!allowedForRole.includes(status) && !isAdmin) {
      return res.status(400).json({
        error: `Cannot transition from "${currentStatus}" to "${status}" acting as ${roleForThisBooking}`,
      });
    }

    // Automated Refund Logic (If cancelled or rejected and deposit was already paid)
    if ((status === 'Cancelled' || status === 'Rejected') && booking.depositStatus === 'Paid' && booking.razorpayPaymentId) {
      const refundResult = await issueRefund(booking.razorpayPaymentId, booking.deposit);
      if (refundResult.success) {
        booking.depositStatus = 'Refunded';
        
        // Notify customer of refund
        await createNotification(req.app.get('io'), booking.customerId.toString(), {
          title: 'Refund Initiated',
          message: `Your deposit of ₹${booking.deposit} for "${booking.equipmentName}" has been refunded due to cancellation.`,
          type: 'RefundProcessed',
          bookingId: booking._id,
        });
      } else {
        console.error(`Failed to auto-refund booking ${booking._id}: ${refundResult.error}`);
        // Optional: Could send an admin alert here that manual refund is required
      }
    }

    booking.status = status;

    if (status === 'Rejected' && rejectionReason) {
      booking.rejectionReason = rejectionReason;
    }

    // When rental becomes active, mark equipment as Rented
    if (status === 'Rental Active') {
      await Equipment.findByIdAndUpdate(booking.equipmentId, { availability: 'Rented' });
    }

    // When completed or cancelled, make equipment Available again
    if (status === 'Completed' || status === 'Cancelled') {
      await Equipment.findByIdAndUpdate(booking.equipmentId, { availability: 'Available' });
    }

    await booking.save();

    const io = req.app.get('io');

    // Notification routing based on status
    const notifMap = {
      'Approved': {
        userId: booking.customerId.toString(),
        title: 'Booking Approved!',
        message: `Your booking for "${booking.equipmentName}" has been approved. Please pay the deposit to confirm.`,
        type: 'BookingApproved',
      },
      'Rejected': {
        userId: booking.customerId.toString(),
        title: 'Booking Rejected',
        message: `Your booking for "${booking.equipmentName}" was rejected. ${rejectionReason || ''}`,
        type: 'BookingRejected',
      },
      'Deposit Paid': {
        userId: booking.ownerId.toString(),
        title: 'Deposit Received',
        message: `Security deposit received for "${booking.equipmentName}". Please prepare equipment.`,
        type: 'DepositPaid',
      },
      'Ready For Pickup': {
        userId: booking.customerId.toString(),
        title: 'Equipment Ready!',
        message: `Your equipment "${booking.equipmentName}" is ready for pickup.`,
        type: 'ReadyForPickup',
      },
      'Rental Active': {
        userId: booking.customerId.toString(),
        title: 'Rental Started',
        message: `Your rental of "${booking.equipmentName}" is now active.`,
        type: 'RentalActive',
      },
      'Return Requested': {
        userId: booking.ownerId.toString(),
        title: 'Return Requested',
        message: `Customer has requested return of "${booking.equipmentName}".`,
        type: 'ReturnRequested',
      },
      'Completed': {
        userId: booking.customerId.toString(),
        title: 'Rental Completed',
        message: `Your rental of "${booking.equipmentName}" is complete. Invoice is now available.`,
        type: 'RentalCompleted',
      },
      'Cancelled': {
        userId: isCustomer ? booking.ownerId.toString() : booking.customerId.toString(),
        title: 'Booking Cancelled',
        message: `Booking for "${booking.equipmentName}" has been cancelled.`,
        type: 'General',
      },
    };

    if (notifMap[status]) {
      const n = notifMap[status];
      await createNotification(io, n.userId, {
        title: n.title,
        message: n.message,
        type: n.type,
        bookingId: booking._id,
      });
    }

    res.json({ booking, message: `Booking status updated to "${status}"` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update booking status', details: err.message });
  }
};

// Confirm deposit payment (called after Razorpay verification)
exports.confirmDeposit = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    // Only customer can confirm their own booking deposit
    if (booking.customerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (booking.status !== 'Approved') {
      return res.status(400).json({ error: 'Booking must be Approved before deposit payment' });
    }

    booking.status = 'Deposit Paid';
    booking.depositStatus = 'Paid';
    booking.amountPaidOnline = booking.deposit;
    booking.razorpayOrderId = razorpayOrderId || '';
    booking.razorpayPaymentId = razorpayPaymentId || '';

    await booking.save();

    const io = req.app.get('io');
    await createNotification(io, booking.ownerId.toString(), {
      title: 'Deposit Received',
      message: `Security deposit of ₹${booking.deposit.toLocaleString()} received for "${booking.equipmentName}".`,
      type: 'DepositPaid',
      bookingId: booking._id,
    });

    res.json({ booking, message: 'Deposit confirmed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to confirm deposit', details: err.message });
  }
};

// Record inspection on return
exports.recordInspection = async (req, res) => {
  try {
    const { signatureDataUrl, loggedEngineHours } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    // Only owner can record inspection
    if (booking.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Only the owner can record inspection' });
    }

    const maxAllowed = booking.durationDays * 8;
    const overtimeHours = Math.max(0, Number(loggedEngineHours) - maxAllowed);
    const overtimeSurcharge = overtimeHours * 45;

    booking.signatureDataUrl = signatureDataUrl;
    booking.loggedEngineHours = Number(loggedEngineHours);
    booking.overtimeHours = overtimeHours;
    booking.overtimeSurcharge = overtimeSurcharge;
    if (overtimeSurcharge > 0) {
      booking.totalValue += overtimeSurcharge;
    }

    await booking.save();
    res.json({ booking, message: 'Inspection recorded' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record inspection', details: err.message });
  }
};

// Generate invoice PDF with real booking data
exports.generateContractPdf = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customerId', 'name email phone')
      .populate('ownerId', 'name email phone')
      .populate('equipmentId', 'name category locationAddress');

    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    // Authorization: customer or owner can download invoice
    if (
      booking.customerId._id.toString() !== req.user.id &&
      booking.ownerId._id.toString() !== req.user.id &&
      req.user.role !== 'ADMIN'
    ) {
      return res.status(403).json({ error: 'Not authorized to download this invoice' });
    }

    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Rentra_Invoice_${booking._id}.pdf`);
    doc.pipe(res);

    // Header
    doc.fontSize(22).font('Helvetica-Bold').text('RENTRA', { align: 'center' });
    doc.fontSize(10).font('Helvetica').text('Heavy Machinery Rental Marketplace', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).font('Helvetica-Bold').text('RENTAL INVOICE', { align: 'center' });
    doc.moveDown();

    // Invoice meta
    doc.fontSize(10).font('Helvetica');
    doc.text(`Invoice No: INV-${booking._id.toString().slice(-8).toUpperCase()}`);
    doc.text(`Booking ID: ${booking._id}`);
    doc.text(`Date: ${new Date(booking.createdAt).toLocaleDateString('en-IN')}`);
    doc.text(`Status: ${booking.status}`);
    doc.moveDown();

    // Parties
    doc.fontSize(12).font('Helvetica-Bold').text('Customer');
    doc.fontSize(10).font('Helvetica');
    doc.text(`Name: ${booking.customerId.name}`);
    doc.text(`Email: ${booking.customerId.email}`);
    doc.text(`Phone: ${booking.customerId.phone || 'N/A'}`);
    doc.moveDown();

    doc.fontSize(12).font('Helvetica-Bold').text('Owner / Vendor');
    doc.fontSize(10).font('Helvetica');
    doc.text(`Name: ${booking.ownerId.name}`);
    doc.text(`Email: ${booking.ownerId.email}`);
    doc.text(`Phone: ${booking.ownerId.phone || 'N/A'}`);
    doc.moveDown();

    // Equipment
    doc.fontSize(12).font('Helvetica-Bold').text('Equipment Details');
    doc.fontSize(10).font('Helvetica');
    doc.text(`Equipment: ${booking.equipmentName}`);
    doc.text(`Category: ${booking.equipmentId?.category || 'N/A'}`);
    doc.text(`Location: ${booking.equipmentId?.locationAddress || 'N/A'}`);
    doc.text(`Rental Period: ${new Date(booking.startDate).toLocaleDateString('en-IN')} to ${new Date(booking.endDate).toLocaleDateString('en-IN')}`);
    doc.text(`Duration: ${booking.durationDays} day(s)`);
    doc.text(`Daily Rate: ₹${booking.dailyRate.toLocaleString('en-IN')}`);
    if (booking.includeOperator) {
      doc.text(`Operator Charge: ₹${booking.operatorCostPerDay.toLocaleString('en-IN')}/day`);
    }
    doc.moveDown();

    // Financials
    doc.fontSize(12).font('Helvetica-Bold').text('Financial Summary');
    doc.fontSize(10).font('Helvetica');
    doc.text(`Rental Cost: ₹${booking.rentalCost.toLocaleString('en-IN')}`);
    doc.text(`Hauling/Transport Fee: ₹${booking.haulingFee.toLocaleString('en-IN')}`);
    doc.text(`Platform Fee: ₹${booking.platformFee.toLocaleString('en-IN')}`);
    doc.text(`GST (18%): ₹${booking.gst.toLocaleString('en-IN')}`);
    doc.text(`Total Amount: ₹${booking.totalValue.toLocaleString('en-IN')}`);
    doc.moveDown();
    doc.text(`Security Deposit (Paid Online): ₹${booking.deposit.toLocaleString('en-IN')}`);
    doc.text(`Remaining Cash (Pay to Owner): ₹${booking.remainingCash.toLocaleString('en-IN')}`);
    if (booking.overtimeSurcharge > 0) {
      doc.text(`Overtime Surcharge: ₹${booking.overtimeSurcharge.toLocaleString('en-IN')}`);
    }
    doc.moveDown();

    // Payment status
    doc.fontSize(12).font('Helvetica-Bold').text('Payment Status');
    doc.fontSize(10).font('Helvetica');
    doc.text(`Deposit Status: ${booking.depositStatus}`);
    if (booking.razorpayPaymentId) {
      doc.text(`Razorpay Payment ID: ${booking.razorpayPaymentId}`);
    }
    doc.moveDown();

    doc.fontSize(9).fillColor('#666666').text('This invoice is system-generated. For disputes, contact support@rentra.in', { align: 'center' });

    doc.end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate invoice', details: err.message });
  }
};

exports.rateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const booking = await Booking.findOne({ _id: id, customerId: req.user.id });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found or you are not the customer' });
    }

    const rateableStatuses = ['Completed', 'Return Requested'];
    if (!rateableStatuses.includes(booking.status)) {
      return res.status(400).json({ 
        error: `Cannot rate a booking with status "${booking.status}". Only completed rentals can be rated.` 
      });
    }

    booking.rating = Number(rating);
    booking.review = review || '';
    
    await booking.save();

    // Update equipment aggregate rating
    const allRatedBookings = await Booking.find({
      equipmentId: booking.equipmentId,
      rating: { $gt: 0 },
    });
    if (allRatedBookings.length > 0) {
      const avg = allRatedBookings.reduce((sum, b) => sum + b.rating, 0) / allRatedBookings.length;
      await Equipment.findByIdAndUpdate(booking.equipmentId, {
        rating: Math.round(avg * 10) / 10,
        reviewsCount: allRatedBookings.length,
      });
    }
    
    res.json({ message: 'Rating submitted successfully', rating: booking.rating, review: booking.review });
  } catch (err) {
    res.status(500).json({ error: 'Failed to rate booking', details: err.message });
  }
};
