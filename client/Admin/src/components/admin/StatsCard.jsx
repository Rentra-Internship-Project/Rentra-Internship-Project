import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  accentBg = 'bg-[#CCCCFF]/30',
  iconColor = 'text-[#0F172A]'
}) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 shadow-xs relative overflow-hidden flex flex-col justify-between"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">{title}</p>
          <h3 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight">{value}</h3>
        </div>
        {Icon && (
          <div className={`p-3.5 rounded-[16px] ${accentBg} ${iconColor} shrink-0`}>
            <Icon className="text-2xl" />
          </div>
        )}
      </div>

      {change && (
        <div className="mt-4 flex items-center gap-2 pt-3 border-t border-[#E2E8F0]/60">
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              isPositive ? 'bg-green-50 text-[#22C55E]' : 'bg-red-50 text-[#EF4444]'
            }`}
          >
            {isPositive ? '↑' : '↓'} {change}
          </span>
          <span className="text-[11px] text-[#64748B]">vs previous month</span>
        </div>
      )}
    </motion.div>
  );
};

export default StatsCard;
