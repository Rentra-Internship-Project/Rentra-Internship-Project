import React, { useState, useEffect } from 'react';
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
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useCustomer } from '../../context/CustomerContext';
import Button from '../../components/common/Button';
import QuoteShareModal from '../../components/common/QuoteShareModal';
import { FiAlertCircle } from 'react-icons/fi';
import { equipmentService } from '../../services/api';

const EquipmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { equipmentList, isInWishlist, toggleWishlist } = useCustomer();

  const [equipment, setEquipment] = useState(() => {
    return equipmentList.find((e) => e.id === id || e._id === id) || null;
  });
  const [loading, setLoading] = useState(!equipment);
  const [error, setError] = useState(null);

  // Sync equipment from context or fetch from API directly on refresh/deep-link
  useEffect(() => {
    let isMounted = true;
    const found = equipmentList.find((e) => e.id === id || e._id === id);
    if (found) {
      setEquipment(found);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    equipmentService.getById(id)
      .then((res) => {
        if (!isMounted) return;
        const data = res.data?.equipment || res.data;
        if (data && (data.id || data._id)) {
          setEquipment(data);
          setError(null);
        } else {
          setError('Equipment not found or unavailable.');
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Failed to load equipment:', err);
        setError(err.response?.data?.error || 'Equipment not found or unavailable.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id, equipmentList]);

  // Unique Features State & Logistics Calculations
  const [includeOperator, setIncludeOperator] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const equipId = equipment?.id || equipment?._id;
  const isWishlisted = equipId ? isInWishlist(equipId) : false;
  const operatorDailyRate = equipment?.operatorDailyRate || 1500;
  const effectiveDailyRate = (equipment?.pricePerDay || 0) + (includeOperator ? operatorDailyRate : 0);

  // Gallery active image state
  const galleryImages = equipment?.gallery && equipment.gallery.length > 0
    ? equipment.gallery
    : (equipment?.image ? [equipment.image] : []);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    if (galleryImages.length > 0) {
      setActiveImage(galleryImages[0]);
    }
  }, [equipment]);

  // Fetch real reviews from backend
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    if (!equipId) return;
    setReviewsLoading(true);
    equipmentService.getEquipmentReviews(equipId)
      .then((res) => setReviews(res.data?.reviews || []))
      .catch(() => setReviews([]))
      .finally(() => setReviewsLoading(false));
  }, [equipId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#CCCCFF] border-t-[#0F172A] rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-[#64748B]">Loading equipment specifications...</p>
      </div>
    );
  }

  if (error || !equipment) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
          <FiAlertCircle className="text-3xl" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#0F172A]">Equipment Not Found</h2>
        <p className="text-sm text-[#64748B]">
          {error || 'The requested equipment listing could not be found or is currently unavailable.'}
        </p>
        <Button variant="primary" onClick={() => navigate('/customer/browse-equipment')}>
          Back to Browse Equipment
        </Button>
      </div>
    );
  }

  const owner = equipment.owner || {};
  const ownerAvatar = owner.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150';
  const ownerName = owner.name || 'Verified Machinery Owner';
  const ownerPhone = owner.phone || 'Contact via Rentra';
  const ownerEmail = owner.email || 'support@rentra.com';

  return (
    <div className="space-y-6">
      {/* Back Button & Header */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate('/customer/browse-equipment')}
          className="p-2.5 rounded-[12px] bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer flex items-center gap-2"
        >
          <FiArrowLeft className="text-base" />
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => toggleWishlist(equipId)}
<<<<<<< HEAD
            className={`p-2.5 rounded-[12px] border transition-all cursor-pointer flex items-center gap-2 ${isWishlisted ? 'bg-[#EF4444] text-white border-[#EF4444]' : 'bg-white text-slate-700 border-[#E2E8F0] hover:bg-[#F8FAFC]'} `}
            aria-label="Toggle Wishlist"
=======
            className={`p-2.5 rounded-[12px] border transition-all cursor-pointer flex items-center justify-center ${
              isWishlisted
                ? 'bg-[#EF4444] text-white border-[#EF4444]'
                : 'bg-white text-slate-700 border-[#E2E8F0] hover:bg-[#F8FAFC]'
            }`}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
>>>>>>> feat/mobile-ui-fixes
          >
            <FiHeart className={`text-base ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={() => setIsShareModalOpen(true)}
            title="Share formal quote via WhatsApp"
            className="p-2.5 rounded-[12px] border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-xs active:scale-[0.98]"
          >
            <FaWhatsapp className="text-base text-emerald-600" />
            <span className="hidden sm:inline">WhatsApp Quote</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Gallery & Quick Pricing (Left 2 cols) / Owner & Booking Action (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-6">
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
          <div className="panel-card p-4 sm:p-6 space-y-4">
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


          {/* Customer Reviews Section */}
          <div className="panel-card p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-[#0F172A]">Verified Customer Reviews</h3>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-bold flex items-center gap-1">
                  <FiStar className="fill-current text-amber-500" /> {equipment.rating || 0} ({reviews.length})
                </span>
              </div>
            </div>

            {reviewsLoading ? (
              <p className="text-xs text-[#94A3B8] py-2">Loading reviews...</p>
            ) : reviews.length > 0 ? (
              <div className="space-y-4 divide-y divide-[#E2E8F0]">
                {reviews.map((rev) => (
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
                      <div className="flex items-center gap-0.5 text-amber-400 text-sm">
                        {[1,2,3,4,5].map((s) => (
                          <FiStar key={s} className={s <= rev.rating ? 'fill-current' : 'text-[#E2E8F0]'} />
                        ))}
                      </div>
                    </div>
                    {rev.comment && (
                      <p className="text-xs text-[#64748B] pt-1 pl-10">{rev.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#64748B] py-2">No reviews yet for this equipment. Be the first to rate after your rental!</p>
            )}
          </div>
        </div>

        {/* Right Column: Owner Card & Booking CTA */}
        <div className="space-y-6">
          {/* Booking Action Box */}
          <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#E2E8F0] overflow-hidden">
            <div className="bg-gradient-to-r from-[#0F172A] to-slate-800 p-4 sm:p-6 text-white">
              <h3 className="text-lg font-extrabold flex items-center gap-2">
                <FiCheckCircle className="text-emerald-400" />
                Rental Rate Summary
              </h3>
              <p className="text-slate-300 text-xs mt-1">Review your daily pricing structure</p>
            </div>

            <div className="p-4 sm:p-6 space-y-4 bg-slate-50">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <span className="text-sm font-medium text-slate-500">Base Daily Rate</span>
                <span className="text-lg font-extrabold text-[#0F172A]">₹{equipment.pricePerDay.toLocaleString()} <span className="text-xs text-slate-500 font-normal">/ day</span></span>
              </div>

              {/* Professional Assistance Option Widget */}
              <label className="flex items-start gap-3 p-4 bg-white border-2 border-emerald-100 hover:border-emerald-300 rounded-[16px] cursor-pointer transition-all shadow-sm group">
                <div className="mt-0.5">
                  <input
                    type="checkbox"
                    checked={includeOperator}
                    onChange={(e) => setIncludeOperator(e.target.checked)}
                    className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                  />
                </div>
                <div className="flex-1">
                  <span className="font-bold text-[#0F172A] block text-sm group-hover:text-emerald-700 transition-colors">Include Professional Operator</span>
                  <span className="text-xs text-slate-500 block mt-0.5">Expert assistance for smooth operations</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-600 block text-sm">+₹{operatorDailyRate}</span>
                  <span className="text-[10px] text-slate-400 font-medium">per day</span>
                </div>
              </label>

              <div className="bg-white rounded-[16px] p-4 border border-slate-200 shadow-sm space-y-3 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 font-medium">Effective Daily Rate</span>
                  <span className="text-base font-bold text-[#0F172A]">₹{effectiveDailyRate.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">/ day</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 font-medium">Refundable Deposit</span>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">20% of Total</span>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex justify-between items-center mb-5 px-2">
                  <span className="text-sm font-bold text-[#0F172A]">Due Now to Book</span>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 uppercase tracking-wide">Deposit Only</span>
                </div>
                <Button
                  variant="custom"
                  size="lg"
                  onClick={() => navigate(`/customer/booking-summary/${equipId}`, {
                    state: { includeOperator, operatorDailyRate }
                  })}
                  className="w-full bg-[#0F172A] hover:bg-black text-white shadow-lg shadow-[#0F172A]/25 hover:shadow-[#0F172A]/40 transform hover:-translate-y-0.5 transition-all text-sm py-4"
                  icon={FiArrowRight}
                >
                  Proceed to Booking Summary
                </Button>

                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(true)}
                  className="w-full mt-2.5 py-3 px-4 rounded-[14px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                >
                  <FaWhatsapp className="text-base text-[#25D366]" />
                  <span>Share Contractor Quote via WhatsApp</span>
                </button>
              </div>
            </div>
          </div>

          {/* Owner Information Card */}
          <div className="panel-card p-4 sm:p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] border-b border-[#E2E8F0] pb-3">
              Equipment Owner Information
            </h3>

            <div className="flex items-center gap-3">
              <img
                src={ownerAvatar}
                alt={ownerName}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-[#CCCCFF]"
              />
              <div>
                <h4 className="text-sm font-bold text-[#0F172A] flex items-center gap-1">
                  {ownerName} <FiShield className="text-[#3B82F6] text-xs" />
                </h4>
                <p className="text-[11px] text-[#64748B]">Owner: {ownerName}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs pt-2">
              <div className="flex items-center gap-2.5 text-[#64748B]">
                <FiPhone className="text-[#22C55E]" />
                <span className="font-medium text-[#0F172A]">{ownerPhone}</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#64748B]">
                <FiMail className="text-[#3B82F6]" />
                <span className="font-medium text-[#0F172A] truncate">{ownerEmail}</span>
              </div>
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-[14px] border border-[#E2E8F0] text-[11px] text-[#64748B] flex items-center gap-2">
              <FiCheckCircle className="text-[#22C55E] text-base shrink-0" />
              <span>Verified asset owner with 100% active equipment maintenance records.</span>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Quote Share Modal */}
      <QuoteShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        equipment={equipment}
        quoteData={{
          durationDays: 1,
          includeOperator,
          operatorDailyRate,
          baseDailyRate: equipment.pricePerDay,
          totalValue: effectiveDailyRate,
          deposit: Math.round(effectiveDailyRate * 0.20),
        }}
      />
    </div>
  );
};

export default EquipmentDetails;
