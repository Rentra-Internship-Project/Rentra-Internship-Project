import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiDollarSign } from 'react-icons/fi';

const EarningsCard = ({ title, value, subtitle, icon: Icon, accentBg = 'bg-[#CCCCFF]/30', iconColor = 'text-[#0F172A]', trend }) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 shadow-xs relative overflow-hidden"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">{title}</p>
          <h3 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight">{value}</h3>
          {subtitle && <p className="text-[11px] text-[#64748B] mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-3.5 rounded-[16px] ${accentBg} ${iconColor} shrink-0`}>
            <Icon className="text-2xl" />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-2 pt-3 border-t border-[#E2E8F0]/60">
          <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-green-50 text-[#22C55E]">
            <FiTrendingUp className="text-[10px]" /> {trend}
          </span>
          <span className="text-[11px] text-[#64748B]">vs last month</span>
        </div>
      )}
    </motion.div>
  );
};

export default EarningsCard;
