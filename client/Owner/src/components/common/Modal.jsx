import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const Modal = ({ isOpen = false, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className={`relative bg-white border border-[#E2E8F0] rounded-[20px] shadow-2xl p-6 w-full ${maxWidth} z-10 overflow-hidden max-h-[85vh] overflow-y-auto`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-4">
            <h3 className="text-lg font-bold text-[#0F172A]">{title}</h3>
            <button
              onClick={onClose}
              className="text-[#64748B] hover:text-[#0F172A] p-1.5 rounded-full hover:bg-[#F8FAFC] transition-colors"
            >
              <FiX className="text-lg" />
            </button>
          </div>

          {/* Content */}
          {children}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Modal;
