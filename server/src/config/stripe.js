const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Stripe Connect Escrow Helper
async function createStripePaymentIntent(amountINR, receiptId) {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('...')) {
    throw new Error('Valid STRIPE_SECRET_KEY is missing in backend .env file');
  }

  // Convert INR to Paise (smallest currency unit)
  const amountInPaise = Math.round(amountINR * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInPaise,
    currency: 'inr',
    metadata: {
      booking_id: receiptId,
    },
    // Required for escrow flows if we want to manually capture later
    capture_method: 'manual', 
  });

  return {
    id: paymentIntent.id,
    client_secret: paymentIntent.client_secret,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    status: paymentIntent.status,
  };
}

module.exports = { createStripePaymentIntent };
