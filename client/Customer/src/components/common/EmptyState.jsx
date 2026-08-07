import React from 'react';
import { FiInbox } from 'react-icons/fi';
import Button from './Button';

const EmptyState = ({
  icon: Icon = FiInbox,
  title = 'No Items Found',
  description = 'There are no items matching your criteria at this moment.',
  actionText,
  onAction,
  actionIcon,
}) => {
  return (
    <div className="panel-card p-8 sm:p-12 text-center flex flex-col items-center justify-center my-6">
      <div className="w-16 h-16 rounded-full bg-[#CCCCFF]/20 flex items-center justify-center text-[#0F172A] mb-4 shadow-xs">
        <Icon className="text-2xl" />
      </div>
      <h3 className="text-lg font-bold text-[#0F172A] mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-[#64748B] max-w-md mb-6">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" size="md" onClick={onAction} icon={actionIcon}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
