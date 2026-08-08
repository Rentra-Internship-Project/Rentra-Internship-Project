import React from 'react';
import { FiInbox } from 'react-icons/fi';
import Button from './Button';

const EmptyState = ({
  title = 'No Records Found',
  description = 'There are no items matching your filter or search query at the moment.',
  icon: Icon = FiInbox,
  actionText,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-[#E2E8F0] rounded-[20px] shadow-xs my-4">
      <div className="w-16 h-16 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] mb-4 shadow-inner">
        <Icon className="text-2xl" />
      </div>
      <h3 className="text-base font-semibold text-[#0F172A]">{title}</h3>
      <p className="mt-1 text-sm text-[#64748B] max-w-sm">{description}</p>
      {actionText && onAction && (
        <div className="mt-5">
          <Button variant="secondary" size="sm" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
