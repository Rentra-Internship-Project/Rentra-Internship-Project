import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiMapPin,
  FiStar,
  FiCheckCircle,
  FiClock,
  FiHeart,
  FiShield,
  FiPhone,
  FiMail,
  FiArrowRight,
  FiMessageSquare,
  FiTruck,
  FiCheck,
} from 'react-icons/fi';
import { useCustomer } from '../../context/CustomerContext';
import Button from '../../components/common/Button';

const EquipmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { equipmentList, isInWishlist, toggleWishlist } = useCustomer();

  // Find equipment by ID or fallback
  const equipment = equipmentList.find((e) => e.id === id) || equipmentList[0];
  const isWishlisted = isInWishlist(equipment.id);

  // Gallery active image state
  const galleryImages = equipment.gallery && equipment.gallery.length > 0
    ? equipment.gallery
    : [equipment.image];
  const [activeImage, setActiveImage] = useState(galleryImages[0]);

  return (
    <div className="space-y-6">
      {/* Back Button & Header */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate('/customer/browse-equipment')}
          className="p-2.5 rounded-[12px] bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer flex items-center gap-2 text-xs font-bold"
        >
          <FiArrowLeft className="text-base" /> Back to Browse
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleWishlist(equipment.id)}
            className={`p-2.5 rounded-[12px] border transition-all cursor-pointer flex items-center gap-2 text-xs font-bold ${
              isWishlisted
                ? 'bg-[#EF4444] text-white border-[#EF4444]'
                : 'bg-white text-slate-700 border-[#E2E8F0] hover:bg-[#F8FAFC]'
            }`}
          >
            <FiHeart className={`text-base ${isWishlisted ? 'fill-current' : ''}`} />
            <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
          </button>

          <Button
            variant="primary"
            size="md"
            onClick={() => navigate(`/customer/booking-summary/${equipment.id}`)}
            icon={FiArrowRight}
          >
            Book Equipment Now
          </Button>
        </div>
      </div>

      {/* Main Grid: Gallery & Quick Pricing (Left 2 cols) / Owner & Booking Action (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Images & Specs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gallery Main Container */}
          <div className="panel-card p-4 space-y-3 overflow-hidden">
            <div className="h-72 sm:h-96 w-full rounded-[20px] overflow-hidden relative bg-slate-100">
              <img
                src={activeImage}
                alt={equipment.name}
                className="w-full h-full object-cover"
              />

              <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-xs text-[#0F172A] text-xs font-bold rounded-full shadow-xs">
                {equipment.category}
              </span>

              <span
                className={`absolute top-4 right-4 px-3 py-1 text-xs font-bold rounded-full shadow-xs flex items-center gap-1.5 ${
                  equipment.availability === 'Available'
                    ? 'bg-[#22C55E]/90 text-white'
                    : 'bg-[#F59E0B]/90 text-white'
                }`}
              >
                {equipment.availability === 'Available' ? <FiCheckCircle className="text-sm" /> : <FiClock className="text-sm" />}
                {equipment.availability}
              </span>
            </div>

            {/* Thumbnail Selectors */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pt-1">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-16 rounded-[12px] overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeImage === img ? 'border-[#CCCCFF] ring-2 ring-[#CCCCFF]/40' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description & Overview */}
          <div className="panel-card p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">{equipment.name}</h1>
                <p className="text-xs sm:text-sm text-[#64748B] flex items-center gap-1.5 mt-1">
                  <FiMapPin className="text-[#3B82F6]" /> Location: {equipment.location}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-2xl font-extrabold text-[#0F172A]">
                  ₹{equipment.pricePerDay.toLocaleString()}
                </span>
                <span className="text-xs text-[#64748B]"> / day</span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2">Description</h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">{equipment.description}</p>
            </div>
          </div>

          {/* Equipment Specifications Grid */}
          <div className="panel-card p-6 space-y-4">
            <h3 className="text-sm font-extrabold text-[#0F172A] border-b border-[#E2E8F0] pb-3">
              Technical Specifications
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(equipment.specs).map(([key, val]) => (
                <div key={key} className="p-3 bg-[#F8FAFC] rounded-[16px] border border-[#E2E8F0]">
                  <p className="text-[10px] capitalize text-[#94A3B8] font-bold tracking-wider">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </p>
                  <p className="text-xs font-extrabold text-[#0F172A] mt-1">{val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="panel-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-[#0F172A]">Verified Customer Reviews</h3>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-bold flex items-center gap-1">
                  <FiStar className="fill-current text-amber-500" /> {equipment.rating} ({equipment.reviewsCount})
                </span>
              </div>
            </div>

            {equipment.reviews && equipment.reviews.length > 0 ? (
              <div className="space-y-4 divide-y divide-[#E2E8F0]">
                {equipment.reviews.map((rev) => (
                  <div key={rev.id} className="pt-3 first:pt-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.avatar}
                          alt={rev.userName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-xs font-bold text-[#0F172A]">{rev.userName}</p>
                          <p className="text-[10px] text-[#94A3B8]">{rev.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-amber-400 text-xs">
                        {'★'.repeat(Math.floor(rev.rating))}
                      </div>
                    </div>
                    <p className="text-xs text-[#64748B] pt-1">{rev.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#64748B] py-2">No reviews written for this machinery unit yet.</p>
            )}
          </div>
        </div>

        {/* Right Column: Owner Card & Booking CTA */}
        <div className="space-y-6">
          {/* Booking Action Box */}
          <div className="panel-card p-6 space-y-4 border-2 border-[#CCCCFF]">
            <h3 className="text-base font-extrabold text-[#0F172A]">Rental Rate Summary</h3>

            <div className="p-4 bg-[#CCCCFF]/20 rounded-[18px] border border-[#CCCCFF]/50 space-y-2">
              <div className="flex justify-between text-xs text-[#64748B]">
                <span>Daily Rental Rate:</span>
                <span className="font-extrabold text-[#0F172A]">₹{equipment.pricePerDay.toLocaleString()} / day</span>
              </div>
              <div className="flex justify-between text-xs text-[#64748B]">
                <span>Security Deposit (Refundable):</span>
                <span className="font-extrabold text-[#0F172A]">₹2,000</span>
              </div>
              <div className="pt-2 border-t border-[#CCCCFF]/40 flex justify-between text-xs font-bold text-[#0F172A]">
                <span>Payable Now to Book:</span>
                <span className="text-sm font-extrabold text-[#22C55E]">₹2,000 (Deposit)</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate(`/customer/booking-summary/${equipment.id}`)}
              className="w-full shadow-md"
              icon={FiArrowRight}
            >
              Proceed to Booking Summary
            </Button>
          </div>

          {/* Owner Information Card */}
          <div className="panel-card p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] border-b border-[#E2E8F0] pb-3">
              Equipment Owner Information
            </h3>

            <div className="flex items-center gap-3">
              <img
                src={equipment.owner.avatar}
                alt={equipment.owner.ownerName}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-[#CCCCFF]"
              />
              <div>
                <h4 className="text-sm font-bold text-[#0F172A] flex items-center gap-1">
                  {equipment.owner.name} <FiShield className="text-[#3B82F6] text-xs" />
                </h4>
                <p className="text-[11px] text-[#64748B]">Owner: {equipment.owner.ownerName}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs pt-2">
              <div className="flex items-center gap-2.5 text-[#64748B]">
                <FiPhone className="text-[#22C55E]" />
                <span className="font-medium text-[#0F172A]">{equipment.owner.phone}</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#64748B]">
                <FiMail className="text-[#3B82F6]" />
                <span className="font-medium text-[#0F172A] truncate">{equipment.owner.email}</span>
              </div>
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-[14px] border border-[#E2E8F0] text-[11px] text-[#64748B] flex items-center gap-2">
              <FiCheckCircle className="text-[#22C55E] text-base shrink-0" />
              <span>Verified asset owner with 100% active equipment maintenance records.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetails;
