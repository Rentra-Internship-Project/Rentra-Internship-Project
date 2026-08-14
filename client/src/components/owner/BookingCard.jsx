import React from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiUser, FiCheck, FiX, FiClock } from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';

const statusConfig = {
  Pending: { bg: 'bg-amber-50', text: 'text-[#F59E0B]', border: 'border-amber-100', icon: FiClock },
  Active: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', icon: FiCheck },
  Completed: { bg: 'bg-green-50', text: 'text-[#22C55E]', border: 'border-green-100', icon: FiCheck },
  Rejected: { bg: 'bg-red-50', text: 'text-[#EF4444]', border: 'border-red-100', icon: FiX },
};

const BookingCard = ({ booking, onAccept, onReject }) => {
  const { id, customerName, customerAvatar, equipmentName, startDate, endDate, rentalPeriod, status } = booking;
  const cfg = statusConfig[status] || statusConfig.Pending;
  const StatusIcon = cfg.icon;
  const totalAmount = booking.amount ?? booking.totalValue ?? booking.totalAmount ?? booking.rentalCost ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="bg-white border border-[#E2E8F0] rounded-[16px] p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-4"
    >
      {/* Customer Avatar */}
      <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-[#E2E8F0] shrink-0">
        {customerAvatar ? (
          <img src={customerAvatar} alt={customerName || 'Customer'} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-[#CCCCFF] flex items-center justify-center">
            <FiUser className="text-[#0F172A]" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-xs font-bold text-[#0F172A]">{customerName || 'Anonymous User'}</p>
          <span className="text-[10px] text-[#94A3B8]">·</span>
          <span className="text-[10px] font-mono text-[#64748B]">{id}</span>
        </div>
        <p className="text-xs text-[#64748B] mt-0.5 line-clamp-1">{equipmentName || 'Unknown Equipment'}</p>
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          <span className="flex items-center gap-1 text-[11px] text-[#64748B]">
            <FiCalendar className="text-[10px]" /> {startDate} → {endDate}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-[#64748B]">
            <FiClock className="text-[10px]" /> {rentalPeriod || '1 day'}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-bold text-[#0F172A]">
            <FaRupeeSign className="text-[10px] text-[#22C55E]" /> ₹{Number(totalAmount).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Status + Actions */}
      <div className="flex items-center gap-2 shrink-0 ml-auto">
        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
          <StatusIcon className="text-[10px]" /> {status}
        </span>
        {status.includes('Pending') && (
          <>
            <button
              onClick={() => onAccept && onAccept(id)}
              className="p-2 rounded-[10px] bg-green-50 hover:bg-green-100 text-[#22C55E] transition-colors"
              title="Accept"
            >
              <FiCheck className="text-sm" />
            </button>
            <button
              onClick={() => onReject && onReject(id)}
              className="p-2 rounded-[10px] bg-red-50 hover:bg-red-100 text-[#EF4444] transition-colors"
              title="Reject"
            >
              <FiX className="text-sm" />
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default BookingCard;
