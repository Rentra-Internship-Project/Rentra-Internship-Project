import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCalendar, FiClock, FiCheckCircle, FiUser, FiMail, FiPhone, FiMapPin, FiShield, FiPrinter, FiCheck, FiX, FiLock, FiInfo, FiArrowRight, FiAlertCircle, FiStar } from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';
import { useCustomer } from '../../context/CustomerContext';
import Button from '../../components/common/Button';
import ConfirmModal from '../../components/common/ConfirmModal';
import DigitalInspectionModal from '../../components/common/DigitalInspectionModal';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const statusBadgeStyles = {
  'Pending Deposit': 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30',
  'Deposit Paid': 'bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6]/30',
  'Pending Owner Approval': 'bg-purple-100 text-purple-700 border border-purple-200',
  'Approved': 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  'Awaiting Remaining Payment': 'bg-amber-100 text-amber-800 border border-amber-300 font-bold animate-pulse',
  'Confirmed': 'bg-blue-100 text-blue-700 border border-blue-200',
  'Rental Active': 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30',
  'Rental Completed': 'bg-slate-100 text-slate-700 border border-slate-200',
  'Completed': 'bg-slate-100 text-slate-700 border border-slate-200',
  'Deposit Refunded': 'bg-teal-100 text-teal-700 border border-teal-200',
  'Cancelled': 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30',
};

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bookings, cancelBooking, payRemainingBalance, rateBooking, profile } = useCustomer();

  const booking = bookings.find((b) => b.id === id) || bookings[0];

  const invoiceRef = React.useRef(null);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);
  const [isReportIssueModalOpen, setIsReportIssueModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [ratingSuccess, setRatingSuccess] = useState(false);
  const [isInspected, setIsInspected] = useState(false);
  const [invoiceDownloaded, setInvoiceDownloaded] = useState(false);
  const [isPayingRemaining, setIsPayingRemaining] = useState(false);

  const canRate = ['Completed', 'Return Requested'].includes(booking?.status) && !booking?.rating;

  const STATUS_FLOW = [
    'Pending Approval',
    'Approved',
    'Deposit Paid',
    'Ready For Pickup',
    'Rental Active',
    'Return Requested',
    'Completed'
  ];

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
    const doc = new jsPDF();
    
    // Header background
    doc.setFillColor(15, 23, 42); // #0F172A
    doc.rect(0, 0, 210, 45, 'F');
    
    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('Rentra.', 15, 28);
    
    // Invoice text
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(204, 204, 255); // #CCCCFF
    doc.text('TAX INVOICE', 160, 20);
    doc.setFontSize(9);
    doc.text(`Invoice #${booking.id.slice(-6).toUpperCase()}`, 160, 28);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 160, 34);
    
    // Billed To & Owner Info
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Billed To:', 15, 60);
    doc.text('Asset Partner:', 120, 60);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139); // #64748B
    doc.text(`${profile?.name || 'Customer'}`, 15, 66);
    doc.text(`${profile?.email || 'N/A'}`, 15, 72);
    
    doc.text(`${booking.ownerName}`, 120, 66);
    doc.text(`${booking.ownerEmail || ''}`, 120, 72);
    doc.text(`${booking.ownerContact || ''}`, 120, 78);
    
    // Equipment Details
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Equipment Details', 15, 95);
    doc.setDrawColor(226, 232, 240); // #E2E8F0
    doc.line(15, 98, 195, 98);
    
    doc.setFontSize(14);
    doc.text(booking.equipmentName, 15, 108);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Rental Period: ${booking.startDate} to ${booking.endDate} (${booking.durationDays} Days)`, 15, 115);
    doc.text(`Job Site: ${booking.siteAddress || 'N/A'}`, 15, 122);
    
    // Financial Table (No extra stuff, just the exact lines in Payment Summary)
    const tableData = [
      ['Rental Cost', `Rs. ${(booking.rentalCost || 0).toLocaleString()}`],
      ['Platform Fee', `Rs. ${(booking.platformFee || 0).toLocaleString()}`],
      ['Total Value', `Rs. ${(booking.totalValue || 0).toLocaleString()}`],
      ['Advance Paid Now (20%)', `- Rs. ${(booking.deposit || 0).toLocaleString()}`],
      ['Remaining Balance', booking.status === 'Completed' ? 'Rs. 0 (Paid in Full)' : `Rs. ${(booking.remainingCash || 0).toLocaleString()}`]
    ];

    doc.autoTable({
      startY: 135,
      head: [['Description', 'Amount']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      styles: { font: 'helvetica', fontSize: 11, textColor: [15, 23, 42], cellPadding: 6 },
      columnStyles: { 1: { halign: 'right', fontStyle: 'bold' } },
      didParseCell: function (data) {
        if (data.section === 'body') {
          if (data.row.index === 2) { // Total Value
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fillColor = [255, 255, 255];
          }
          if (data.row.index === 3) { // Advance
            data.cell.styles.textColor = [34, 197, 94]; // Green
          }
          if (data.row.index === 4) { // Remaining
            data.cell.styles.fillColor = [15, 23, 42]; // Dark bg
            data.cell.styles.textColor = [255, 255, 255];
            data.cell.styles.fontStyle = 'bold';
          }
        }
      }
    });
    
    // Footer
    const finalY = doc.lastAutoTable.finalY || 180;
    doc.setDrawColor(226, 232, 240);
    doc.line(15, finalY + 15, 195, finalY + 15);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Thank you for using Rentra for your equipment needs.', 105, finalY + 25, { align: 'center' });
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('For any queries or support, please contact us at support@rentra.in', 105, finalY + 32, { align: 'center' });

    doc.save(`Invoice_Rentra_${booking.id}.pdf`);

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

  // Compute Timeline based on actual status
  const currentFlowIndex = STATUS_FLOW.indexOf(booking.status);
  const isCancelled = booking.status === 'Cancelled' || booking.status === 'Rejected';

  const computedTimeline = STATUS_FLOW.map((step, idx) => {
    let completed = false;
    let dateStr = 'Pending';
    
    if (isCancelled) {
      if (idx === 0) {
        completed = true;
        dateStr = booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-IN') : 'Done';
      } else {
        completed = false;
        dateStr = 'Cancelled';
      }
    } else {
      if (idx <= currentFlowIndex) {
        completed = true;
        dateStr = 'Completed';
      }
    }
    
    if (completed && idx === 0 && booking.createdAt) dateStr = new Date(booking.createdAt).toLocaleDateString('en-IN');
    if (completed && step === 'Rental Active' && booking.startDate) dateStr = new Date(booking.startDate).toLocaleDateString('en-IN');
    if (completed && step === 'Completed' && booking.endDate) dateStr = new Date(booking.endDate).toLocaleDateString('en-IN');

    return { step, completed, date: dateStr };
  });

  return (
    <div className="space-y-6">
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

        <div className="flex flex-wrap items-center gap-3">
          {['Pending Approval', 'Approved', 'Deposit Paid'].includes(booking.status) && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsCancelModalOpen(true)}
              className="text-[#EF4444] hover:bg-red-50"
            >
              Cancel Request
            </Button>
          )}

          {booking.status === 'Ready For Pickup' && (
            <Button
              variant="primary"
              size="sm"
              icon={FiCheckCircle}
              onClick={async () => {
                try {
                  await bookingService.updateStatus(booking.id, 'Rental Active');
                  window.location.reload();
                } catch (err) {
                  alert('Failed to mark received: ' + (err.response?.data?.error || err.message));
                }
              }}
            >
              Equipment Received
            </Button>
          )}

          {booking.status === 'Rental Active' && (
            <>
              <Button
                variant="secondary"
                size="sm"
                className="text-[#0F172A] border-[#E2E8F0] hover:bg-[#F8FAFC]"
              >
                Request Extension
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsReportIssueModalOpen(true)}
                icon={FiAlertCircle}
                className="text-[#EF4444] border-red-200 hover:bg-red-50"
              >
                Report Issue
              </Button>
            </>
          )}

          {canRate && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsRatingModalOpen(true)}
              icon={FiStar}
              className="bg-[#0F172A] hover:bg-[#1E293B] text-white"
            >
              Rate Rental
            </Button>
          )}

          {booking?.rating > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-[12px] text-xs font-semibold text-amber-700">
              <FiStar className="fill-current text-amber-500" />
              Rated {booking.rating}/5
            </div>
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

      <div className="panel-card p-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-6">
          Rental Workflow Timeline
        </h3>
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {computedTimeline.map((step, idx) => (
            <div key={idx} className={`flex-1 flex items-center md:flex-col md:items-center text-left md:text-center relative z-10 w-full md:w-auto ${isCancelled && idx > 0 ? 'opacity-30' : ''}`}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                  step.completed
                    ? 'bg-[#22C55E] text-white ring-4 ring-[#22C55E]/20'
                    : isCancelled
                    ? 'bg-red-50 text-red-300 border border-red-200'
                    : 'bg-[#F1F5F9] text-[#94A3B8] border border-[#E2E8F0]'
                }`}
              >
                {step.completed ? <FiCheck className="text-lg" /> : isCancelled ? <FiX className="text-lg" /> : idx + 1}
              </div>
              <div className="ml-4 md:ml-0 md:mt-3">
                <p className={`text-xs ${step.completed ? 'font-bold text-[#0F172A]' : 'font-medium text-[#64748B]'}`}>
                  {step.step}
                </p>
                <p className="text-[11px] text-[#94A3B8] mt-0.5">{step.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
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

        <div className="space-y-6">
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

            <div className="pt-2">
              <Button variant="outline" size="sm" className="w-full text-xs font-bold border-[#E2E8F0] hover:bg-[#F1F5F9]">
                Contact Owner
              </Button>
            </div>
          </div>

          <div className="panel-card p-6 space-y-3">
            <h3 className="text-sm font-extrabold text-[#0F172A] border-b border-[#E2E8F0] pb-3">
              Advance Payment Status
            </h3>

            <div className="p-3.5 bg-[#F8FAFC] rounded-[16px] border border-[#E2E8F0] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Advance Paid (20%):</span>
                <span className="font-bold text-[#0F172A]">₹{(booking.deposit || 0).toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#64748B]">Payment Status:</span>
                <span className="font-bold text-[#22C55E]">{booking.depositStatus || 'Pending'}</span>
              </div>
            </div>
          </div>

          <div className="panel-card p-6 space-y-4">
            <h3 className="text-sm font-extrabold text-[#0F172A] border-b border-[#E2E8F0] pb-3">
              Payment Summary
            </h3>

            <div className="space-y-2.5 text-xs text-[#64748B]">
              <div className="flex justify-between">
                <span>Rental Cost ({booking.durationDays} days):</span>
                <span className="font-semibold text-[#0F172A]">₹{(booking.rentalCost || 0).toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Platform Fee:</span>
                <span className="font-semibold text-[#0F172A]">₹{(booking.platformFee || 0).toLocaleString()}</span>
              </div>

              <div className="pt-2 border-t border-[#E2E8F0] flex justify-between font-bold text-[#0F172A] text-sm">
                <span>Total Value:</span>
                <span>₹{(booking.totalValue || 0).toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3.5 bg-[#CCCCFF]/20 rounded-[16px] border border-[#CCCCFF]/50 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Advance Paid Now:</span>
                <span className="font-bold text-[#22C55E]">₹{(booking.deposit || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-[#0F172A] pt-1 border-t border-[#CCCCFF]/40">
                <span>Remaining Balance:</span>
                <span className={booking.status === 'Completed' || booking.remainingCash === 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}>
                  {booking.status === 'Completed' ? '₹0 (Paid in Full)' : `₹${(booking.remainingCash || 0).toLocaleString()}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Booking Request"
        message="Are you sure you want to cancel this booking request? Paid security deposit will be refunded to your account."
        confirmText="Confirm Cancellation"
        variant="danger"
      />

      <ConfirmModal
        isOpen={isReportIssueModalOpen}
        onClose={() => setIsReportIssueModalOpen(false)}
        onConfirm={() => setIsReportIssueModalOpen(false)}
        title="Report an Issue"
        message="Are you experiencing an issue with the equipment or delivery? Submitting this report will notify the owner and pause the escrow release until our support team resolves the dispute."
        confirmText="Submit Report"
        variant="danger"
      />

      {ratingSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 bg-[#0F172A] text-white rounded-[16px] shadow-2xl text-sm font-semibold"
        >
          <FiStar className="fill-current text-amber-400 text-base" />
          Rating submitted! Thank you for your feedback.
        </motion.div>
      )}

      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        onSubmit={async (ratingVal, reviewVal) => {
          const result = await rateBooking(booking.id, ratingVal, reviewVal);
          if (result.success) {
            setIsRatingModalOpen(false);
            setRatingSuccess(true);
            setTimeout(() => setRatingSuccess(false), 4000);
          } else {
            alert(result.error || 'Failed to submit rating. Please try again.');
          }
        }}
      />

      <DigitalInspectionModal
        isOpen={isInspectionModalOpen}
        onClose={() => setIsInspectionModalOpen(false)}
        onConfirm={() => setIsInspected(true)}
        bookingId={booking.id}
      />

    </div>
  );
};

const RatingModal = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setRating(0);
    setHover(0);
    setReview('');
    setLoading(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (!rating) return;
    setLoading(true);
    await onSubmit(rating, review);
    setRating(0);
    setHover(0);
    setReview('');
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[24px] p-6 max-w-sm w-full shadow-2xl relative"
      >
        <button onClick={handleClose} className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#0F172A]">
          <FiX className="text-xl" />
        </button>
        <h3 className="text-lg font-bold text-[#0F172A] mb-1">Rate your Rental</h3>
        <p className="text-xs text-[#64748B] mb-5">How was your experience with this equipment and owner?</p>
        
        {/* Stars */}
        <div className="flex justify-center gap-2 mb-5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`text-3xl transition-colors ${star <= (hover || rating) ? 'text-[#F59E0B]' : 'text-[#E2E8F0]'}`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            >
              <FiStar className={star <= (hover || rating) ? 'fill-[#F59E0B]' : ''} />
            </button>
          ))}
        </div>

        {/* Star Label */}
        {rating > 0 && (
          <p className="text-center text-xs font-semibold text-[#64748B] mb-4">
            {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
          </p>
        )}

        {/* Review textarea */}
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Write a short review (optional)..."
          rows={3}
          className="w-full mb-4 px-3.5 py-2.5 border border-[#E2E8F0] rounded-[12px] text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30 resize-none"
        />
        
        <Button 
          variant="primary" 
          className="w-full" 
          onClick={handleSubmit}
          disabled={!rating || loading}
        >
          {loading ? 'Submitting...' : 'Submit Rating'}
        </Button>
      </motion.div>
    </div>
  );
};

export default BookingDetails;

