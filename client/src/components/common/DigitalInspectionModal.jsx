import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiShield, FiX, FiCheckSquare, FiSquare } from 'react-icons/fi';
import SignaturePad from './SignaturePad';

const DigitalInspectionModal = ({ isOpen, onClose, onConfirm, bookingId }) => {
  const [checklist, setChecklist] = useState({
    engineFluid: true,
    tracksTires: true,
    cabinControls: true,
    noHydraulicLeaks: true,
  });
  const [signatureData, setSignatureData] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const toggleCheck = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSignatureSave = (dataUrl) => {
    setSignatureData(dataUrl);
  };

  const handleFinalSubmit = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      onConfirm({ bookingId, signatureData, checklist });
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-[#0F172A]/70 backdrop-blur-xs flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-[24px] max-w-lg w-full p-6 shadow-2xl space-y-5 border border-[#E2E8F0] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-[12px]">
                <FiShield className="text-xl" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#0F172A]">Digital Inspection & E-Signature</h3>
                <p className="text-xs text-[#64748B]">Verify machinery condition & sign return contract</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-[10px] transition-colors"
            >
              <FiX className="text-lg" />
            </button>
          </div>

          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-12 text-center space-y-3"
            >
              <FiCheckCircle className="text-5xl text-[#22C55E] mx-auto animate-bounce" />
              <h4 className="text-lg font-bold text-[#0F172A]">Digital Inspection Verified!</h4>
              <p className="text-xs text-[#64748B]">E-signature timestamped and attached to booking records.</p>
            </motion.div>
          ) : (
            <div className="space-y-5">
              {/* Inspection Checklist */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0F172A] block uppercase tracking-wider text-[#94A3B8]">
                  Asset Condition Checklist
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { key: 'engineFluid', label: 'Engine & Oil Levels OK' },
                    { key: 'tracksTires', label: 'Tracks / Tires Inspected' },
                    { key: 'cabinControls', label: 'Cabin & Safety Controls Working' },
                    { key: 'noHydraulicLeaks', label: 'Zero Hydraulic Pressure Leaks' },
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => toggleCheck(item.key)}
                      className={`p-2.5 rounded-[12px] border transition-all text-left flex items-center gap-2 cursor-pointer font-semibold ${
                        checklist[item.key]
                          ? 'bg-emerald-50 text-[#0F172A] border-emerald-300'
                          : 'bg-slate-50 text-[#64748B] border-[#E2E8F0]'
                      }`}
                    >
                      {checklist[item.key] ? (
                        <FiCheckSquare className="text-emerald-600 text-base shrink-0" />
                      ) : (
                        <FiSquare className="text-[#94A3B8] text-base shrink-0" />
                      )}
                      <span className="truncate">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Signature Pad */}
              <SignaturePad onSave={handleSignatureSave} />

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-[12px] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={!signatureData}
                  className="px-5 py-2 text-xs font-bold bg-[#CCCCFF] hover:bg-[#B8B8FF] disabled:opacity-40 text-[#0F172A] rounded-[12px] transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <FiCheckCircle className="text-sm" /> Complete Digital Inspection
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DigitalInspectionModal;
