const User = require('../models/user.model');
const Equipment = require('../models/equipment.model');
const Booking = require('../models/booking.model');
const Business = require('../models/business.model');

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEquipment = await Equipment.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalBusinesses = await Business.countDocuments();
    const pendingVerifications = await Business.countDocuments({ status: 'Pending' });

    const revenueResult = await Booking.aggregate([
      { $group: { _id: null, total: { $sum: '$totalValue' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.json({
      totalUsers,
      totalEquipment,
      totalBookings,
      totalBusinesses,
      totalRevenue,
      pendingVerifications,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats', details: err.message });
  }
};

exports.getBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find({}).populate('ownerId', 'name email phone');
    res.json(businesses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch businesses', details: err.message });
  }
};

exports.verifyBusiness = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const update = { status, verifiedAt: new Date() };
    if (rejectionReason) update.rejectionReason = rejectionReason;

    const biz = await Business.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!biz) return res.status(404).json({ error: 'Business not found' });
    res.json(biz);
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify business', details: err.message });
  }
};

exports.createBusiness = async (req, res) => {
  try {
    const newBusiness = await Business.create({
      status: 'Pending',
      ...req.body
    });
    res.status(201).json(newBusiness);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create business', details: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users', details: err.message });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({});
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings', details: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user', details: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
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
