/**
 * DepositPayment.jsx — Deprecated
 * 
 * Payment is now handled inline on the Bookings page via RazorpayPaymentModal.
 * This page redirects to the bookings list.
 */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DepositPayment = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to bookings — payment is now done inline via RazorpayPaymentModal
    navigate('/customer/bookings', { replace: true });
  }, [navigate]);

  return null;
};

export default DepositPayment;
