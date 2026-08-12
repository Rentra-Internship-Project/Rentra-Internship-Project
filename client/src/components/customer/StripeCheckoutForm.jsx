import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { FiLock } from 'react-icons/fi';

const StripeCheckoutForm = ({ amount, bookingId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required', 
    });

    if (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && (paymentIntent.status === 'requires_capture' || paymentIntent.status === 'succeeded')) {
      onSuccess(paymentIntent.id, 'Stripe Payment');
    } else {
      setErrorMessage('Unexpected state. Please contact support.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-[12px]">
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      {errorMessage && (
        <div className="bg-red-50 text-red-600 p-3 rounded-[8px] text-sm border border-red-200">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className="w-full flex items-center justify-center gap-2 bg-[#635BFF] hover:bg-[#524BDE] text-white py-3.5 rounded-[12px] font-bold shadow-md shadow-[#635BFF]/30 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-2"
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Processing...
          </>
        ) : (
          <>
            <FiLock /> Pay ₹{amount.toLocaleString()}
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#64748B] text-center font-medium">
        <span>Payments processed securely by</span>
        <span className="font-bold text-[#0F172A]">stripe</span>
      </div>
    </form>
  );
};

export default StripeCheckoutForm;
