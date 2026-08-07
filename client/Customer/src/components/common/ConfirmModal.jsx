import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { FiAlertTriangle } from 'react-icons/fi';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to perform this action? This step cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center p-2">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
            variant === 'danger' ? 'bg-red-100 text-[#EF4444]' : 'bg-amber-100 text-[#F59E0B]'
          }`}
        >
          <FiAlertTriangle className="text-2xl" />
        </div>
        <p className="text-sm text-[#64748B] mb-6">{message}</p>

        <div className="flex items-center justify-end gap-3 w-full border-t border-[#E2E8F0] pt-4">
          <Button variant="secondary" size="md" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant={variant} size="md" onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
