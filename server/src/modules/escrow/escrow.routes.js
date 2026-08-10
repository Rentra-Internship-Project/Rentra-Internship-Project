const express = require('express');
const router = express.Router();
const { createRazorpayOrder } = require('../../config/razorpay');
const { createStripePaymentIntent } = require('../../config/stripe');
const { authenticateToken } = require('../../middleware/auth.middleware');

// Create Razorpay Order API Endpoint (PAISE / INR)
router.post('/razorpay/create-order', authenticateToken, async (req, res) => {
  try {
    const { amountINR, bookingId } = req.body;
    const order = await createRazorpayOrder(amountINR || 5000, bookingId || `bk_${Date.now()}`);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Razorpay order creation failed', details: err.message });
  }
});

// Create Stripe PaymentIntent Pre-Authorization Hold (USD)
router.post('/stripe/create-intent', authenticateToken, async (req, res) => {
  try {
    const { amountUSD } = req.body;
    const intent = createStripePaymentIntent(amountUSD || 250);
    res.json(intent);
  } catch (err) {
    res.status(500).json({ error: 'Stripe intent creation failed', details: err.message });
  }
});

module.exports = router;
