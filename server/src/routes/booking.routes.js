const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const requireCustomer = (req, res, next) => {
  // An OWNER acts as a superset of a CUSTOMER
  if (!req.user || (req.user.role !== 'CUSTOMER' && req.user.role !== 'OWNER')) {
    return res.status(403).json({ error: 'Customer or Owner access required' });
  }
  next();
};

const requireOwner = (req, res, next) => {
  if (!req.user || req.user.role !== 'OWNER') {
    return res.status(403).json({ error: 'Owner access required' });
  }
  next();
};

// Customer: get own bookings
router.get('/my', authenticateToken, requireCustomer, bookingController.getMyBookings);

// Owner: get bookings for own equipment
router.get('/owner', authenticateToken, requireOwner, bookingController.getOwnerBookings);

// Customer: create booking
router.post('/', authenticateToken, requireCustomer, bookingController.createBooking);

// Both: update booking status (controller validates role-based transitions)
router.put('/:id/status', authenticateToken, bookingController.updateBookingStatus);



// Owner: record inspection on return
router.post('/:id/inspection', authenticateToken, bookingController.recordInspection);

// Both: download invoice PDF
router.get('/:id/contract-pdf', authenticateToken, bookingController.generateContractPdf);

// Customer: rate booking
router.post('/:id/rate', authenticateToken, requireCustomer, bookingController.rateBooking);

module.exports = router;
