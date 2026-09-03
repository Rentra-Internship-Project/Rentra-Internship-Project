import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { FiCopy, FiCheck, FiX, FiShare2, FiExternalLink, FiFileText } from 'react-icons/fi';

const QuoteShareModal = ({
  isOpen = false,
  onClose,
  equipment,
  quoteData = {},
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !equipment) return null;

  // Formatting values
  const name = equipment.name || 'Heavy Machinery';
  const category = equipment.category || 'Equipment';
  const location = equipment.location || 'Job Site';
  const baseRate = quoteData.baseDailyRate || equipment.pricePerDay || 0;
  const duration = quoteData.durationDays || 1;
  const includeOperator = quoteData.includeOperator || false;
  const operatorRate = quoteData.operatorDailyRate || equipment.operatorDailyRate || 1500;
  const total = quoteData.totalValue || (baseRate * duration + (includeOperator ? operatorRate * duration : 0));
  const deposit = quoteData.deposit || Math.round(total * 0.20);
  
  // Construct direct link to equipment
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://rentra.vercel.app';
  const equipId = equipment.id || equipment._id;
  const equipmentUrl = `${origin}/customer/equipment/${equipId}`;

  // Formatted Quotation Message for WhatsApp
  const quoteMessage = `🏗️ *RENTRA — HEAVY MACHINERY RENTAL QUOTATION*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚜 *Machine:* ${name}
📂 *Category:* ${category}
📍 *Yard Location:* ${location}
⏱️ *Rental Period:* ${duration} Day${duration > 1 ? 's' : ''}${quoteData.startDate ? ` (${quoteData.startDate} to ${quoteData.endDate})` : ''}
👷 *Certified Operator:* ${includeOperator ? `Included (+₹${operatorRate.toLocaleString()}/day)` : 'Machine Only (Self-Operated)'}
${quoteData.siteAddress ? `🚚 *Job Site:* ${quoteData.siteAddress}\n` : ''}
💰 *PRICE BREAKDOWN:*
• Base Machinery (${duration}d): ₹${(baseRate * duration).toLocaleString()}
${includeOperator ? `• Operator Fee (${duration}d): ₹${(operatorRate * duration).toLocaleString()}\n` : ''}${quoteData.bundleDiscountAmount ? `• Package Discount: -₹${quoteData.bundleDiscountAmount.toLocaleString()} (${quoteData.bundleName || 'Fleet Deal'})\n` : ''}${quoteData.platformFee ? `• Platform Marketplace Fee: ₹${quoteData.platformFee.toLocaleString()}\n` : ''}${quoteData.gst ? `• GST Tax (18%): ₹${quoteData.gst.toLocaleString()}\n` : ''}━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏷️ *Total Rental Value:* ₹${total.toLocaleString()}
🔒 *20% Advance Escrow Required:* ₹${deposit.toLocaleString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 *Inspect Specs & Book Online:*
${equipmentUrl}

_Generated via Rentra Industrial Equipment Marketplace_`;

  const handleCopyQuote = async () => {
    try {
      await navigator.clipboard.writeText(quoteMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy quote:', err);
    }
  };

  const handleSendWhatsApp = () => {
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    let url = '';
    if (cleanPhone) {
      // With specific phone number
      url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(quoteMessage)}`;
    } else {
      // Open WhatsApp contact / chat picker
      url = `https://api.whatsapp.com/send?text=${encodeURIComponent(quoteMessage)}`;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative bg-white border border-slate-200 rounded-[24px] shadow-2xl p-6 w-full max-w-lg z-10 overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <FaWhatsapp className="text-xl" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#0F172A]">Share Formal Quotation</h3>
                <p className="text-xs text-slate-500">Send quote to site engineer, client or finance team</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <FiX className="text-lg" />
            </button>
          </div>

          {/* Body Content */}
          <div className="space-y-4 py-4 overflow-y-auto pr-1">
            {/* Direct Recipient Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Recipient WhatsApp Number <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="e.g. 919876543210 (Leave blank to pick from contacts)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Tip: If left blank, WhatsApp will allow you to pick any individual contact or contractor group.
              </p>
            </div>

            {/* Quotation Live Preview */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FiFileText className="text-emerald-600" /> Quotation Message Preview:
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">
                  Auto-formatted for WhatsApp
                </span>
              </div>
              <div className="bg-[#ECE5DD]/40 border border-emerald-100 rounded-[16px] p-3 text-[11px] font-mono leading-relaxed text-slate-800 whitespace-pre-wrap max-h-56 overflow-y-auto select-all shadow-inner">
                {quoteMessage}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
            <button
              onClick={handleCopyQuote}
              className="w-full sm:w-1/2 py-3 px-4 rounded-[14px] border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
            >
              {copied ? (
                <>
                  <FiCheck className="text-emerald-600 text-sm" />
                  <span className="text-emerald-600">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <FiCopy className="text-slate-500 text-sm" />
                  <span>Copy Quote Text</span>
                </>
              )}
            </button>

            <button
              onClick={handleSendWhatsApp}
              className="w-full sm:w-1/2 py-3 px-4 rounded-[14px] bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-500/20 active:scale-[0.98]"
            >
              <FaWhatsapp className="text-base" />
              <span>Share on WhatsApp</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuoteShareModal;
