import React from 'react';

const StatusBadge = ({ status }) => {
  const statusStyles = {
    Active: 'bg-emerald-50 text-[#22C55E] border-emerald-200',
    Approved: 'bg-emerald-50 text-[#22C55E] border-emerald-200',
    Pending: 'bg-amber-50 text-[#F59E0B] border-amber-200',
    Blocked: 'bg-rose-50 text-[#EF4444] border-rose-200',
    Rejected: 'bg-rose-50 text-[#EF4444] border-rose-200',
    Completed: 'bg-blue-50 text-[#3B82F6] border-blue-200',
    Cancelled: 'bg-slate-100 text-[#64748B] border-slate-200'
  };

  const currentStyle = statusStyles[status] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${currentStyle}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      <span>{status}</span>
    </span>
  );
};

export default StatusBadge;
