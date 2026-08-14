const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/booking.model');

const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay credentials not configured');
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// Create a Razorpay order for deposit payment
exports.createOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ error: 'bookingId is required' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    // Only the customer can initiate deposit payment
    if (booking.customerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (booking.status !== 'Approved') {
      return res.status(400).json({
        error: `Booking must be in Approved status to pay deposit. Current status: ${booking.status}`,
      });
    }

    if (booking.depositStatus === 'Paid') {
      return res.status(400).json({ error: 'Deposit already paid for this booking' });
    }

    const razorpay = getRazorpayInstance();

    // Razorpay amount is in paise (1 INR = 100 paise)
    const amountInPaise = Math.round(booking.deposit * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rentra_${bookingId}`,
      notes: {
        bookingId: bookingId,
        equipmentName: booking.equipmentName,
        customerId: req.user.id,
      },
    });

    // Store orderId on booking
    booking.razorpayOrderId = order.id;
    await booking.save();

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      bookingId,
      depositAmount: booking.deposit,
      equipmentName: booking.equipmentName,
    });
  } catch (err) {
    console.error('Razorpay create order error:', err);
    res.status(500).json({ error: 'Failed to create payment order', details: err.message });
  }
};

// Verify Razorpay payment signature and confirm deposit
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
      return res.status(400).json({ error: 'All payment verification fields are required' });
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification failed — invalid signature' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    if (booking.customerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Update booking
    booking.status = 'Deposit Paid';
    booking.depositStatus = 'Paid';
    booking.amountPaidOnline = booking.deposit;
    booking.razorpayOrderId = razorpay_order_id;
    booking.razorpayPaymentId = razorpay_payment_id;
    await booking.save();

    // Notify owner
    const Notification = require('../models/notification.model');
    const io = req.app.get('io');
    try {
      const notif = await Notification.create({
        userId: booking.ownerId,
        title: 'Deposit Received',
        message: `Security deposit of ₹${booking.deposit.toLocaleString()} received for "${booking.equipmentName}". Please prepare the equipment.`,
        type: 'DepositPaid',
        bookingId: booking._id,
      });
      if (io) {
        io.to(`user_${booking.ownerId}`).emit('notification', {
          id: notif._id,
          title: notif.title,
          message: notif.message,
          type: notif.type,
          bookingId: notif.bookingId,
          timestamp: notif.createdAt,
        });
      }

      // Notify the customer as well
      const custNotif = await Notification.create({
        userId: booking.customerId,
        title: 'Payment Successful',
        message: `Your deposit of ₹${booking.deposit} for ${booking.equipmentName} was successfully paid.`,
        type: 'DepositPaid',
        bookingId: booking._id,
      });

      if (io) {
        io.to(`user_${booking.customerId}`).emit('notification', {
          id: custNotif._id,
          title: custNotif.title,
          message: custNotif.message,
          type: custNotif.type,
          bookingId: custNotif.bookingId,
          timestamp: custNotif.createdAt,
        });
      }

    } catch (notifErr) {
      console.error('Notification error after payment:', notifErr.message);
    }

    res.json({
      booking,
      message: 'Payment verified and deposit confirmed successfully',
    });
  } catch (err) {
    console.error('Razorpay verify error:', err);
    res.status(500).json({ error: 'Payment verification failed', details: err.message });
  }
};

// Utility function to issue a refund via Razorpay (Not an Express route handler)
exports.issueRefund = async (paymentId, amountInRupees) => {
  try {
    const razorpay = getRazorpayInstance();
    // Razorpay amount is in paise
    const amountInPaise = Math.round(amountInRupees * 100);
    
    console.log(`Initiating Razorpay refund for payment: ${paymentId}, amount: ${amountInRupees}`);
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amountInPaise,
      speed: "optimum" // or "normal"
    });
    
    return { success: true, refundId: refund.id };
  } catch (err) {
    console.error('Razorpay refund error:', err);
    return { success: false, error: err.message || 'Refund failed' };
  }
};
