import React from 'react';
import { motion } from 'framer-motion';
import { FiBriefcase, FiMail, FiPhone, FiMapPin, FiCalendar, FiStar } from 'react-icons/fi';
import ProfileCoverBanner from '../common/ProfileCoverBanner';

const ProfileCard = ({ profile, onUpdateCover }) => {
  const { name, role, email, phone, address, businessName, joinedDate, avatar, stats, cover } = profile;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="panel-card overflow-hidden bg-white border border-[#E2E8F0] rounded-[20px] shadow-xs"
    >
      {/* Cover Header Banner with reliable fallback and custom upload */}
      <ProfileCoverBanner
        cover={cover}
        onUpdateCover={onUpdateCover}
        className="rounded-t-[20px]"
      />

      <div className="px-6 pb-6 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 mb-4">
          {/* Avatar floating over banner */}
          <div className="relative -mt-14 shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-4 ring-white shadow-md bg-white">
              {avatar ? (
                <img
                  src={avatar}
                  alt={name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=300";
                  }}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#CCCCFF] flex items-center justify-center text-3xl font-bold text-[#0F172A]">
                  {name?.charAt(0)}
                </div>
              )}
            </div>
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-[#22C55E] rounded-full ring-2 ring-white flex items-center justify-center text-white text-[10px]">
              ✓
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pt-2 sm:pt-0">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">{name}</h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="flex items-center gap-1 text-xs font-semibold text-[#64748B]">
                    <FiBriefcase className="text-[11px] text-[#3B82F6]" /> {businessName}
                  </span>
                  <span className="text-[#E2E8F0]">|</span>
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-[#CCCCFF] text-[#0F172A] rounded-full">
                    {role || 'Business Owner'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#CCCCFF]/30 rounded-[10px] border border-[#CCCCFF]/40">
                <FiStar className="text-[#F59E0B] text-sm" />
                <span className="text-xs font-bold text-[#0F172A]">{stats?.avgRating || '4.8'} Rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-3.5 bg-[#F8FAFC] rounded-[16px] border border-[#E2E8F0] mt-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-[10px] bg-white border border-[#E2E8F0] flex items-center justify-center text-[#3B82F6] shrink-0 text-sm">
              <FiMail />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] uppercase font-bold text-[#94A3B8] tracking-wider">Email</p>
              <p className="text-xs font-semibold text-[#0F172A] truncate">{email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-[10px] bg-white border border-[#E2E8F0] flex items-center justify-center text-[#22C55E] shrink-0 text-sm">
              <FiPhone />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] uppercase font-bold text-[#94A3B8] tracking-wider">Phone</p>
              <p className="text-xs font-semibold text-[#0F172A] truncate">{phone || 'Not set'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-[10px] bg-white border border-[#E2E8F0] flex items-center justify-center text-[#F59E0B] shrink-0 text-sm">
              <FiMapPin />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] uppercase font-bold text-[#94A3B8] tracking-wider">Location</p>
              <p className="text-xs font-semibold text-[#0F172A] truncate">{address}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-[10px] bg-white border border-[#E2E8F0] flex items-center justify-center text-[#8B5CF6] shrink-0 text-sm">
              <FiCalendar />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] uppercase font-bold text-[#94A3B8] tracking-wider">Member Since</p>
              <p className="text-xs font-semibold text-[#0F172A] truncate">{joinedDate}</p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-[#E2E8F0]">
            <div className="text-center">
              <p className="text-xl font-extrabold text-[#0F172A]">{stats.totalEquipment}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">Equipment</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-extrabold text-[#0F172A]">{stats.activeBookings}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">Active Bookings</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-extrabold text-[#0F172A]">{stats.completedBookings}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-extrabold text-[#22C55E]">{stats.totalEarnings}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">Total Earned</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfileCard;
