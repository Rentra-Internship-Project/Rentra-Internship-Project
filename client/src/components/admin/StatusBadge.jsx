import React from 'react';

const StatusBadge = ({ status }) => {
  // Convert status to Title Case or upper case for matching
  const normalizedStatus = status ? status.toLowerCase() : '';

  const getStyle = (s) => {
    if (s === 'active') return 'bg-emerald-50 text-[#22C55E] border-emerald-200';
    if (s === 'approved') return 'bg-emerald-50 text-[#22C55E] border-emerald-200';
    if (s === 'pending' || s === 'pending owner approval') return 'bg-amber-50 text-[#F59E0B] border-amber-200';
    if (s === 'blocked') return 'bg-rose-50 text-[#EF4444] border-rose-200';
    if (s === 'rejected') return 'bg-rose-50 text-[#EF4444] border-rose-200';
    if (s === 'completed') return 'bg-blue-50 text-[#3B82F6] border-blue-200';
    if (s === 'cancelled') return 'bg-slate-100 text-[#64748B] border-slate-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const currentStyle = getStyle(normalizedStatus);

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
