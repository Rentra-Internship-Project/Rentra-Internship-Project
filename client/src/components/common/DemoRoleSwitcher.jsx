import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiUserCheck, FiTruck, FiShield } from 'react-icons/fi';

const DemoRoleSwitcher = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentRole = location.pathname.startsWith('/admin')
    ? 'Admin'
    : location.pathname.startsWith('/owner')
    ? 'Owner'
    : 'Customer';

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-[#0F172A]/95 backdrop-blur-md text-white px-4 py-2.5 rounded-[20px] shadow-2xl border border-[#334155] flex items-center gap-3 text-xs font-semibold">
      <span className="text-[#94A3B8] hidden sm:inline flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span> Demo Role:
      </span>

      <div className="flex gap-1.5">
        <button
          onClick={() => navigate('/customer/dashboard')}
          className={`px-3 py-1.5 rounded-[10px] transition-all flex items-center gap-1.5 cursor-pointer ${
            currentRole === 'Customer'
              ? 'bg-[#CCCCFF] text-[#0F172A] font-bold shadow-xs'
              : 'hover:bg-[#1E293B] text-[#94A3B8]'
          }`}
        >
          <FiUserCheck className="text-sm" /> Customer
        </button>

        <button
          onClick={() => navigate('/owner/dashboard')}
          className={`px-3 py-1.5 rounded-[10px] transition-all flex items-center gap-1.5 cursor-pointer ${
            currentRole === 'Owner'
              ? 'bg-amber-400 text-[#0F172A] font-bold shadow-xs'
              : 'hover:bg-[#1E293B] text-[#94A3B8]'
          }`}
        >
          <FiTruck className="text-sm" /> Owner
        </button>

        <button
          onClick={() => navigate('/admin/dashboard')}
          className={`px-3 py-1.5 rounded-[10px] transition-all flex items-center gap-1.5 cursor-pointer ${
            currentRole === 'Admin'
              ? 'bg-rose-500 text-white font-bold shadow-xs'
              : 'hover:bg-[#1E293B] text-[#94A3B8]'
          }`}
        >
          <FiShield className="text-sm" /> Admin
        </button>
      </div>
    </div>
  );
};

export default DemoRoleSwitcher;
