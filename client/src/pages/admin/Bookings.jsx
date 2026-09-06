import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEye, FiCalendar, FiUser, FiTruck, FiBriefcase, FiX, FiPrinter } from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import SearchBar from '../../components/common/SearchBar';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { useAdminContext } from '../../context/AdminContext';

const Bookings = () => {
  const { bookings } = useAdminContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Search & Filter Logic
  const filteredBookings = (bookings || []).filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.equipment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.owner?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const columns = [
    'Booking ID',
    'Customer',
    'Equipment Rented',
    'Business Owner',
    'Booking Period',
    'Total Amount',
    'Status',
    'Actions'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Booking Management</h1>
          <p className="text-xs md:text-sm text-[#64748B] mt-0.5">
            Monitor real-time rental transactions, active machinery leases, and booking lifecycle statuses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 bg-[#CCCCFF]/40 text-[#0F172A] border border-[#CCCCFF] rounded-[12px]">
            Total Bookings: {bookings.length}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-5 shadow-xs">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedFilter={statusFilter}
          onFilterChange={setStatusFilter}
          filterOptions={[
            { label: 'Active Rentals', value: 'rental active' },
            { label: 'Pending Approval', value: 'pending approval' },
            { label: 'Completed Leases', value: 'completed' },
            { label: 'Cancelled Bookings', value: 'cancelled' }
          ]}
          placeholder="Search by booking ID, customer name, or equipment..."
        />
      </div>

      {/* Bookings Table */}
      {filteredBookings.length > 0 ? (
        <DataTable columns={columns}>
          {filteredBookings.map((b) => (
            <tr key={b.id} className="hover:bg-[#F8FAFC] transition-colors">
              {/* Booking ID */}
              <td className="px-5 py-4 first:pl-6 whitespace-nowrap font-bold text-[#0F172A] text-xs font-mono">
                {b.id}
              </td>

              {/* Customer */}
              <td className="px-5 py-4 whitespace-nowrap text-xs font-semibold text-[#0F172A]">{b.customer}</td>

              {/* Equipment */}
              <td className="px-5 py-4 whitespace-nowrap text-xs text-[#64748B] font-medium">{b.equipment}</td>

              {/* Owner */}
              <td className="px-5 py-4 whitespace-nowrap text-xs text-[#64748B]">{b.owner}</td>

              {/* Booking Date */}
              <td className="px-5 py-4 whitespace-nowrap text-xs text-[#64748B]">
                {b.bookingDate} <span className="text-[10px] text-[#94A3B8]">({b.duration})</span>
              </td>

              {/* Amount */}
              <td className="px-5 py-4 whitespace-nowrap text-xs font-extrabold text-[#0F172A]">{b.amount}</td>

              {/* Status */}
              <td className="px-5 py-4 whitespace-nowrap">
                <StatusBadge status={b.status} />
              </td>

              {/* Actions */}
              <td className="px-5 py-4 last:pr-6 whitespace-nowrap">
                <Button
                  variant="outline"
                  size="sm"
                  icon={FiEye}
                  onClick={() => setSelectedBooking(b)}
                >
                  View Details
                </Button>
              </td>
            </tr>
          ))}
        </DataTable>
      ) : (
        <EmptyState
          title="No Rental Bookings Found"
          description="There are no marketplace rental transactions matching your search filters."
          onAction={() => {
            setSearchTerm('');
            setStatusFilter('all');
          }}
          actionText="Reset Filters"
        />
      )}

      {/* Booking Details Invoice Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBooking(null)}
              className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white border border-[#E2E8F0] rounded-[20px] shadow-2xl p-4 md:p-6 w-full max-w-lg z-10"
            >
              <button
                onClick={() => setSelectedBooking(null)}
                className="absolute top-4 right-4 text-[#64748B] hover:text-[#0F172A] p-1.5 rounded-full hover:bg-[#F8FAFC]"
              >
                <FiX className="text-lg" />
              </button>

              <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748B]">Rental Invoice</span>
                  <h3 className="text-xl font-extrabold text-[#0F172A] font-mono">{selectedBooking.id}</h3>
                </div>
                <StatusBadge status={selectedBooking.status} />
              </div>

              <div className="py-4 space-y-3 text-xs">
                <div className="p-3 bg-[#F8FAFC] rounded-[12px] flex items-center justify-between">
                  <span className="text-[#64748B] flex items-center gap-2">
                    <FiUser /> Customer Name
                  </span>
                  <span className="font-bold text-[#0F172A]">{selectedBooking.customer}</span>
                </div>

                <div className="p-3 bg-[#F8FAFC] rounded-[12px] flex items-center justify-between">
                  <span className="text-[#64748B] flex items-center gap-2">
                    <FiTruck /> Machinery Asset
                  </span>
                  <span className="font-bold text-[#0F172A]">{selectedBooking.equipment}</span>
                </div>

                <div className="p-3 bg-[#F8FAFC] rounded-[12px] flex items-center justify-between">
                  <span className="text-[#64748B] flex items-center gap-2">
                    <FiBriefcase /> Equipment Owner
                  </span>
                  <span className="font-bold text-[#0F172A]">{selectedBooking.owner}</span>
                </div>

                <div className="p-3 bg-[#F8FAFC] rounded-[12px] flex items-center justify-between">
                  <span className="text-[#64748B] flex items-center gap-2">
                    <FiCalendar /> Rental Duration
                  </span>
                  <span className="font-semibold text-[#0F172A]">{selectedBooking.bookingDate} ({selectedBooking.duration})</span>
                </div>

                <div className="p-4 bg-[#CCCCFF]/20 border border-[#CCCCFF] rounded-[12px] flex items-center justify-between mt-2">
                  <span className="font-bold text-[#0F172A] text-sm">Total Rental Fee</span>
                  <span className="text-lg font-extrabold text-[#0F172A]">{selectedBooking.amount}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E2E8F0] flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  icon={FiPrinter}
                  onClick={() => alert("Simulating invoice print preview.")}
                >
                  Print Summary
                </Button>
                <Button variant="secondary" onClick={() => setSelectedBooking(null)}>
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
export default Bookings;
