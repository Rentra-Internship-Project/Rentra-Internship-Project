import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiDollarSign, FiUser, FiArrowRight, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import Button from '../common/Button';

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

const BookingCard = ({ booking, onCancel }) => {
  const navigate = useNavigate();
  const StatusIcon = statusIcons[booking.status] || FiClock;
  const totalAmount = booking.totalValue ?? booking.totalAmount ?? 0;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="panel-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
    >
      {/* Left side Equipment & ID */}
      <div className="flex items-center gap-4 min-w-0">
        <img
          src={booking.image}
          alt={booking.equipmentName}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-[18px] object-cover shrink-0 border border-[#E2E8F0]"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#F1F5F9] text-[#0F172A] rounded-md">
              {booking.id}
            </span>
            <span
              className={`status-badge text-[10px] font-semibold flex items-center gap-1 ${
                statusBadgeStyles[booking.status] || 'bg-slate-100 text-slate-700'
              }`}
            >
              <StatusIcon className="text-xs" />
              {booking.status}
            </span>
          </div>

          <h4 className="font-bold text-sm sm:text-base text-[#0F172A] line-clamp-1 group-hover:text-[#3B82F6] transition-colors">
            {booking.equipmentName}
          </h4>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#64748B] mt-1.5">
            <span className="flex items-center gap-1">
              <FiUser className="text-[#3B82F6]" />
              {booking.ownerName}
            </span>
            <span className="flex items-center gap-1">
              <FiCalendar className="text-[#64748B]" />
              {booking.startDate} - {booking.endDate} ({booking.durationDays} days)
            </span>
          </div>
        </div>
      </div>

      {/* Right side Amount & Action Buttons */}
      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E2E8F0]">
        <div className="text-left sm:text-right">
          <p className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">Total Paid</p>
          <p className="text-base font-extrabold text-[#0F172A]">${totalAmount.toLocaleString()}</p>
        </div>

        <div className="flex items-center gap-2">
          {booking.status === 'Pending' && onCancel && (
            <Button
              variant="secondary"
              size="xs"
              onClick={() => onCancel(booking.id)}
              className="text-[#EF4444] hover:bg-red-50"
            >
              Cancel
            </Button>
          )}
          <Button
            variant="primary"
            size="xs"
            onClick={() => navigate(`/customer/bookings/${booking.id}`)}
            icon={FiArrowRight}
          >
            View Details
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingCard;
