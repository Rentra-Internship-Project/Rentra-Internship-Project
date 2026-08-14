const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Middleware to enforce ADMIN role on all admin routes
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

router.use(authenticateToken, requireAdmin);

router.get('/stats', adminController.getStats);

// Business management
router.get('/businesses', adminController.getBusinesses);
router.put('/businesses/:id/verify', adminController.verifyBusiness);
router.delete('/businesses/:id', adminController.deleteBusiness);

// Equipment management (all statuses — admin view)
router.get('/equipment', adminController.getEquipment);
router.put('/equipment/:id/approve', adminController.approveEquipment);
router.put('/equipment/:id/reject', adminController.rejectEquipment);
router.delete('/equipment/:id', adminController.deleteEquipment);

// User management
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserDetails);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Booking overview
router.get('/bookings', adminController.getBookings);
router.get('/payments', adminController.getAllPayments);
router.post('/payments/:id/refund', adminController.manualRefund);
router.post('/payments/:id/payout', adminController.markPayoutTransferred);

module.exports = router;
