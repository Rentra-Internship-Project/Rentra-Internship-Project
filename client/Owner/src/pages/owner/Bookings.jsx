import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiDollarSign, FiUser, FiClock, FiCheck, FiX, FiEye } from 'react-icons/fi';
import SearchBar from '../../components/common/SearchBar';
import EmptyState from '../../components/common/EmptyState';
import ConfirmModal from '../../components/common/ConfirmModal';
import { ownerBookings as initialBookings } from '../../data/ownerMockData';

const statusColors = {
  Pending: 'bg-amber-50 text-[#F59E0B] border-amber-100',
  Active: 'bg-blue-50 text-blue-600 border-blue-100',
  Completed: 'bg-green-50 text-[#22C55E] border-green-100',
  Rejected: 'bg-red-50 text-[#EF4444] border-red-100',
};

const Bookings = () => {
  const [bookings, setBookings] = useState(initialBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const filteredBookings = useMemo(() => {
    return bookings.filter((bk) => {
      const matchesSearch =
        bk.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bk.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bk.equipmentName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        statusFilter === 'all' || bk.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [bookings, searchTerm, statusFilter]);

  const handleAccept = (id) => {
    setBookings((prev) =>
      prev.map((bk) => (bk.id === id ? { ...bk, status: 'Active' } : bk))
    );
    setConfirmAction(null);
  };

  const handleReject = (id) => {
    setBookings((prev) =>
      prev.map((bk) => (bk.id === id ? { ...bk, status: 'Rejected' } : bk))
    );
    setConfirmAction(null);
  };

  const pendingCount = bookings.filter((bk) => bk.status === 'Pending').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Booking Requests</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Manage customer booking requests ({bookings.length} total • {pendingCount} pending)
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search by booking ID, customer, or equipment..."
        selectedFilter={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={[
          { value: 'pending', label: 'Pending' },
          { value: 'active', label: 'Active' },
          { value: 'completed', label: 'Completed' },
          { value: 'rejected', label: 'Rejected' },
        ]}
      />

      {/* Bookings Table */}
      {filteredBookings.length > 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-[20px] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="text-left px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Booking ID</th>
                  <th className="text-left px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Customer</th>
                  <th className="text-left px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Equipment</th>
                  <th className="text-left px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Period</th>
                  <th className="text-left px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Amount</th>
                  <th className="text-left px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Status</th>
                  <th className="text-right px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredBookings.map((bk) => (
                  <motion.tr
                    key={bk.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-[#F8FAFC]/50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <span className="text-xs font-mono font-bold text-[#0F172A]">{bk.id}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-[#E2E8F0] shrink-0">
                          {bk.customerAvatar ? (
                            <img src={bk.customerAvatar} alt={bk.customerName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[#CCCCFF] flex items-center justify-center">
                              <FiUser className="text-[#0F172A] text-xs" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[#0F172A]">{bk.customerName}</p>
                          <p className="text-[10px] text-[#94A3B8]">{bk.customerEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs font-medium text-[#0F172A] line-clamp-1 max-w-[180px]">{bk.equipmentName}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-xs text-[#0F172A]">{bk.startDate} → {bk.endDate}</p>
                        <p className="text-[10px] text-[#64748B] flex items-center gap-1 mt-0.5">
                          <FiClock className="text-[9px]" /> {bk.rentalPeriod}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-bold text-[#0F172A]">${bk.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex text-[11px] font-bold px-2.5 py-1 rounded-full border ${statusColors[bk.status] || 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                        {bk.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedBooking(bk)}
                          className="p-1.5 rounded-[8px] hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] transition-colors"
                          title="View Details"
                        >
                          <FiEye className="text-sm" />
                        </button>
                        {bk.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => setConfirmAction({ type: 'accept', id: bk.id })}
                              className="p-1.5 rounded-[8px] bg-green-50 hover:bg-green-100 text-[#22C55E] transition-colors"
                              title="Accept"
                            >
                              <FiCheck className="text-sm" />
                            </button>
                            <button
                              onClick={() => setConfirmAction({ type: 'reject', id: bk.id })}
                              className="p-1.5 rounded-[8px] bg-red-50 hover:bg-red-100 text-[#EF4444] transition-colors"
                              title="Reject"
                            >
                              <FiX className="text-sm" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No Bookings Found"
          description="No bookings match your search or filter criteria."
        />
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedBooking(null)}
            className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white border border-[#E2E8F0] rounded-[20px] shadow-2xl p-6 w-full max-w-md z-10"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-4">
              <h3 className="text-base font-bold text-[#0F172A]">Booking Details</h3>
              <button onClick={() => setSelectedBooking(null)} className="text-[#64748B] hover:text-[#0F172A] transition-colors">✕</button>
            </div>
            <div className="space-y-3">
              {[
                ['Booking ID', selectedBooking.id],
                ['Customer', selectedBooking.customerName],
                ['Email', selectedBooking.customerEmail],
                ['Equipment', selectedBooking.equipmentName],
                ['Period', `${selectedBooking.startDate} → ${selectedBooking.endDate}`],
                ['Duration', selectedBooking.rentalPeriod],
                ['Amount', `$${selectedBooking.amount.toLocaleString()}`],
                ['Status', selectedBooking.status],
                ['Notes', selectedBooking.notes || 'No notes'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between">
                  <span className="text-xs font-semibold text-[#64748B]">{label}</span>
                  <span className="text-xs font-medium text-[#0F172A] text-right max-w-[200px]">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Accept Confirmation */}
      <ConfirmModal
        isOpen={confirmAction?.type === 'accept'}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => handleAccept(confirmAction?.id)}
        title="Accept Booking"
        message="Are you sure you want to accept this booking request? The customer will be notified immediately."
        confirmText="Accept Booking"
        type="warning"
      />

      {/* Reject Confirmation */}
      <ConfirmModal
        isOpen={confirmAction?.type === 'reject'}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => handleReject(confirmAction?.id)}
        title="Reject Booking"
        message="Are you sure you want to reject this booking? This action cannot be undone."
        confirmText="Reject"
        type="danger"
      />
    </motion.div>
  );
};

export default Bookings;
