import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheckCircle, FiTruck, FiTag, FiArrowRight } from 'react-icons/fi';

const FleetBundlerModal = ({ isOpen, onClose, onSelectBundle }) => {
  const [selectedPackage, setSelectedPackage] = useState(null);

  if (!isOpen) return null;

  const bundles = [
    {
      id: 'pkg-foundation',
      name: 'Building Foundation Package',
      icon: '🏗️',
      discountPercent: 10,
      items: ['Caterpillar 320 Heavy Excavator (20T)', 'Volvo A40G Dump Truck (10-Yard)', 'HAMM Soil Compactor'],
      originalDailyRate: 1200,
      discountedDailyRate: 1080,
      description: 'Complete heavy machinery package for site digging, foundation trenching, and soil removal.'
    },
    {
      id: 'pkg-paving',
      name: 'Road Construction & Paving Package',
      icon: '🛣️',
      discountPercent: 12,
      items: ['Vögele Super 1800 Asphalt Paver', 'HAMM HD+ 90i Tandem Roller'],
      originalDailyRate: 1400,
      discountedDailyRate: 1232,
      description: 'Complete road paving machinery setup with high compaction capacity for highway repairs.'
    }
  ];

  const handleApplyBundle = (bundle) => {
    setSelectedPackage(bundle.id);
    setTimeout(() => {
      onSelectBundle(bundle);
      onClose();
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-[#0F172A]/70 backdrop-blur-xs flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-[24px] max-w-2xl w-full p-6 shadow-2xl space-y-6 border border-[#E2E8F0] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-[14px]">
                <FiTruck className="text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[#0F172A]">🏗️ Project Fleet Package Bundles</h3>
                <p className="text-xs text-[#64748B]">Rent complementary machinery together and save up to 12%</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-[10px] transition-colors"
            >
              <FiX className="text-xl" />
            </button>
          </div>

          {/* Bundle Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bundles.map((bundle) => (
              <div
                key={bundle.id}
                className={`border rounded-[20px] p-5 flex flex-col justify-between space-y-4 transition-all ${
                  selectedPackage === bundle.id
                    ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-300'
                    : 'border-[#E2E8F0] bg-[#F8FAFC]/60 hover:border-[#CCCCFF] hover:bg-white'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{bundle.icon}</span>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full flex items-center gap-1">
                      <FiTag /> {bundle.discountPercent}% BUNDLE DISCOUNT
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-[#0F172A] text-sm">{bundle.name}</h4>
                    <p className="text-xs text-[#64748B] mt-1 leading-relaxed">{bundle.description}</p>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8]">Included Fleet Units:</p>
                    {bundle.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-[#0F172A] font-medium">
                        <FiCheckCircle className="text-[#22C55E] text-xs shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#E2E8F0] pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs line-through text-[#94A3B8] block">
                      ₹{bundle.originalDailyRate.toLocaleString()} / day
                    </span>
                    <span className="text-base font-extrabold text-[#0F172A]">
                      ₹{bundle.discountedDailyRate.toLocaleString()} <span className="text-xs text-[#64748B] font-normal">/ day</span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApplyBundle(bundle)}
                    className="px-4 py-2 bg-[#CCCCFF] hover:bg-[#B8B8FF] text-[#0F172A] rounded-[12px] text-xs font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <span>Book Fleet</span> <FiArrowRight className="text-xs" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FleetBundlerModal;
