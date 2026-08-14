const express = require('express');
const router = express.Router();
const razorpayController = require('../controllers/razorpay.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// All Razorpay routes require authentication
router.post('/create-order', authenticateToken, razorpayController.createOrder);
router.post('/verify-payment', authenticateToken, razorpayController.verifyPayment);

module.exports = router;
