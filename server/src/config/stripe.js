// Stripe Connect Escrow Helper
function createStripePaymentIntent(amount, currency = 'usd') {
  return {
    id: `pi_rentra_${Date.now()}`,
    client_secret: `pi_rentra_secret_${Date.now()}`,
    amount,
    currency,
    status: 'requires_capture', // Pre-authorization deposit hold
  };
}

module.exports = { createStripePaymentIntent };
