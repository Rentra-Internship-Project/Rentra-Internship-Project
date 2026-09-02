const User = require('../models/user.model');
const Equipment = require('../models/equipment.model');
const Booking = require('../models/booking.model');
const Business = require('../models/business.model');
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

exports.getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalOwners,
      totalCustomers,
      totalEquipment,
      pendingEquipment,
      approvedEquipment,
      totalBookings,
      activeRentals,
      totalBusinesses,
      pendingVerifications,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'OWNER' }),
      User.countDocuments({ role: 'CUSTOMER' }),
      Equipment.countDocuments(),
      Equipment.countDocuments({ status: 'Pending Approval' }),
      Equipment.countDocuments({ status: 'Approved' }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'Rental Active' }),
      Business.countDocuments(),
      Business.countDocuments({ status: 'Pending' }),
    ]);

    const revenueResult = await Booking.aggregate([
      { $match: { status: { $in: ['Completed', 'Rental Active', 'Deposit Paid'] } } },
      { $group: { _id: null, total: { $sum: '$totalValue' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.json({
      totalUsers,
      totalOwners,
      totalCustomers,
      totalEquipment,
      pendingEquipment,
      approvedEquipment,
      totalBookings,
      activeRentals,
      totalBusinesses,
      pendingVerifications,
      totalRevenue,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats', details: err.message });
  }
};

exports.getBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find({})
      .populate('ownerId', 'name email phone')
      .sort({ createdAt: -1 }).limit(500);
    res.json(businesses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch businesses', details: err.message });
  }
};

exports.verifyBusiness = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be Approved or Rejected' });
    }

    const update = { status, verifiedAt: new Date(), verifiedBy: req.user.id };
    if (status === 'Rejected' && rejectionReason) {
      update.rejectionReason = rejectionReason;
    }
    if (status === 'Approved') {
      update.rejectionReason = '';
    }

    const biz = await Business.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!biz) return res.status(404).json({ error: 'Business not found' });

    const io = req.app.get('io');

    // Notify owner of decision
    const notifType = status === 'Approved' ? 'BusinessApproved' : 'BusinessRejected';
    const notifTitle = status === 'Approved' ? 'Business Approved!' : 'Business Application Rejected';
    const notifMsg = status === 'Approved'
      ? `Your business "${biz.businessName}" has been approved. You can now list equipment.`
      : `Your business "${biz.businessName}" was rejected. Reason: ${rejectionReason || 'See admin for details'}`;

    await createNotification(io, biz.ownerId.toString(), {
      title: notifTitle,
      message: notifMsg,
      type: notifType,
    });

    res.json({ business: biz, message: `Business ${status}` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify business', details: err.message });
  }
};

// ADMIN: Delete a business profile
exports.deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findByIdAndDelete(req.params.id);
    if (!business) return res.status(404).json({ error: 'Business not found' });
    
    // Also delete any equipment associated with this business to prevent orphans
    await Equipment.deleteMany({ businessId: req.params.id });
    
    res.json({ message: 'Business deleted successfully. The owner must register again.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete business', details: err.message });
  }
};

// ADMIN: Get all equipment (all statuses)
exports.getEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.find({})
      .populate('ownerId', 'name email phone')
      .populate('businessId', 'businessName city state')
      .sort({ createdAt: -1 }).limit(500);
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch equipment', details: err.message });
  }
};

// ADMIN: Approve equipment listing
exports.approveEquipment = async (req, res) => {
  try {
    const { platformFeeRate } = req.body;
    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Approved',
        approvedAt: new Date(),
        approvedBy: req.user.id,
        rejectionReason: '',
        platformFeeRate: platformFeeRate !== undefined ? Number(platformFeeRate) : 2,
      },
      { new: true }
    ).populate('ownerId', 'name');

    if (!equipment) return res.status(404).json({ error: 'Equipment not found' });

    const io = req.app.get('io');
    
    if (equipment.ownerId && equipment.ownerId._id) {
      await createNotification(io, equipment.ownerId._id.toString(), {
        title: 'Equipment Listing Approved!',
        message: `Your equipment "${equipment.name}" has been approved and is now live on the marketplace.`,
        type: 'EquipmentApproved',
        equipmentId: equipment._id,
      });
    }

    res.json({ equipment, message: 'Equipment approved and now publicly visible' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve equipment', details: err.message });
  }
};

// ADMIN: Reject equipment listing
exports.rejectEquipment = async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Rejected',
        rejectionReason: rejectionReason || 'Does not meet platform requirements',
        approvedAt: null,
        approvedBy: null,
      },
      { new: true }
    ).populate('ownerId', 'name');

    if (!equipment) return res.status(404).json({ error: 'Equipment not found' });

    const io = req.app.get('io');
    if (equipment.ownerId && equipment.ownerId._id) {
      await createNotification(io, equipment.ownerId._id.toString(), {
        title: 'Equipment Listing Rejected',
        message: `Your equipment "${equipment.name}" was rejected. Reason: ${rejectionReason || 'Does not meet platform requirements'}`,
        type: 'EquipmentRejected',
        equipmentId: equipment._id,
      });
    }

    res.json({ equipment, message: 'Equipment rejected' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reject equipment', details: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 }).limit(500);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users', details: err.message });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('customerId', 'name email avatar')
      .populate('ownerId', 'name email phone')
      .populate('equipmentId', 'name image')
      .sort({ createdAt: -1 }).limit(500);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings', details: err.message });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    let business = null;
    if (user.role === 'OWNER') {
      business = await Business.findOne({ ownerId: user._id });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        joinedDate: user.createdAt,
      },
      business,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user details', details: err.message });
  }
};

