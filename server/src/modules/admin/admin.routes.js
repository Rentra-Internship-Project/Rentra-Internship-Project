const express = require('express');
const router = express.Router();
const { readLocalDB, writeLocalDB } = require('../../config/db');
const { authenticateToken } = require('../../middleware/auth.middleware');

router.get('/stats', authenticateToken, (req, res) => {
  const db = readLocalDB();
  const totalRevenue = db.bookings.reduce((sum, b) => sum + (b.totalValue || 0), 0);
  res.json({
    totalUsers: db.users.length,
    totalEquipment: db.equipment.length,
    totalBookings: db.bookings.length,
    totalBusinesses: db.businesses.length,
    totalRevenue,
    pendingVerifications: db.businesses.filter((b) => b.status === 'Pending').length,
  });
});

router.get('/businesses', authenticateToken, (req, res) => {
  const db = readLocalDB();
  res.json(db.businesses);
});

router.put('/businesses/:id/verify', authenticateToken, (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const db = readLocalDB();
    const biz = db.businesses.find((b) => b.id === req.params.id);
    if (!biz) return res.status(404).json({ error: 'Business not found' });
    biz.status = status;
    if (rejectionReason) biz.rejectionReason = rejectionReason;
    biz.verifiedAt = new Date().toISOString();
    writeLocalDB(db);
    res.json(biz);
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify business', details: err.message });
  }
});

module.exports = router;
