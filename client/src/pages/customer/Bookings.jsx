import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiSearch,
  FiCalendar,
  FiUser,
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiEye,
  FiFilter,
} from 'react-icons/fi';
import { useCustomer } from '../../context/CustomerContext';
import SearchBar from '../../components/common/SearchBar';
import BookingCard from '../../components/customer/BookingCard';
import EmptyState from '../../components/common/EmptyState';
import ConfirmModal from '../../components/common/ConfirmModal';
import Button from '../../components/common/Button';

const statusBadgeStyles = {
  Active: 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30',
  Completed: 'bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6]/30',
  Pending: 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30',
  Cancelled: 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30',
};

const statusIcons = {
  Active: FiCheckCircle,
  Completed: FiCheckCircle,
  Pending: FiClock,
  Cancelled: FiXCircle,
};

const filterTabs = ['All', 'Active', 'Pending', 'Completed', 'Cancelled'];

const Bookings = () => {
  const navigate = useNavigate();
  const { bookings, cancelBooking } = useCustomer();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Cancel Booking modal state
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // Filter Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((bk) => {
      const matchesSearch =
        bk.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bk.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bk.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'All' || bk.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchQuery, selectedStatus]);

  const handleConfirmCancel = () => {
    if (bookingToCancel) {
      cancelBooking(bookingToCancel);
      setBookingToCancel(null);
      setIsCancelModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="panel-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">Rental Bookings History</h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Monitor reservation status, rental dates, owner contact details, and payment receipts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 bg-[#CCCCFF]/30 border border-[#CCCCFF] rounded-full text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
            <FiCalendar />
            <span>{bookings.length} Total Bookings</span>
          </span>
        </div>
      </div>

      {/* Filter & Search Bar Controls */}
      <div className="panel-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-80">
          <SearchBar
            searchTerm={searchQuery}
            onSearchChange={setSearchQuery}
            placeholder="Search booking ID, equipment..."
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {filterTabs.map((status) => {
            const count = status === 'All' ? bookings.length : bookings.filter((b) => b.status === status).length;
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
                <span className="px-1.5 py-0.2 bg-white/80 rounded-full text-[10px] text-[#0F172A]">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Card List View (visible below md screen) */}
      <div className="block md:hidden space-y-3">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((bk) => (
            <BookingCard
              key={bk.id}
              booking={bk}
              onCancel={(id) => {
                setBookingToCancel(id);
                setIsCancelModalOpen(true);
              }}
            />
          ))
        ) : (
          <EmptyState
            icon={FiCalendar}
            title="No Bookings Found"
            description={
              searchQuery
                ? `No bookings matched your search query "${searchQuery}".`
                : "You don't have any bookings under this status category."
            }
            actionText="Explore Equipment"
            onAction={() => navigate('/customer/dashboard')}
          />
        )}
      </div>

      {/* Desktop Horizontally Scrollable Data Table View */}
      <div className="hidden md:block panel-card overflow-hidden">
        {filteredBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                  <th className="py-4 px-6">Booking ID</th>
                  <th className="py-4 px-6">Equipment</th>
                  <th className="py-4 px-6">Owner</th>
                  <th className="py-4 px-6">Rental Date</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-sm">
                {filteredBookings.map((bk) => {
                  const StatusIcon = statusIcons[bk.status] || FiClock;
                  return (
                    <tr key={bk.id} className="hover:bg-[#F8FAFC]/80 transition-colors group">
                      <td className="py-4 px-6 font-mono font-bold text-xs text-[#0F172A]">
                        {bk.id}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={bk.image}
                            alt={bk.equipmentName}
                            className="w-10 h-10 rounded-[10px] object-cover shrink-0 border border-[#E2E8F0]"
                          />
                          <div>
                            <p className="font-bold text-[#0F172A] line-clamp-1 group-hover:text-[#3B82F6] transition-colors">
                              {bk.equipmentName}
                            </p>
                            <span className="text-[11px] text-[#64748B]">{bk.category}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-xs text-[#0F172A] flex items-center gap-1">
                          <FiUser className="text-[#3B82F6] text-xs" />
                          {bk.ownerName}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-xs text-[#0F172A]">
                          <p className="font-semibold">{bk.startDate} to {bk.endDate}</p>
                          <p className="text-[11px] text-[#64748B]">{bk.durationDays} days duration</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-extrabold text-[#0F172A]">
                          ${((bk.totalValue ?? bk.totalAmount ?? 0)).toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`status-badge text-[11px] font-semibold flex items-center gap-1 ${
                            statusBadgeStyles[bk.status] || 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <StatusIcon className="text-xs" />
                          {bk.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {bk.status === 'Pending' && (
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
                          <Button
                            variant="primary"
                            size="xs"
                            onClick={() => navigate(`/customer/bookings/${bk.id}`)}
                            icon={FiEye}
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
                ? `No bookings matched your search query "${searchQuery}".`
                : "You don't have any bookings matching this criteria."
            }
            actionText="Browse Available Equipment"
            onAction={() => navigate('/customer/dashboard')}
          />
        )}
      </div>

      {/* Cancel Modal Confirmation */}
      <ConfirmModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Booking Request"
        message="Are you sure you want to cancel this booking? Authorized escrow funds will be fully refunded to your payment method."
        confirmText="Confirm Cancellation"
        variant="danger"
      />
    </div>
  );
};

export default Bookings;
