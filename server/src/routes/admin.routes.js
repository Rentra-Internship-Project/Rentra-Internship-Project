const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.get('/stats', authenticateToken, adminController.getStats);
router.get('/businesses', authenticateToken, adminController.getBusinesses);
router.post('/businesses', authenticateToken, adminController.createBusiness);
router.put('/businesses/:id/verify', authenticateToken, adminController.verifyBusiness);

router.get('/users', authenticateToken, adminController.getUsers);
router.put('/users/:id', authenticateToken, adminController.updateUser);
router.delete('/users/:id', authenticateToken, adminController.deleteUser);

router.get('/bookings', authenticateToken, adminController.getBookings);
router.delete('/equipment/:id', authenticateToken, adminController.deleteEquipment);

module.exports = router;
