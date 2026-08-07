import React from 'react';
import { motion } from 'framer-motion';
import { FiTrash2, FiMapPin, FiStar, FiCheckCircle, FiClock, FiArrowRight } from 'react-icons/fi';
import Button from '../common/Button';

const WishlistCard = ({ equipment, onRemove, onBook, onViewDetails }) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="panel-card overflow-hidden flex flex-col justify-between h-full group"
    >
      <div>
        {/* Card Header Image */}
        <div className="relative h-44 w-full overflow-hidden bg-slate-100">
          <img
            src={equipment.image}
            alt={equipment.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-50" />

          {/* Category Badge */}
          <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-xs text-[#0F172A] text-[11px] font-bold rounded-full shadow-xs">
            {equipment.category}
          </span>

          {/* Availability Badge */}
          <span
            className={`absolute top-3 right-3 px-2.5 py-1 text-[10px] font-bold rounded-full shadow-xs flex items-center gap-1 ${
              equipment.availability === 'Available'
                ? 'bg-[#22C55E]/90 text-white'
                : 'bg-[#F59E0B]/90 text-white'
            }`}
          >
            {equipment.availability === 'Available' ? <FiCheckCircle className="text-xs" /> : <FiClock className="text-xs" />}
            {equipment.availability}
          </span>
        </div>

        {/* Card Body */}
        <div className="p-5">
          <div className="flex items-center justify-between text-xs text-[#64748B] mb-2">
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <FiStar className="fill-current text-amber-400" />
              <span>{equipment.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiMapPin className="text-[#3B82F6]" />
              <span>{equipment.location}</span>
            </div>
          </div>

          <h3 className="font-bold text-base text-[#0F172A] mb-1 line-clamp-1 group-hover:text-[#3B82F6] transition-colors">
            {equipment.name}
          </h3>

          <p className="text-xs text-[#64748B] mb-4">
            Provided by <span className="font-semibold text-[#0F172A]">{equipment.owner.name}</span>
          </p>

          <div className="p-3 bg-[#F8FAFC] rounded-[14px] border border-[#E2E8F0] mb-4 flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">Daily Rental Rate:</span>
            <span className="text-base font-extrabold text-[#0F172A]">${equipment.pricePerDay} / day</span>
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="px-5 pb-5 pt-0 flex items-center justify-between gap-2 border-t border-[#E2E8F0] pt-4">
        <button
          onClick={() => onRemove(equipment.id)}
          className="p-2.5 rounded-[12px] text-[#EF4444] hover:bg-red-50 transition-colors border border-red-200 cursor-pointer"
          title="Remove from Wishlist"
        >
          <FiTrash2 className="text-base" />
        </button>

        <div className="flex items-center gap-2 flex-1 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(equipment)}
          >
            Details
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onBook(equipment)}
            icon={FiArrowRight}
          >
            Book Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default WishlistCard;
