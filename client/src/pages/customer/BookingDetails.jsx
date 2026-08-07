import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiShield,
  FiDollarSign,
  FiPrinter,
  FiCheck,
  FiLock,
  FiInfo,
  FiArrowRight,
} from 'react-icons/fi';
import { useCustomer } from '../../context/CustomerContext';
import Button from '../../components/common/Button';
import ConfirmModal from '../../components/common/ConfirmModal';

const statusBadgeStyles = {
  'Pending Deposit': 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30',
  'Deposit Paid': 'bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6]/30',
  'Pending Owner Approval': 'bg-purple-100 text-purple-700 border border-purple-200',
  'Approved': 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  'Awaiting Remaining Payment': 'bg-amber-100 text-amber-800 border border-amber-300 font-bold animate-pulse',
  'Confirmed': 'bg-blue-100 text-blue-700 border border-blue-200',
  'Rental Active': 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30',
  'Rental Completed': 'bg-slate-100 text-slate-700 border border-slate-200',
  'Deposit Refunded': 'bg-teal-100 text-teal-700 border border-teal-200',
  'Cancelled': 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30',
};

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bookings, cancelBooking, payRemainingBalance } = useCustomer();

  // Find target booking or fallback
  const booking = bookings.find((b) => b.id === id) || bookings[0];

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [invoiceDownloaded, setInvoiceDownloaded] = useState(false);
  const [isPayingRemaining, setIsPayingRemaining] = useState(false);

  if (!booking) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-lg font-bold text-[#0F172A]">Booking Not Found</h2>
        <Button variant="primary" size="md" onClick={() => navigate('/customer/bookings')} className="mt-4">
          Back to Bookings
        </Button>
      </div>
    );
  }

  const handleDownloadInvoice = () => {
    setInvoiceDownloaded(true);
    setTimeout(() => setInvoiceDownloaded(false), 3000);
  };

  const handleConfirmCancel = () => {
    cancelBooking(booking.id);
    setIsCancelModalOpen(false);
  };

  const handlePayRemaining = () => {
    setIsPayingRemaining(true);
    setTimeout(() => {
      payRemainingBalance(booking.id, 'Credit Card (•••• 9821)');
      setIsPayingRemaining(false);
    }, 800);
  };

  const isAwaitingRemaining =
    booking.status === 'Approved' || booking.status === 'Awaiting Remaining Payment';

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/customer/bookings')}
            className="p-2.5 rounded-[12px] bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            <FiArrowLeft className="text-lg" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">Booking #{booking.id}</h1>
              <span
                className={`status-badge text-xs font-semibold ${
                  statusBadgeStyles[booking.status] || 'bg-slate-100 text-slate-700'
                }`}
              >
                {booking.status}
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">Reserved on {booking.bookingDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {(booking.status === 'Pending Owner Approval' || booking.status === 'Pending Deposit') && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsCancelModalOpen(true)}
              className="text-[#EF4444] hover:bg-red-50"
            >
              Cancel Request
            </Button>
          )}

          {isAwaitingRemaining && (
            <Button
              variant="primary"
              size="sm"
              loading={isPayingRemaining}
              onClick={handlePayRemaining}
              icon={FiArrowRight}
              className="bg-[#22C55E] hover:bg-emerald-600 text-white shadow-md animate-pulse"
            >
              Pay Remaining Balance (₹{(booking.remainingBalance || 11100).toLocaleString()})
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadInvoice}
            icon={invoiceDownloaded ? FiCheck : FiPrinter}
          >
            {invoiceDownloaded ? 'Downloaded!' : 'Invoice'}
          </Button>
        </div>
      </div>

      {/* RENTAL TIMELINE TRACKER (Prompt Spec #8 Requirement) */}
      <div className="panel-card p-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-6">
          Rental Workflow Timeline
        </h3>
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {booking.timeline ? (
            booking.timeline.map((step, idx) => (
              <div key={idx} className="flex-1 flex items-center md:flex-col md:items-center text-left md:text-center relative z-10 w-full md:w-auto">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                    step.completed
                      ? 'bg-[#22C55E] text-white ring-4 ring-[#22C55E]/20'
                      : 'bg-[#F1F5F9] text-[#94A3B8] border border-[#E2E8F0]'
                  }`}
                >
                  {step.completed ? <FiCheck className="text-lg" /> : idx + 1}
                </div>
                <div className="ml-4 md:ml-0 md:mt-3">
                  <p className={`text-xs ${step.completed ? 'font-bold text-[#0F172A]' : 'font-medium text-[#64748B]'}`}>
                    {step.step}
                  </p>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5">{step.date}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-xs text-[#64748B]">Timeline progress tracking in effect</div>
          )}
        </div>
      </div>

      {/* Main Grid Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Equipment & Booking Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Equipment Information */}
          <div className="panel-card p-6 space-y-4">
            <h3 className="text-sm font-extrabold text-[#0F172A] border-b border-[#E2E8F0] pb-3">
              Equipment Details
            </h3>

            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <img
                src={booking.image}
                alt={booking.equipmentName}
                className="w-full sm:w-44 h-36 rounded-[18px] object-cover shrink-0 border border-[#E2E8F0]"
              />
              <div className="flex-1 min-w-0">
                <span className="px-2.5 py-0.5 bg-[#CCCCFF]/40 text-[#0F172A] text-[11px] font-bold rounded-full">
                  {booking.category}
                </span>
                <h2 className="text-lg font-bold text-[#0F172A] mt-2 mb-1">{booking.equipmentName}</h2>
                <p className="text-xs text-[#64748B] flex items-center gap-1 mb-3">
                  <FiMapPin className="text-[#3B82F6]" />
                  Job Site: {booking.siteAddress}
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs p-3 bg-[#F8FAFC] rounded-[14px] border border-[#E2E8F0]">
                  <div>
                    <span className="text-[#94A3B8] font-medium">Daily Rental Rate:</span>
                    <p className="font-extrabold text-[#0F172A]">₹{booking.dailyRate?.toLocaleString()} / day</p>
                  </div>
                  <div>
                    <span className="text-[#94A3B8] font-medium">Rental Duration:</span>
                    <p className="font-bold text-[#0F172A]">{booking.durationDays} Days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking & Site Information */}
          <div className="panel-card p-6 space-y-4">
            <h3 className="text-sm font-extrabold text-[#0F172A] border-b border-[#E2E8F0] pb-3">
              Booking Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[#F8FAFC] rounded-[14px] border border-[#E2E8F0]">
                <p className="text-[#94A3B8] uppercase font-bold text-[10px] tracking-wider mb-1">Rental Start Date</p>
                <p className="font-bold text-[#0F172A] flex items-center gap-1.5 text-sm">
                  <FiCalendar className="text-[#3B82F6]" /> {booking.startDate}
                </p>
              </div>

              <div className="p-3 bg-[#F8FAFC] rounded-[14px] border border-[#E2E8F0]">
                <p className="text-[#94A3B8] uppercase font-bold text-[10px] tracking-wider mb-1">Rental End Date</p>
                <p className="font-bold text-[#0F172A] flex items-center gap-1.5 text-sm">
                  <FiCalendar className="text-[#22C55E]" /> {booking.endDate}
                </p>
              </div>

              <div className="p-3 bg-[#F8FAFC] rounded-[14px] border border-[#E2E8F0] sm:col-span-2">
                <p className="text-[#94A3B8] uppercase font-bold text-[10px] tracking-wider mb-1">Job Site Address</p>
                <p className="font-semibold text-[#0F172A]">{booking.siteAddress}</p>
              </div>

              {booking.notes && (
                <div className="p-3 bg-[#CCCCFF]/10 rounded-[14px] border border-[#CCCCFF]/30 sm:col-span-2">
                  <p className="text-[#94A3B8] uppercase font-bold text-[10px] tracking-wider mb-1">Operator Notes / Site Instructions</p>
                  <p className="text-[#0F172A]">{booking.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Owner Info, Deposit Info & Financial Breakdown */}
        <div className="space-y-6">
          {/* Owner Information */}
          <div className="panel-card p-6 space-y-4">
            <h3 className="text-sm font-extrabold text-[#0F172A] border-b border-[#E2E8F0] pb-3">
              Asset Owner Information
            </h3>

            <div className="flex items-center gap-3">
              <img
                src={booking.ownerAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'}
                alt={booking.ownerName}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-[#CCCCFF]"
              />
              <div>
                <h4 className="text-sm font-bold text-[#0F172A] flex items-center gap-1">
                  {booking.ownerName} <FiShield className="text-[#3B82F6] text-xs" />
                </h4>
                <p className="text-[11px] text-[#64748B]">Verified Asset Partner</p>
              </div>
            </div>

            <div className="space-y-2 text-xs pt-2">
              <div className="flex items-center gap-2.5 text-[#64748B]">
                <FiPhone className="text-[#22C55E]" />
                <span className="font-medium text-[#0F172A]">{booking.ownerContact}</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#64748B]">
                <FiMail className="text-[#3B82F6]" />
                <span className="font-medium text-[#0F172A] truncate">{booking.ownerEmail}</span>
              </div>
            </div>
          </div>

          {/* Deposit Information & Refund Status (Prompt Spec #8 Requirement) */}
          <div className="panel-card p-6 space-y-3">
            <h3 className="text-sm font-extrabold text-[#0F172A] border-b border-[#E2E8F0] pb-3">
              Deposit & Escrow Status
            </h3>

            <div className="p-3.5 bg-[#F8FAFC] rounded-[16px] border border-[#E2E8F0] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Security Deposit Paid:</span>
                <span className="font-bold text-[#0F172A]">₹{(booking.deposit || 2000).toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#64748B]">Deposit Status:</span>
                <span className="font-bold text-[#22C55E]">{booking.depositStatus || 'Deposit Paid'}</span>
              </div>

              <div className="flex justify-between border-t border-[#E2E8F0] pt-2">
                <span className="text-[#64748B]">Refund Status:</span>
                <span className="font-bold text-[#3B82F6]">{booking.refundStatus || 'Held in Escrow'}</span>
              </div>
            </div>
          </div>

          {/* Payment Summary & Remaining Balance */}
          <div className="panel-card p-6 space-y-4">
            <h3 className="text-sm font-extrabold text-[#0F172A] border-b border-[#E2E8F0] pb-3">
              Payment Summary
            </h3>

            <div className="space-y-2.5 text-xs text-[#64748B]">
              <div className="flex justify-between">
                <span>Rental Cost ({booking.durationDays} days):</span>
                <span className="font-semibold text-[#0F172A]">₹{(booking.rentalCost || booking.subtotal || 10000).toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Security Deposit:</span>
                <span className="font-semibold text-[#0F172A]">₹{(booking.deposit || 2000).toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Platform Fee:</span>
                <span className="font-semibold text-[#0F172A]">₹{(booking.platformFee || 200).toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>GST (Tax):</span>
                <span className="font-semibold text-[#0F172A]">₹{(booking.gst || 900).toLocaleString()}</span>
              </div>

              <div className="pt-2 border-t border-[#E2E8F0] flex justify-between font-bold text-[#0F172A] text-sm">
                <span>Total Value:</span>
                <span>₹{(booking.totalValue || booking.totalAmount || 13100).toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3.5 bg-[#CCCCFF]/20 rounded-[16px] border border-[#CCCCFF]/50 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Deposit Paid Now:</span>
                <span className="font-bold text-[#22C55E]">₹{(booking.deposit || 2000).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-[#0F172A] pt-1 border-t border-[#CCCCFF]/40">
                <span>Remaining Balance:</span>
                <span className={booking.remainingBalance === 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}>
                  ₹{(booking.remainingBalance ?? 11100).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal Confirmation */}
      <ConfirmModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Booking Request"
        message="Are you sure you want to cancel this booking request? Paid security deposit will be refunded to your account."
        confirmText="Confirm Cancellation"
        variant="danger"
      />
    </div>
  );
};

export default BookingDetails;
