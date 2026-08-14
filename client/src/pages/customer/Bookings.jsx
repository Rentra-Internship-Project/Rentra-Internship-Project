import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCalendar,
  FiUser,
  FiEye,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiCreditCard,
  FiDownload,
  FiCheck,
} from 'react-icons/fi';
import { useCustomer } from '../../context/CustomerContext';
import SearchBar from '../../components/common/SearchBar';
import BookingCard from '../../components/customer/BookingCard';
import EmptyState from '../../components/common/EmptyState';
import ConfirmModal from '../../components/common/ConfirmModal';
import Button from '../../components/common/Button';
import RazorpayPaymentModal from '../../components/customer/RazorpayPaymentModal';
import { bookingService } from '../../services/api';

// Match exact enum from backend
const statusBadgeStyles = {
  'Pending Approval': 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30',
  'Approved': 'bg-blue-100 text-[#3B82F6] border border-blue-200',
  'Deposit Paid': 'bg-purple-100 text-purple-600 border border-purple-200',
  'Ready For Pickup': 'bg-cyan-100 text-cyan-600 border border-cyan-200',
  'Rental Active': 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30',
  'Return Requested': 'bg-orange-100 text-orange-600 border border-orange-200',
  'Completed': 'bg-emerald-100 text-emerald-600 border border-emerald-200',
  'Rejected': 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30',
  'Cancelled': 'bg-slate-100 text-slate-600 border border-slate-200',
};

const statusIcons = {
  'Pending Approval': FiClock,
  'Approved': FiCheckCircle,
  'Deposit Paid': FiCheckCircle,
  'Ready For Pickup': FiCheckCircle,
  'Rental Active': FiCheckCircle,
  'Return Requested': FiAlertTriangle,
  'Completed': FiCheckCircle,
  'Rejected': FiXCircle,
  'Cancelled': FiXCircle,
};

const filterTabs = [
  'All',
  'Pending Approval',
  'Approved',
  'Deposit Paid',
  'Rental Active',
  'Completed',
  'Cancelled',
];

