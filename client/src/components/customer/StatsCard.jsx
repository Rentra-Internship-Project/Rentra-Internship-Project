import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, change, trend = 'up', onClick, accentBg = 'bg-[#CCCCFF]/40' }) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`panel-card p-5 flex items-center justify-between transition-all ${
        onClick ? 'cursor-pointer hover:border-[#CCCCFF]' : ''
      }`}
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">{title}</p>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">{value}</h3>
        {change && (
          <p
            className={`text-xs font-semibold mt-1 flex items-center gap-1 ${
              trend === 'up' ? 'text-[#22C55E]' : 'text-[#EF4444]'
            }`}
          >
            <span>{trend === 'up' ? '↑' : '↓'}</span>
            <span>{change}</span>
          </p>
        )}
      </div>

      <div className={`w-12 h-12 rounded-[16px] ${accentBg} flex items-center justify-center text-[#0F172A] shrink-0 shadow-xs`}>
        {Icon && <Icon className="text-2xl" />}
      </div>
    </motion.div>
  );
};

export default StatsCard;
