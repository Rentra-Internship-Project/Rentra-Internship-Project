const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.get('/', authenticateToken, bookingController.getAllBookings);
router.post('/', authenticateToken, bookingController.createBooking);
router.put('/:id/status', authenticateToken, bookingController.updateBookingStatus);
router.post('/:id/inspection', authenticateToken, bookingController.recordInspection);
router.get('/:id/contract-pdf', authenticateToken, bookingController.generateContractPdf);

module.exports = router;
