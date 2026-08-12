const { createStripePaymentIntent } = require('../config/stripe');

exports.createStripeIntent = async (req, res) => {
  try {
    const { amountINR, bookingId } = req.body;
    const intent = await createStripePaymentIntent(amountINR || 5000, bookingId || `bk_${Date.now()}`);
    res.json(intent);
  } catch (err) {
    res.status(500).json({ error: 'Stripe intent creation failed', details: err.message });
  }
};