// ADMIN: Update user status and forcefully disconnect active sessions
exports.updateUser = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Active', 'Suspended'].includes(status)) {
      return res.status(400).json({ error: 'Status must be Active or Suspended' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // SECURITY: If account is suspended, forcefully terminate their live WebSocket connection immediately
    if (status === 'Suspended') {
      const io = req.app.get('io');
      if (io) {
        // Emit a specialized termination event
        io.to(`user_${user._id}`).emit('force_logout', { reason: 'Account suspended by administrator' });
        
        // Disconnect all underlying TCP sockets for this user instantly
        const sockets = await io.in(`user_${user._id}`).fetchSockets();
        for (const socket of sockets) {
          socket.disconnect(true);
        }
        console.log(`🛡️ Security: Forcefully terminated ${sockets.length} live connections for suspended user ${user._id}`);
      }
    }

    res.json({ user, message: `User ${status} and sessions synchronized` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user', details: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    if (user.role === 'OWNER') {
      const business = await Business.findOneAndDelete({ ownerId: user._id });
      if (business) {
        await Equipment.deleteMany({ businessId: business._id });
      }
    }
    
    res.json({ message: 'User and all associated data deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user', details: err.message });
  }
};

exports.deleteEquipment = async (req, res) => {
  try {
    const equip = await Equipment.findByIdAndDelete(req.params.id);
    if (!equip) return res.status(404).json({ error: 'Equipment not found' });
    res.json({ message: 'Equipment deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete equipment', details: err.message });
  }
};

// ─── PAYMENTS MANAGEMENT ──────────────────────────────────────────────────────

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Booking.find({ depositStatus: { $in: ['Paid', 'Refunded'] } })
      .populate('customerId', 'name email avatar')
      .populate('ownerId', 'name email company')
      .sort({ updatedAt: -1 });

    const formattedPayments = payments.map(p => ({
      id: p._id,
      equipmentName: p.equipmentName,
      equipmentId: p.equipmentId,
      customer: p.customerId ? p.customerId.name : 'Unknown',
      owner: p.ownerId ? (p.ownerId.company || p.ownerId.name) : 'Unknown',
      depositAmount: p.deposit,
      platformFee: p.platformFee,
      ownerPayoutAmount: p.deposit - p.platformFee,
      razorpayOrderId: p.razorpayOrderId,
      razorpayPaymentId: p.razorpayPaymentId,
      status: p.depositStatus,
      payoutStatus: p.payoutStatus,
      bookingStatus: p.status,
      date: p.updatedAt
    }));

    res.json(formattedPayments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payments', details: err.message });
  }
};

exports.manualRefund = async (req, res) => {
  try {
    const { id } = req.params; // booking id
    const booking = await Booking.findById(id);

    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.depositStatus !== 'Paid') {
      return res.status(400).json({ error: `Cannot refund a booking with deposit status: ${booking.depositStatus}` });
    }
    if (!booking.razorpayPaymentId) {
      return res.status(400).json({ error: 'No Razorpay payment ID found for this booking' });
    }

    const refundResult = await issueRefund(booking.razorpayPaymentId, booking.deposit);
    
    if (refundResult.success) {
      booking.depositStatus = 'Refunded';
      // Mark booking as cancelled if an admin manually refunded it and it wasn't already cancelled
      if (!['Cancelled', 'Rejected'].includes(booking.status)) {
        booking.status = 'Cancelled';
      }
      await booking.save();

      const io = req.app.get('io');
      await createNotification(io, booking.customerId.toString(), {
        title: 'Refund Issued manually',
        message: `A manual refund of ₹${booking.deposit} has been issued for your booking of ${booking.equipmentName}.`,
        type: 'RefundIssued',
        bookingId: booking._id,
      });

      return res.json({ message: 'Refund issued successfully', refundId: refundResult.refundId, booking });
    } else {
      return res.status(500).json({ error: 'Refund failed', details: refundResult.error });
    }
  } catch (err) {
    res.status(500).json({ error: 'Manual refund error', details: err.message });
  }
};

exports.markPayoutTransferred = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.depositStatus !== 'Paid') {
      return res.status(400).json({ error: 'Deposit has not been successfully paid' });
    }
    if (booking.payoutStatus === 'Transferred') {
      return res.status(400).json({ error: 'Payout already marked as transferred' });
    }

    booking.payoutStatus = 'Transferred';
    await booking.save();

    const io = req.app.get('io');
    await createNotification(io, booking.ownerId.toString(), {
      title: 'Payout Transferred',
      message: `Your payout of ₹${booking.deposit - (booking.platformFee || 0)} for booking ${booking._id.toString().slice(-6)} has been transferred.`,
      type: 'PayoutTransferred',
      bookingId: booking._id,
    });

    res.json({ message: 'Payout marked as transferred successfully', booking });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark payout as transferred', details: err.message });
  }
};
