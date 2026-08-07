import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiClock, FiXCircle, FiFileText } from 'react-icons/fi';

const statusConfig = {
  Approved: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-[#22C55E]',
    icon: FiCheckCircle,
    label: 'Business Verified & Active',
    description: 'Your business has been verified and is live on the Rentra marketplace.'
  },
  Pending: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-[#F59E0B]',
    icon: FiClock,
    label: 'Verification In Progress',
    description: 'Your application is under review. This typically takes 1–3 business days.'
  },
  Rejected: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-[#EF4444]',
    icon: FiXCircle,
    label: 'Verification Rejected',
    description: 'Your application was not approved. Please review the remarks below and reapply.'
  }
};

const StatusCard = ({ status, applicationDate, reviewDate, remarks }) => {
  const cfg = statusConfig[status] || statusConfig.Pending;
  const StatusIcon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`bg-white border ${cfg.border} rounded-[20px] p-6 shadow-xs`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-4 rounded-[16px] ${cfg.bg} ${cfg.text} shrink-0`}>
          <StatusIcon className="text-3xl" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-lg font-bold text-[#0F172A]">{cfg.label}</h3>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
              {status}
            </span>
          </div>
          <p className="text-sm text-[#64748B] mt-1">{cfg.description}</p>

          {/* Dates */}
          <div className="flex items-center gap-6 mt-4 flex-wrap">
            {applicationDate && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Applied On</p>
                <p className="text-xs font-semibold text-[#0F172A] mt-0.5">{applicationDate}</p>
              </div>
            )}
            {reviewDate && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Reviewed On</p>
                <p className="text-xs font-semibold text-[#0F172A] mt-0.5">{reviewDate}</p>
              </div>
            )}
          </div>

          {/* Remarks */}
          {remarks && (
            <div className="mt-4 p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] flex items-start gap-2">
              <FiFileText className="text-[#64748B] shrink-0 mt-0.5 text-sm" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-1">Admin Remarks</p>
                <p className="text-xs text-[#0F172A] leading-relaxed">{remarks}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StatusCard;
