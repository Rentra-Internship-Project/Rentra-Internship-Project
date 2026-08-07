import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiCalendar, FiArrowRight, FiShield, FiTruck, FiInfo } from 'react-icons/fi';
import Button from '../../components/common/Button';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  const bookingId = state.bookingId || 'BK-94825';
  const equipmentName = state.equipmentName || 'Caterpillar CAT 320 Hydraulic Excavator';
  const depositPaid = state.depositPaid || 2000;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pt-4 pb-8">
      {/* Animated Success Hero Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="panel-card p-8 text-center flex flex-col items-center justify-center space-y-6 relative overflow-hidden"
      >
        <div className="w-20 h-20 rounded-full bg-[#22C55E]/15 text-[#22C55E] flex items-center justify-center ring-8 ring-[#22C55E]/10 animate-bounce">
          <FiCheckCircle className="text-4xl" />
        </div>

        <div>
          <span className="px-3 py-1 bg-[#22C55E]/15 text-[#22C55E] text-xs font-bold rounded-full border border-[#22C55E]/30 inline-block mb-2">
            Payment Successful
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Security Deposit Confirmed!
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-md mx-auto">
            Your deposit payment has been processed and held securely in escrow.
          </p>
        </div>

        {/* Details Table Card */}
        <div className="w-full bg-[#F8FAFC] rounded-[20px] border border-[#E2E8F0] p-5 text-left space-y-3 text-xs">
          <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
            <span className="text-[#64748B]">Booking ID Reference:</span>
            <span className="font-mono font-bold text-[#0F172A]">{bookingId}</span>
          </div>

          <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
            <span className="text-[#64748B]">Equipment Unit:</span>
            <span className="font-bold text-[#0F172A] line-clamp-1">{equipmentName}</span>
          </div>

          <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
            <span className="text-[#64748B]">Security Deposit Paid:</span>
            <span className="font-extrabold text-[#22C55E]">₹{depositPaid.toLocaleString()}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#64748B]">Current Booking Status:</span>
            <span className="font-bold px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-[11px]">
              Pending Owner Approval
            </span>
          </div>
        </div>

        {/* Next Steps Message Highlight */}
        <div className="w-full p-4 bg-[#CCCCFF]/20 rounded-[18px] border border-[#CCCCFF] text-left text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-[#0F172A]">
            <FiInfo className="text-[#3B82F6] text-sm shrink-0" />
            <span>Next Steps in Rental Workflow:</span>
          </div>
          <p className="text-[#64748B] leading-relaxed">
            "Your booking request has been sent to the equipment owner. Once approved, you will be asked to complete the remaining payment."
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-2">
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate(`/customer/bookings/${bookingId}`)}
            className="w-full sm:flex-1"
            icon={FiCalendar}
          >
            View Booking Details
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/customer/browse-equipment')}
            className="w-full sm:flex-1"
            icon={FiTruck}
          >
            Browse Equipment
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/customer/dashboard')}
            className="w-full sm:w-auto"
          >
            Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