const Bookings = () => {
  const navigate = useNavigate();
  const { bookings, setBookings, cancelBooking, requestReturn, fetchBookings } = useCustomer();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Cancel modal
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // Razorpay payment modal
  const [paymentBooking, setPaymentBooking] = useState(null);

  // Filter bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((bk) => {
      const matchesSearch =
        (bk.id || bk._id || '').toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        (bk.equipmentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (bk.ownerName || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'All' || bk.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchQuery, selectedStatus]);

  const handleConfirmCancel = async () => {
    if (bookingToCancel) {
      await cancelBooking(bookingToCancel);
      setBookingToCancel(null);
      setIsCancelModalOpen(false);
    }
  };

  const handleRequestReturn = async (id) => {
    await requestReturn(id);
  };

  const handlePaymentSuccess = (updatedBooking) => {
    // Update the booking in local list
    if (setBookings) {
      setBookings((prev) =>
        prev.map((b) =>
          (b.id === updatedBooking._id || b._id === updatedBooking._id)
            ? { ...b, status: 'Deposit Paid', depositStatus: 'Paid' }
            : b
        )
      );
    }
    setPaymentBooking(null);
    fetchBookings();
  };

  const handleDownloadInvoice = async (id) => {
    try {
      const res = await bookingService.downloadContractPdf(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Rentra_Invoice_${id.slice(-8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download invoice');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="panel-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">My Rental Bookings</h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Track status, pay deposits, and manage all your rental bookings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 bg-[#CCCCFF]/30 border border-[#CCCCFF] rounded-full text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
            <FiCalendar />
            <span>{bookings.length} Total</span>
          </span>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="panel-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-80">
          <SearchBar
            searchTerm={searchQuery}
            onSearchChange={setSearchQuery}
            placeholder="Search by booking ID, equipment..."
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {filterTabs.map((status) => {
            const count =
              status === 'All'
                ? bookings.length
                : bookings.filter((b) => b.status === status).length;
            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedStatus === status
                    ? 'bg-[#CCCCFF] text-[#0F172A] shadow-xs font-extrabold'
                    : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#E2E8F0]'
                }`}
              >
                <span>{status}</span>
                <span className="px-1.5 py-0.5 bg-white/80 rounded-full text-[10px] text-[#0F172A]">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="block md:hidden space-y-3">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((bk) => (
            <BookingCard
              key={bk.id}
              booking={bk}
              onPayDeposit={bk.status === 'Approved' ? () => setPaymentBooking(bk) : null}
              onCancel={
                ['Pending Approval', 'Approved', 'Deposit Paid'].includes(bk.status)
                  ? (id) => { setBookingToCancel(id); setIsCancelModalOpen(true); }
                  : null
              }
              onRequestReturn={bk.status === 'Rental Active' ? () => handleRequestReturn(bk.id) : null}
              onMarkReceived={
                bk.status === 'Ready For Pickup' 
                  ? async (id) => {
                      try {
                        await bookingService.updateStatus(id, 'Rental Active');
                        window.location.reload();
                      } catch (err) {
                        alert('Failed to mark received: ' + (err.response?.data?.error || err.message));
                      }
                    }
                  : null
              }
            />
          ))
        ) : (
          <EmptyState
            icon={FiCalendar}
            title="No Bookings Found"
            description={
              searchQuery
                ? `No bookings matched "${searchQuery}".`
                : "You don't have any bookings under this status."
            }
            actionText="Explore Equipment"
            onAction={() => navigate('/customer/dashboard')}
          />
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block panel-card overflow-hidden">
        {filteredBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                  <th className="py-4 px-5">Equipment</th>
                  <th className="py-4 px-5">Owner</th>
                  <th className="py-4 px-5">Rental Dates</th>
                  <th className="py-4 px-5">Total</th>
                  <th className="py-4 px-5">Deposit</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-sm">
                {filteredBookings.map((bk) => {
                  const StatusIcon = statusIcons[bk.status] || FiClock;
                  return (
                    <tr key={bk.id} className="hover:bg-[#F8FAFC]/80 transition-colors group">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={bk.image}
                            alt={bk.equipmentName}
                            className="w-11 h-10 rounded-[10px] object-cover shrink-0 border border-[#E2E8F0]"
                          />
                          <div>
                            <p className="font-bold text-[#0F172A] text-xs line-clamp-1 group-hover:text-[#3B82F6] transition-colors">
                              {bk.equipmentName}
                            </p>
                            <span className="text-[10px] text-[#64748B] font-mono">
                              #{(bk.id || bk._id || '').toString().slice(-8).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span className="font-semibold text-xs text-[#0F172A] flex items-center gap-1">
                          <FiUser className="text-[#3B82F6] text-xs" />
                          {bk.ownerName || '—'}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <div className="text-xs text-[#0F172A]">
                          <p className="font-semibold">{bk.startDate} → {bk.endDate}</p>
                          <p className="text-[11px] text-[#64748B]">{bk.durationDays} day(s)</p>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span className="font-extrabold text-[#0F172A] text-xs">
                          ₹{((bk.totalValue || 0)).toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <div className="text-xs">
                          <span className={`font-semibold ${bk.depositStatus === 'Paid' ? 'text-emerald-600' : bk.depositStatus === 'Refunded' ? 'text-red-500' : 'text-[#F59E0B]'}`}>
                            {bk.depositStatus === 'Paid' ? '✓ Paid' : bk.depositStatus === 'Refunded' ? 'Refunded' : 'Pending'}
                          </span>
                          {bk.deposit > 0 && (
                            <p className="text-[10px] text-[#64748B]">₹{(bk.deposit || 0).toLocaleString('en-IN')}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 w-fit ${
                            statusBadgeStyles[bk.status] || 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <StatusIcon className="text-xs shrink-0" />
                          {bk.status}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Pay Deposit — only when Approved and not yet paid */}
                          {bk.status === 'Approved' && (
                            <Button
                              variant="primary"
                              size="xs"
                              icon={FiCreditCard}
                              onClick={() => setPaymentBooking(bk)}
                            >
                              Pay Deposit
                            </Button>
                          )}
                          {/* Mark Received — only when Ready For Pickup */}
                          {bk.status === 'Ready For Pickup' && (
                            <Button
                              variant="primary"
                              size="xs"
                              icon={FiCheck}
                              onClick={async () => {
                                try {
                                  await bookingService.updateStatus(bk.id, 'Rental Active');
                                  // Update local state without reload
                                  const updatedBookings = await bookingService.getMyBookings();
                                  // Depending on how customerContext handles it, we might need a page reload, 
                                  // but usually the customer module handles real-time updates via context or we can just reload for simplicity
                                  window.location.reload();
                                } catch (err) {
                                  alert('Failed to mark received: ' + (err.response?.data?.error || err.message));
                                }
                              }}
                            >
                              Equipment Received
                            </Button>
                          )}
                          {/* Request Return — only when Rental Active */}
                          {bk.status === 'Rental Active' && (
                            <Button
                              variant="secondary"
                              size="xs"
                              onClick={() => handleRequestReturn(bk.id)}
                            >
                              Request Return
                            </Button>
                          )}
                          {/* Cancel — only Pending Approval, Approved, or Deposit Paid */}
                          {['Pending Approval', 'Approved', 'Deposit Paid'].includes(bk.status) && (
                            <Button
                              variant="secondary"
                              size="xs"
                              onClick={() => {
                                setBookingToCancel(bk.id);
                                setIsCancelModalOpen(true);
                              }}
                              className="text-[#EF4444] hover:bg-red-50"
                            >
                              Cancel
                            </Button>
                          )}
                          {/* Download Invoice — only Completed or Deposit Paid */}
                          {['Completed', 'Deposit Paid', 'Rental Active'].includes(bk.status) && (
                            <Button
                              variant="outline"
                              size="xs"
                              icon={FiDownload}
                              onClick={() => handleDownloadInvoice(bk.id)}
                            >
                              Invoice
                            </Button>
                          )}
                          <Button
                            variant="primary"
                            size="xs"
                            icon={FiEye}
                            onClick={() => navigate(`/customer/bookings/${bk.id}`)}
                          >
                            Details
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={FiCalendar}
            title="No Bookings Found"
            description={
              searchQuery
                ? `No bookings matched "${searchQuery}".`
                : "You don't have any bookings matching this criteria."
            }
            actionText="Browse Available Equipment"
            onAction={() => navigate('/customer/dashboard')}
          />
        )}
      </div>

      {/* Cancel Confirm Modal */}
      <ConfirmModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Booking Request"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Yes, Cancel Booking"
        variant="danger"
      />

      {/* Razorpay Payment Modal */}
      <AnimatePresence>
        {paymentBooking && (
          <RazorpayPaymentModal
            booking={paymentBooking}
            onClose={() => setPaymentBooking(null)}
            onSuccess={handlePaymentSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Bookings;
