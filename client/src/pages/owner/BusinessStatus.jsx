import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiFileText, FiShield } from 'react-icons/fi';
import StatusCard from '../../components/owner/StatusCard';
import BusinessCard from '../../components/owner/BusinessCard';
import { useOwner } from '../../context/OwnerContext';

const BusinessStatus = () => {
  const { businessStatus } = useOwner();

  if (!businessStatus) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A]">Verification Status</h1>
        <p className="text-sm text-[#64748B] mt-1">Track the progress of your business verification application.</p>
      </div>

      {/* Status Card */}
      <StatusCard
        status={businessStatus.status}
        applicationDate={businessStatus.applicationDate}
        reviewDate={businessStatus.reviewDate}
        remarks={businessStatus.remarks}
      />

      {/* Business Details Card */}
      <BusinessCard business={businessStatus} />

      {/* Verification Timeline */}
      <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-[#E2E8F0] mb-5">
          <div className="p-2.5 bg-blue-50 text-[#3B82F6] rounded-[12px]">
            <FiShield className="text-xl" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">Verification Progress</h3>
            <p className="text-xs text-[#64748B]">Detailed timeline of your application status</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative pl-8">
          {/* Vertical Line */}
          <div className="absolute left-3 top-2 bottom-2 w-px bg-[#E2E8F0]" />

          <div className="space-y-6">
            {businessStatus.timeline.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start gap-4"
              >
                {/* Dot */}
                <div className={`absolute -left-5 top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  step.done
                    ? 'bg-[#22C55E] border-[#22C55E]'
                    : 'bg-white border-[#E2E8F0]'
                }`}>
                  {step.done && <FiCheckCircle className="text-white text-[8px]" />}
                </div>

                {/* Content */}
                <div className={`flex-1 p-3.5 rounded-[12px] border transition-colors ${
                  step.done
                    ? 'bg-green-50/50 border-green-100'
                    : 'bg-[#F8FAFC] border-[#E2E8F0]'
                }`}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <p className={`text-xs font-bold ${step.done ? 'text-[#0F172A]' : 'text-[#64748B]'}`}>
                      {step.step}
                    </p>
                    {step.done && (
                      <span className="text-[10px] font-semibold text-[#22C55E] bg-green-50 px-2 py-0.5 rounded-full">
                        Completed
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-0.5">{step.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-[#E2E8F0] mb-5">
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-[12px]">
            <FiFileText className="text-xl" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">Submitted Documents</h3>
            <p className="text-xs text-[#64748B]">Documents uploaded during registration</p>
          </div>
        </div>

        <div className="space-y-2">
          {businessStatus.documents.map((doc, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] hover:border-[#CCCCFF] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white border border-[#E2E8F0] rounded-[8px]">
                  <FiFileText className="text-[#64748B] text-sm" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#0F172A]">{doc.name}</p>
                  <p className="text-[10px] text-[#94A3B8]">{doc.size}</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                doc.status === 'Verified'
                  ? 'bg-green-50 text-[#22C55E] border border-green-100'
                  : 'bg-amber-50 text-[#F59E0B] border border-amber-100'
              }`}>
                {doc.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default BusinessStatus;
