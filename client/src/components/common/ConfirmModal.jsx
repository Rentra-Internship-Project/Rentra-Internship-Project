import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiX } from 'react-icons/fi';
import Button from './Button';

const ConfirmModal = ({
  isOpen = false,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this administrative action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger'
}) => {
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
          className="relative bg-white border border-[#E2E8F0] rounded-[20px] shadow-2xl p-6 w-full max-w-md z-10 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#64748B] hover:text-[#0F172A] p-1.5 rounded-full hover:bg-[#F8FAFC] transition-colors"
          >
            <FiX className="text-lg" />
          </button>

          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full shrink-0 ${type === 'danger' ? 'bg-red-50 text-[#EF4444]' : 'bg-amber-50 text-[#F59E0B]'}`}>
              <FiAlertTriangle className="text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0F172A]">{title}</h3>
              <p className="mt-1 text-sm text-[#64748B] leading-relaxed">{message}</p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
            <Button variant="secondary" onClick={onClose}>
              {cancelText}
            </Button>
            <Button
              variant={type === 'danger' ? 'danger' : 'primary'}
              onClick={() => {
                onConfirm && onConfirm();
                onClose();
              }}
            >
              {confirmText}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmModal;
