import React from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiDollarSign, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const statusColors = {
  Approved: 'bg-green-50 text-[#22C55E] border-green-100',
  Pending: 'bg-amber-50 text-[#F59E0B] border-amber-100',
  Rejected: 'bg-red-50 text-[#EF4444] border-red-100',
};

const availabilityColors = {
  Available: 'bg-emerald-50 text-emerald-600',
  Rented: 'bg-blue-50 text-blue-600',
  Maintenance: 'bg-slate-50 text-slate-500',
};

const EquipmentCard = ({ equipment, onDelete }) => {
  const navigate = useNavigate();
  const { id, name, category, location, pricePerDay, availability, status, images } = equipment;

  return (
    <motion.div
      whileHover={{ y: -4, shadow: '0 20px 40px -15px rgba(0,0,0,0.12)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-white border border-[#E2E8F0] rounded-[20px] overflow-hidden shadow-xs flex flex-col"
    >
      {/* Equipment Image */}
      <div className="relative h-44 bg-[#F8FAFC] overflow-hidden">
        {images && images[0] ? (
          <img
            src={images[0]}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#94A3B8]">
            <span className="text-4xl">🏗️</span>
          </div>
        )}
        {/* Status Badge Overlay */}
        <div className="absolute top-3 left-3">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${statusColors[status] || 'bg-slate-50 text-slate-500 border-slate-100'}`}>
            {status}
          </span>
        </div>
        {/* Availability */}
        <div className="absolute top-3 right-3">
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${availabilityColors[availability] || 'bg-slate-50 text-slate-500'}`}>
            {availability}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-1">{category}</p>
          <h3 className="text-sm font-bold text-[#0F172A] leading-snug line-clamp-2 mb-2">{name}</h3>
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] mb-1">
            <FiMapPin className="shrink-0 text-[11px]" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1 text-base font-extrabold text-[#0F172A] mt-2">
            <FiDollarSign className="text-sm text-[#22C55E]" />
            <span>${pricePerDay.toLocaleString()}</span>
            <span className="text-xs font-normal text-[#64748B]">/ day</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#E2E8F0]">
          <button
            onClick={() => navigate(`/owner/edit-equipment/${id}`)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#CCCCFF] hover:bg-[#B8B8FF] text-[#0F172A] text-xs font-semibold rounded-[10px] transition-colors"
          >
            <FiEdit2 className="text-sm" /> Edit
          </button>
          <button
            onClick={() => onDelete && onDelete(id)}
            className="flex items-center justify-center px-3 py-2 bg-red-50 hover:bg-red-100 text-[#EF4444] text-xs font-semibold rounded-[10px] transition-colors"
          >
            <FiTrash2 className="text-sm" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EquipmentCard;
