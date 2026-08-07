import React from 'react';
import { motion } from 'framer-motion';
import { FiBriefcase, FiMail, FiPhone, FiMapPin, FiCalendar, FiStar } from 'react-icons/fi';

const ProfileCard = ({ profile }) => {
  const { name, role, email, phone, address, businessName, joinedDate, avatar, stats } = profile;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-r from-[#CCCCFF]/40 via-white to-white border border-[#E2E8F0] rounded-[20px] p-6 shadow-xs"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-[#CCCCFF] shadow-lg">
            {avatar ? (
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#CCCCFF] flex items-center justify-center text-2xl font-bold text-[#0F172A]">
                {name?.charAt(0)}
              </div>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#22C55E] rounded-full border-2 border-white flex items-center justify-center">
            <span className="text-white text-[8px]">✓</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-2xl font-extrabold text-[#0F172A]">{name}</h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="flex items-center gap-1 text-xs font-semibold text-[#64748B]">
                  <FiBriefcase className="text-[11px]" /> {businessName}
                </span>
                <span className="text-[#E2E8F0]">|</span>
                <span className="text-xs text-[#64748B]">{role}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#CCCCFF]/30 rounded-[10px]">
              <FiStar className="text-[#F59E0B] text-sm" />
              <span className="text-xs font-bold text-[#0F172A]">{stats?.avgRating || '4.8'} Rating</span>
            </div>
          </div>

          {/* Contact Row */}
          <div className="flex flex-wrap gap-4 mt-3">
            <span className="flex items-center gap-1.5 text-xs text-[#64748B]">
              <FiMail className="text-[11px]" /> {email}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[#64748B]">
              <FiPhone className="text-[11px]" /> {phone}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[#64748B]">
              <FiMapPin className="text-[11px]" /> {address}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[#64748B]">
              <FiCalendar className="text-[11px]" /> Member since {joinedDate}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-[#E2E8F0]">
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
    </motion.div>
  );
};

export default ProfileCard;
