const Stripe = require("stripe");

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is missing in backend .env file");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe Connect Escrow Helper
async function createStripePaymentIntent(amountINR, receiptId) {
    // Convert INR to Paise
    const amountInPaise = Math.round(amountINR * 100);

    const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInPaise,
        currency: "inr",
        metadata: {
            booking_id: receiptId,
        },
        capture_method: "manual",
    });

    return {
        id: paymentIntent.id,
        client_secret: paymentIntent.client_secret,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
    };
}

module.exports = {
    createStripePaymentIntent,
};