import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiClock, FiTruck, FiTrash2, FiCheck, FiArrowRight } from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const notificationTypeConfigs = {
  'Booking Confirmed': {
    icon: FiCheckCircle,
    color: 'bg-[#22C55E]/15 text-[#22C55E]',
  },
  'Booking Cancelled': {
    icon: FiXCircle,
    color: 'bg-[#EF4444]/15 text-[#EF4444]',
  },
  'Rental Reminder': {
    icon: FiClock,
    color: 'bg-[#F59E0B]/15 text-[#F59E0B]',
  },
  'Equipment Available': {
    icon: FiTruck,
    color: 'bg-[#3B82F6]/15 text-[#3B82F6]',
  },
  'Payment Successful': {
    icon: FaRupeeSign,
    color: 'bg-[#CCCCFF]/60 text-[#0F172A]',
  },
};

const NotificationCard = ({ notification, onMarkRead, onDelete }) => {
  const navigate = useNavigate();
  const config = notificationTypeConfigs[notification.type] || {
    icon: FiCheckCircle,
    color: 'bg-[#CCCCFF]/40 text-[#0F172A]',
  };
  const Icon = config.icon;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`panel-card p-4 sm:p-5 flex items-start gap-4 transition-all ${
        !notification.read ? 'border-l-4 border-l-[#CCCCFF] bg-white' : 'opacity-85 bg-[#F8FAFC]/50'
      }`}
    >
      {/* Icon Badge */}
      <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0 ${config.color}`}>
        <Icon className="text-xl" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <h4 className={`text-sm ${!notification.read ? 'font-extrabold text-[#0F172A]' : 'font-semibold text-slate-700'}`}>
              {notification.title}
            </h4>
            {!notification.read && (
              <span className="w-2 h-2 rounded-full bg-[#EF4444] inline-block" />
            )}
          </div>
          <span className="text-xs text-[#94A3B8] font-medium shrink-0">{notification.time}</span>
        </div>

        <p className="text-xs text-[#64748B] leading-relaxed mb-3">{notification.message}</p>

        {/* Actions bar */}
        <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0]">
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F1F5F9] text-[#475569]">
            {notification.type}
          </span>

          <div className="flex items-center gap-3">
            {notification.link && (
              <button
                onClick={() => navigate(notification.link)}
                className="text-xs font-semibold text-[#3B82F6] hover:underline flex items-center gap-1 cursor-pointer"
              >
                View <FiArrowRight className="text-xs" />
              </button>
            )}
            {!notification.read && (
              <button
                onClick={() => onMarkRead(notification.id)}
                className="text-xs font-medium text-[#64748B] hover:text-[#0F172A] flex items-center gap-1 cursor-pointer"
              >
                <FiCheck className="text-xs text-[#22C55E]" /> Mark read
              </button>
            )}
            <button
              onClick={() => onDelete(notification.id)}
              className="text-xs font-medium text-[#64748B] hover:text-[#EF4444] p-1 rounded-md transition-colors cursor-pointer"
              title="Delete notification"
            >
              <FiTrash2 className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationCard;
