import React from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiMapPin, FiStar, FiCheckCircle, FiClock, FiArrowRight } from 'react-icons/fi';
import { useCustomer } from '../../context/CustomerContext';
import Button from '../common/Button';

const EquipmentCard = ({ equipment, onBook, onViewDetails }) => {
  const { isInWishlist, toggleWishlist } = useCustomer();
  const isWishlisted = isInWishlist(equipment.id);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="panel-card overflow-hidden flex flex-col h-full group"
    >
      {/* Card Image Container */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={equipment.image}
          alt={equipment.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

        {/* Category Tag */}
        <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-xs text-[#0F172A] text-[11px] font-bold rounded-full shadow-xs">
          {equipment.category}
        </span>

        {/* Availability Badge */}
        <span
          className={`absolute top-3 right-12 px-2.5 py-1 text-[10px] font-bold rounded-full shadow-xs flex items-center gap-1 ${
            equipment.availability === 'Available'
              ? 'bg-[#22C55E]/90 text-white'
              : 'bg-[#F59E0B]/90 text-white'
          }`}
        >
          {equipment.availability === 'Available' ? <FiCheckCircle className="text-xs" /> : <FiClock className="text-xs" />}
          {equipment.availability}
        </span>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(equipment.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-xs ${
            isWishlisted
              ? 'bg-[#EF4444] text-white'
              : 'bg-white/80 hover:bg-white text-slate-700 hover:text-[#EF4444]'
          }`}
          aria-label="Toggle Wishlist"
        >
          <FiHeart className={`text-sm ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Location */}
          <div className="flex items-center justify-between text-xs text-[#64748B] mb-2">
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <FiStar className="fill-current text-amber-400" />
              <span>{equipment.rating}</span>
              <span className="text-[#94A3B8] font-normal">({equipment.reviewsCount})</span>
            </div>
            <div className="flex items-center gap-1 text-[#64748B]">
              <FiMapPin className="text-[#3B82F6]" />
              <span>{equipment.location}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-base text-[#0F172A] mb-2 line-clamp-1 group-hover:text-[#3B82F6] transition-colors">
            {equipment.name}
          </h3>

          {/* Owner Details snippet */}
          <p className="text-xs text-[#64748B] mb-4 line-clamp-2">
            Provided by <span className="font-semibold text-[#0F172A]">{equipment.owner.name}</span>
          </p>
        </div>

        {/* Footer Rate & Actions */}
        <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-2">
          <div>
            <p className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">Rental Rate</p>
            <p className="text-base font-extrabold text-[#0F172A]">
              ${equipment.pricePerDay} <span className="text-xs font-normal text-[#64748B]">/ day</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="xs"
              onClick={() => onViewDetails && onViewDetails(equipment)}
            >
              Details
            </Button>
            <Button
              variant="primary"
              size="xs"
              onClick={() => onBook && onBook(equipment)}
              icon={FiArrowRight}
            >
              Book
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EquipmentCard;
