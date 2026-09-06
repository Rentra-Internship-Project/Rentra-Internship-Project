import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiShield, FiCheckCircle, FiAlertCircle, FiLoader } from 'react-icons/fi';
import { razorpayService } from '../../services/api';

/**
 * RazorpayPaymentModal — Loads Razorpay checkout for deposit payment.
 * Optimized specifically for Mobile & Android devices:
 *  - Zero-latency user gesture preservation to avoid Android Chrome's pop-up blocker.
 *  - Order pre-generation in the background upon modal open.
 *  - Android hardware/gesture back-button interception (handleback: true).
 *  - Android SMS Retriever API integration (send_sms_hash: true).
 *  - Stale-closure prevention during external UPI app handoffs (GPay, PhonePe, Paytm).
 *  - Accidental touch dismissal protection (backdropclose: false, confirm_close: true).
 */
const RazorpayPaymentModal = ({ booking, onClose, onSuccess }) => {
  const [step, setStep] = useState('confirm'); // 'confirm' | 'processing' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [cachedOrder, setCachedOrder] = useState(null);
  const [isPreloadingOrder, setIsPreloadingOrder] = useState(false);

  // Keep ref synchronized with state to prevent stale closures in Razorpay callbacks
  const stepRef = useRef(step);
  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  const bookingId = booking._id || booking.id;
  const depositAmount = booking.deposit || 0;
  const totalValue = booking.totalValue || 0;
  const remainingCash = booking.remainingCash || totalValue - depositAmount;

  // Pre-create Razorpay Order in the background when modal mounts.
  // This ensures that when the user taps "Pay Now", rzp.open() executes
  // synchronously within the direct touch event window, completely bypassing Android's popup blocker.
  useEffect(() => {
    let isMounted = true;
    if (!bookingId) return;

    setIsPreloadingOrder(true);
    razorpayService
      .createOrder(bookingId)
      .then((res) => {
        if (isMounted && res?.data?.orderId) {
          setCachedOrder(res.data);
        }
      })
      .catch((err) => {
        console.warn('Background order pre-generation notice:', err?.response?.data?.error || err.message);
      })
      .finally(() => {
        if (isMounted) setIsPreloadingOrder(false);
      });

    return () => {
      isMounted = false;
    };
  }, [bookingId]);

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);

      const existingScript = document.querySelector('script[src*="checkout.razorpay.com"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(true));
        existingScript.addEventListener('error', () => resolve(false));
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });

  const handlePayNow = async () => {
    setStep('processing');
    setErrorMsg('');

    try {
      // 1. Verify Razorpay SDK readiness
      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        setErrorMsg('Failed to load payment gateway. Check your internet connection.');
        setStep('error');
        return;
      }

      // 2. Use background-cached order if available, or fetch now
      let orderData = cachedOrder;
      if (!orderData || !orderData.orderId) {
        const orderRes = await razorpayService.createOrder(bookingId);
        orderData = orderRes.data;
      }

      const { orderId, amount, currency, keyId, equipmentName } = orderData;

      // 3. Configure Razorpay checkout with Android & Mobile Best Practices
      const options = {
        key: keyId,
        amount,
        currency: currency || 'INR',
        name: 'Rentra Marketplace',
        description: `Security Deposit — ${equipmentName || booking.equipmentName}`,
        order_id: orderId,
        theme: {
          color: '#059669', // Emerald brand tone
          backdrop_color: 'rgba(15, 23, 42, 0.75)',
        },
        // Android Specific: Enable SMS auto-read for banking OTPs
        send_sms_hash: true,
        // Allow user to switch/retry UPI apps if initial payment times out
        retry: {
          enabled: true,
          max_count: 3,
        },
        prefill: {
          name: booking.customerName || '',
          email: booking.customerEmail || '',
          contact: booking.customerPhone || '',
        },
        handler: async (paymentResponse) => {
          try {
            // 4. Verify payment signature on backend
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
          // Android Specific: Intercepts physical/gesture back button so user isn't navigated away
          handleback: true,
          // Confirmation dialog before aborting payment
          confirm_close: true,
          // Prevent accidental backdrop touches while scrolling on mobile
          backdropclose: false,
          escape: false,
          ondismiss: () => {
            // Stale-closure free dismissal reset
            if (stepRef.current === 'processing') {
              setStep('confirm');
            }
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
        err.response?.data?.error || 'Failed to initiate payment. Please check your connection.'
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

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.2 }}
        className="relative bg-white border border-[#E2E8F0] rounded-[24px] shadow-2xl w-full max-w-md z-10 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 px-6 py-5 flex items-center justify-between border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100/80 rounded-[12px]">
              <FiShield className="text-xl text-emerald-700" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">Pay Security Deposit</h3>
              <p className="text-xs text-[#64748B]">Safe &amp; Instant Razorpay Gateway</p>
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
                    <span className="text-emerald-600 font-extrabold">₹{depositAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#64748B]">
                    <span>Remaining (Pay Cash to Owner)</span>
                    <span className="font-medium text-[#0F172A]">
                      ₹{remainingCash.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50/80 border border-emerald-200 rounded-[12px] px-4 py-3 text-xs text-emerald-800">
                <span className="font-bold">How it works: </span>
                Pay the 20% security deposit (₹{depositAmount.toLocaleString('en-IN')}) online. The owner prepares your equipment and the remaining balance is settled in cash upon pickup.
              </div>

              <button
                onClick={handlePayNow}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-[14px] text-sm transition-all shadow-md active:scale-[0.99]"
              >
                Pay ₹{depositAmount.toLocaleString('en-IN')} Now
              </button>

              <p className="text-[10px] text-center text-[#94A3B8]">
                🔒 256-bit encrypted checkout. Supports UPI (Google Pay, PhonePe, Paytm), Cards &amp; NetBanking.
              </p>
            </>
          )}

          {/* Step: Processing */}
          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="text-4xl text-emerald-600"
              >
                <FiLoader />
              </motion.div>
              <p className="font-bold text-[#0F172A] text-sm">Processing payment...</p>
              <p className="text-xs text-[#64748B] text-center">
                Complete payment in the Razorpay window or your UPI app. Do not refresh this page.
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
                Your security deposit of ₹{depositAmount.toLocaleString('en-IN')} has been confirmed. The owner is notified to prepare your machinery.
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
                <p className="font-bold text-[#0F172A] text-sm">Payment Incomplete</p>
                <p className="text-xs text-[#64748B] text-center">{errorMsg}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 border border-[#E2E8F0] text-[#64748B] text-sm font-semibold rounded-[12px] hover:bg-[#F8FAFC] transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => setStep('confirm')}
                  className="flex-1 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-[12px] hover:bg-emerald-700 transition-all"
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
