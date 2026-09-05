import React from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiMapPin, FiStar, FiCheckCircle, FiClock, FiArrowRight } from 'react-icons/fi';
import { useCustomer } from '../../context/CustomerContext';
import Button from '../common/Button';

const EquipmentCard = ({ equipment, onBook, onViewDetails }) => {
  const { isInWishlist, toggleWishlist } = useCustomer();
  if (!equipment) return null;

  const equipId = equipment.id || equipment._id;
  const isWishlisted = equipId ? isInWishlist(equipId) : false;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={() => onViewDetails && onViewDetails(equipment)}
      className="panel-card overflow-hidden flex flex-col h-full group cursor-pointer"
    >
      {/* Card Image Container */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={equipment.image}
          alt={equipment.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

        {/* Top Badges & Actions Overlay */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-2">
          {/* Left Side: Category & Status */}
          <div className="flex flex-col gap-1.5 items-start">
            <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-[#0F172A] text-[11px] font-extrabold rounded-full shadow-sm max-w-[140px] truncate">
              {equipment.category}
            </span>
            <span
              className={`px-2.5 py-1 text-[10px] font-bold rounded-full shadow-sm flex items-center gap-1 w-max ${
                equipment.availability === 'Available'
                  ? 'bg-[#22C55E]/95 text-white'
                  : 'bg-[#F59E0B]/95 text-white'
              }`}
            >
              {equipment.availability === 'Available' ? <FiCheckCircle className="text-[10px]" /> : <FiClock className="text-[10px]" />}
              {equipment.availability}
            </span>
          </div>

          {/* Right Side: Wishlist */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(equipId);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-sm flex-shrink-0 ${
              isWishlisted
                ? 'bg-[#EF4444] text-white hover:bg-red-600'
                : 'bg-white/90 hover:bg-white text-slate-700 hover:text-[#EF4444]'
            }`}
            aria-label="Toggle Wishlist"
          >
            <FiHeart className={`text-sm ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>
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
            Provided by <span className="font-semibold text-[#0F172A]">{equipment.owner?.name || 'Verified Owner'}</span>
          </p>
        </div>

        {/* Footer Rate & Actions */}
        <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-2">
          <div>
            <p className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">Rental Rate</p>
            <p className="text-base font-extrabold text-[#0F172A]">
              ₹{equipment.pricePerDay} <span className="text-xs font-normal text-[#64748B]">/ day</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="xs"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails && onViewDetails(equipment);
              }}
            >
              Details
            </Button>
            <Button
              variant="primary"
              size="xs"
              onClick={(e) => {
                e.stopPropagation();
                onBook && onBook(equipment);
              }}
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
