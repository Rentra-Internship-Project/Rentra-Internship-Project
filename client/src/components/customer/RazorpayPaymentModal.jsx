import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiShield, FiCheckCircle, FiAlertCircle, FiLoader } from 'react-icons/fi';
import { razorpayService, bookingService } from '../../services/api';

/**
 * RazorpayPaymentModal — loads Razorpay checkout for deposit payment
 * Props:
 *   booking — the full booking object { _id/id, equipmentName, deposit, totalValue }
 *   onClose — close handler
 *   onSuccess — called with updated booking after payment confirmed
 */
const RazorpayPaymentModal = ({ booking, onClose, onSuccess }) => {
  const [step, setStep] = useState('confirm'); // 'confirm' | 'processing' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const bookingId = booking._id || booking.id;
  const depositAmount = booking.deposit || 0;
  const totalValue = booking.totalValue || 0;
  const remainingCash = booking.remainingCash || totalValue - depositAmount;

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayNow = async () => {
    setStep('processing');
    setErrorMsg('');

    try {
      // 1. Load Razorpay SDK
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setErrorMsg('Failed to load payment gateway. Check your internet connection.');
        setStep('error');
        return;
      }

      // 2. Create Razorpay order on backend
      const orderRes = await razorpayService.createOrder(bookingId);
      const { orderId, amount, currency, keyId, equipmentName } = orderRes.data;

      // 3. Open Razorpay checkout
      const options = {
        key: keyId,
        amount,
        currency,
        name: 'Rentra',
        description: `Security Deposit — ${equipmentName || booking.equipmentName}`,
        order_id: orderId,
        theme: { color: '#CCCCFF' },
        prefill: {
          name: booking.customerName || '',
          email: booking.customerEmail || '',
          contact: booking.customerPhone || '',
        },
        handler: async (paymentResponse) => {
          try {
            // 4. Verify payment on backend
            const verifyRes = await razorpayService.verifyPayment({
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
              bookingId,
            });
            setStep('success');
            if (onSuccess) {
              setTimeout(() => onSuccess(verifyRes.data.booking), 1500);
            }
          } catch (err) {
            setErrorMsg(
              err.response?.data?.error ||
                'Payment verification failed. Contact support with your payment ID: ' +
                  paymentResponse.razorpay_payment_id
            );
            setStep('error');
          }
        },
        modal: {
          ondismiss: () => {
            if (step === 'processing') setStep('confirm');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        setErrorMsg(response.error.description || 'Payment failed. Please try again.');
        setStep('error');
      });
      rzp.open();
    } catch (err) {
      setErrorMsg(
        err.response?.data?.error || 'Failed to initiate payment. Please try again.'
      );
      setStep('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={step !== 'processing' ? onClose : undefined}
        className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.2 }}
        className="relative bg-white border border-[#E2E8F0] rounded-[24px] shadow-2xl w-full max-w-md z-10 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#CCCCFF]/30 to-[#E0E7FF]/30 px-6 py-5 flex items-center justify-between border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#CCCCFF]/50 rounded-[12px]">
              <FiShield className="text-xl text-[#0F172A]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">Pay Security Deposit</h3>
              <p className="text-xs text-[#64748B]">Secure payment via Razorpay</p>
            </div>
          </div>
          {step !== 'processing' && (
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors"
            >
              <FiX className="text-lg" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Step: Confirm */}
          {step === 'confirm' && (
            <>
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[16px] p-4 space-y-3">
                <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wide">
                  Booking Summary
                </h4>
                <p className="font-bold text-[#0F172A] text-sm">{booking.equipmentName}</p>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-[#64748B]">
                    <span>Rental Period</span>
                    <span className="font-medium text-[#0F172A]">
                      {booking.startDate} → {booking.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-[#64748B]">
                    <span>Total Rental Value</span>
                    <span className="font-bold text-[#0F172A]">
                      ₹{(totalValue || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="border-t border-[#E2E8F0] my-2" />
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-[#0F172A]">Security Deposit (Online)</span>
                    <span className="text-[#3B82F6]">₹{depositAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#64748B]">
                    <span>Remaining (Pay Cash to Owner)</span>
                    <span className="font-medium text-[#0F172A]">
                      ₹{remainingCash.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-[12px] px-4 py-3 text-xs text-blue-700">
                <span className="font-bold">How it works: </span>
                You pay the security deposit online now (₹{depositAmount.toLocaleString('en-IN')}). The remaining amount is paid directly to the owner in cash upon pickup.
              </div>

              <button
                onClick={handlePayNow}
                className="w-full py-3.5 bg-gradient-to-r from-[#CCCCFF] to-[#A5B4FC] text-[#0F172A] font-bold rounded-[14px] text-sm hover:opacity-90 transition-all shadow-sm"
              >
                Pay ₹{depositAmount.toLocaleString('en-IN')} Now
              </button>

              <p className="text-[10px] text-center text-[#94A3B8]">
                🔒 Payments are processed securely by Razorpay. Your card data is never stored.
              </p>
            </>
          )}

          {/* Step: Processing */}
          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="text-4xl text-[#CCCCFF]"
              >
                <FiLoader />
              </motion.div>
              <p className="font-bold text-[#0F172A] text-sm">Processing payment...</p>
              <p className="text-xs text-[#64748B] text-center">
                Complete the payment in the Razorpay window. Do not close this page.
              </p>
            </div>
          )}

          {/* Step: Success */}
          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center"
              >
                <FiCheckCircle className="text-3xl text-emerald-500" />
              </motion.div>
              <p className="font-bold text-[#0F172A] text-sm">Deposit Paid Successfully!</p>
              <p className="text-xs text-[#64748B] text-center">
                Your security deposit of ₹{depositAmount.toLocaleString('en-IN')} has been received. The owner will prepare your equipment.
              </p>
            </div>
          )}

          {/* Step: Error */}
          {step === 'error' && (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-3 py-6">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                  <FiAlertCircle className="text-3xl text-red-500" />
                </div>
                <p className="font-bold text-[#0F172A] text-sm">Payment Failed</p>
                <p className="text-xs text-[#64748B] text-center">{errorMsg}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 border border-[#E2E8F0] text-[#64748B] text-sm font-semibold rounded-[12px] hover:bg-[#F8FAFC] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep('confirm')}
                  className="flex-1 py-2.5 bg-[#CCCCFF] text-[#0F172A] text-sm font-bold rounded-[12px] hover:opacity-90 transition-all"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default RazorpayPaymentModal;
