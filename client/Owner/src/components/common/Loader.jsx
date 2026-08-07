import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-10 h-10 border-4 border-[#E2E8F0] border-t-[#CCCCFF] rounded-full"
      />
      <p className="mt-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">{text}</p>
    </div>
  );
};

export default Loader;
