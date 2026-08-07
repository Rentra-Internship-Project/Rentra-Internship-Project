import React from 'react';
import { motion } from 'framer-motion';
import { FiBriefcase, FiMail, FiPhone, FiMapPin, FiHash } from 'react-icons/fi';

const BusinessCard = ({ business }) => {
  const { businessName, businessType, ownerName, email, phone, address, city, state, gstNumber, registrationNumber } = business;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 shadow-xs"
    >
      {/* Header */}
      <div className="flex items-start gap-4 pb-5 border-b border-[#E2E8F0] mb-5">
        <div className="w-14 h-14 rounded-[16px] bg-[#CCCCFF]/40 flex items-center justify-center shrink-0">
          <FiBriefcase className="text-2xl text-[#0F172A]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#0F172A]">{businessName}</h3>
          <p className="text-xs font-semibold text-[#64748B] mt-0.5">{businessType}</p>
          <p className="text-xs text-[#64748B]">Owner: <span className="font-semibold text-[#0F172A]">{ownerName}</span></p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-center gap-2.5 p-3 bg-[#F8FAFC] rounded-[12px]">
          <FiMail className="text-[#64748B] text-sm shrink-0" />
          <div>
            <p className="text-[10px] text-[#94A3B8] font-semibold uppercase">Email</p>
            <p className="text-xs font-semibold text-[#0F172A] truncate">{email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 p-3 bg-[#F8FAFC] rounded-[12px]">
          <FiPhone className="text-[#64748B] text-sm shrink-0" />
          <div>
            <p className="text-[10px] text-[#94A3B8] font-semibold uppercase">Phone</p>
            <p className="text-xs font-semibold text-[#0F172A]">{phone}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 p-3 bg-[#F8FAFC] rounded-[12px]">
          <FiMapPin className="text-[#64748B] text-sm shrink-0" />
          <div>
            <p className="text-[10px] text-[#94A3B8] font-semibold uppercase">Location</p>
            <p className="text-xs font-semibold text-[#0F172A]">{city}, {state}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 p-3 bg-[#F8FAFC] rounded-[12px]">
          <FiHash className="text-[#64748B] text-sm shrink-0" />
          <div>
            <p className="text-[10px] text-[#94A3B8] font-semibold uppercase">GST Number</p>
            <p className="text-xs font-semibold text-[#0F172A]">{gstNumber}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BusinessCard;
