import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiCreditCard,
  FiSmartphone,
  FiGlobe,
  FiShield,
  FiCheckCircle,
  FiLock,
} from 'react-icons/fi';
import { useCustomer } from '../../context/CustomerContext';
import Button from '../../components/common/Button';
import { escrowService } from '../../services/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeCheckoutForm from '../../components/customer/StripeCheckoutForm';

// Load Stripe using the real Publishable Key provided by the user
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51U3JbiFBn0D34fEZdN8LhxF5fTi0xIiziMY8Mc0wHHJKsCeXGpSSgRSd8fFrkgimO2eWkZpwlpt5iyLOkELzPFi700WctMuKIp');


const DepositPayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { draftBooking, bookings, confirmDepositPayment } = useCustomer();

  const booking = draftBooking || bookings.find((b) => b.id === id) || {
    id: id || 'BK-94825',
    equipmentName: 'Caterpillar CAT 320 Hydraulic Excavator',
    deposit: 2000,
    totalValue: 13100,
  };

  const [clientSecret, setClientSecret] = useState(null);

  React.useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    escrowService.createStripeIntent({ amountINR: booking.deposit, bookingId: booking.id })
      .then((res) => {
        setClientSecret(res.data.client_secret);
      })
      .catch((err) => {
        console.error('Failed to initialize Stripe:', err);
      });
  }, [booking.deposit, booking.id]);

  const handlePaymentSuccess = (paymentId, methodString) => {
    confirmDepositPayment(booking.id, methodString);
    navigate('/customer/payment-success', {
      state: {
        bookingId: booking.id,
        equipmentName: booking.equipmentName,
        depositPaid: booking.deposit,
        paymentId,
      },
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/customer/booking-summary/${booking.id}`)}
          className="p-2.5 rounded-[12px] bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
        >
          <FiArrowLeft className="text-lg" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">Security Deposit Payment</h1>
          <p className="text-xs text-[#64748B] mt-0.5">Pay refundable security deposit to send booking request to asset owner.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Stripe Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="panel-card p-6 space-y-5 bg-white shadow-sm border border-[#E2E8F0] rounded-[24px]">
            <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-3">
              <h3 className="text-sm font-extrabold text-[#0F172A]">Secure Checkout with Stripe</h3>
              <div className="text-[10px] font-semibold text-[#64748B] flex items-center gap-1 bg-[#F8FAFC] px-2 py-1 rounded-[6px]">
                <FiLock className="text-[#635BFF]" /> Secured by <span className="text-[#635BFF] font-bold tracking-tight">stripe</span>
              </div>
            </div>

            {/* Real Stripe Elements Injection */}
            <div className="pt-2">
              {clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                  <StripeCheckoutForm amount={booking.deposit} bookingId={booking.id} onSuccess={handlePaymentSuccess} />
                </Elements>
              ) : (
                <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-[#E2E8F0] rounded-[16px] bg-[#F8FAFC]">
                  <div className="w-6 h-6 border-2 border-[#635BFF]/30 border-t-[#635BFF] rounded-full animate-spin mb-2"></div>
                  <p className="text-sm font-semibold text-[#0F172A]">Loading Secure Payment...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Payment Summary & Submit CTA */}
        <div className="space-y-6">
          <div className="panel-card p-6 space-y-4 border-2 border-[#635BFF]/30 shadow-lg rounded-[24px]">
            <h3 className="text-base font-extrabold text-[#0F172A]">Deposit Summary</h3>

            <div className="p-4 bg-[#F8FAFC] rounded-[16px] border border-[#E2E8F0] space-y-2 text-xs">
              <div className="flex justify-between text-[#64748B]">
                <span>Booking Ref:</span>
                <span className="font-mono font-bold text-[#0F172A]">{booking.id}</span>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>Equipment:</span>
                <span className="font-bold text-[#0F172A] line-clamp-1">{booking.equipmentName}</span>
              </div>
            </div>

            <div className="flex justify-between items-end border-t border-[#E2E8F0] pt-4">
              <span className="text-sm font-semibold text-[#64748B]">Total Due</span>
              <div className="text-right">
                <p className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
                  ₹{booking.deposit.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#64748B] text-center pt-2 font-medium">
              <span>Payments processed securely by</span>
              <span className="font-bold text-[#0F172A]">stripe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositPayment;
