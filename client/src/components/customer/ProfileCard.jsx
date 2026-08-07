import React from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase, FiCalendar, FiShield, FiEdit2 } from 'react-icons/fi';
import Button from '../common/Button';

const ProfileCard = ({ profile, onEdit }) => {
  return (
    <div className="panel-card overflow-hidden">
      {/* Cover Header Banner */}
      <div className="h-36 sm:h-44 w-full relative bg-slate-200">
        <img
          src={profile.cover}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Profile Details Container */}
      <div className="px-6 pb-6 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-14 mb-6">
          <div className="flex items-end gap-4">
            <div className="relative">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-white shadow-md bg-white"
              />
              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[#22C55E] ring-2 ring-white flex items-center justify-center text-white text-[10px]" title="Account Active">
                <FiShield />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">{profile.name}</h2>
                <span className="px-2.5 py-0.5 text-xs font-bold bg-[#CCCCFF] text-[#0F172A] rounded-full">
                  {profile.role}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#64748B] flex items-center gap-1.5 mt-0.5">
                <FiBriefcase className="text-[#3B82F6]" />
                {profile.companyName} • {profile.businessType}
              </p>
            </div>
          </div>

          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit} icon={FiEdit2}>
              Edit Profile
            </Button>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-[#F8FAFC] rounded-[20px] border border-[#E2E8F0]">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-[12px] bg-white border border-[#E2E8F0] flex items-center justify-center text-[#3B82F6] shrink-0">
              <FiMail className="text-lg" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">Email Address</p>
              <p className="text-xs font-bold text-[#0F172A] truncate">{profile.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-[12px] bg-white border border-[#E2E8F0] flex items-center justify-center text-[#22C55E] shrink-0">
              <FiPhone className="text-lg" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">Phone Number</p>
              <p className="text-xs font-bold text-[#0F172A] truncate">{profile.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-[12px] bg-white border border-[#E2E8F0] flex items-center justify-center text-[#F59E0B] shrink-0">
              <FiMapPin className="text-lg" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">Location</p>
              <p className="text-xs font-bold text-[#0F172A] truncate">{profile.city}, {profile.state}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-[12px] bg-white border border-[#E2E8F0] flex items-center justify-center text-[#8B5CF6] shrink-0">
              <FiCalendar className="text-lg" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">Member Since</p>
              <p className="text-xs font-bold text-[#0F172A] truncate">{profile.memberSince}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
