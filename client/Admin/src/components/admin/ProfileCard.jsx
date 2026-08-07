import React from 'react';
import { FiMail, FiPhone, FiCalendar, FiShield, FiCheckSquare } from 'react-icons/fi';

const ProfileCard = ({ profile }) => {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <img
          src={profile.avatar}
          alt={profile.name}
          className="w-24 h-24 rounded-full object-cover ring-4 ring-[#CCCCFF] shadow-sm"
        />
        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">{profile.name}</h2>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 mt-1 rounded-full text-xs font-semibold bg-[#CCCCFF]/40 text-[#0F172A]">
                <FiShield className="text-xs" /> {profile.role}
              </span>
            </div>
            <span className="text-xs font-medium text-[#64748B] flex items-center justify-center sm:justify-start gap-1">
              <FiCalendar /> Joined {profile.joinedDate}
            </span>
          </div>

          <p className="mt-3 text-xs text-[#64748B] leading-relaxed max-w-xl">{profile.bio}</p>

          <div className="mt-4 pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center justify-center sm:justify-start gap-6 text-xs text-[#0F172A]">
            <div className="flex items-center gap-2">
              <FiMail className="text-[#64748B]" />
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiPhone className="text-[#64748B]" />
              <span>{profile.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
