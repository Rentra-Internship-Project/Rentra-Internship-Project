import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiUserCheck, FiTruck, FiShield, FiLoader } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const DemoRoleSwitcher = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loadingRole, setLoadingRole] = useState(null);

  const currentRole = location.pathname.startsWith('/admin')
    ? 'Admin'
    : location.pathname.startsWith('/owner')
    ? 'Owner'
    : 'Customer';

  const handleSwitchRole = async (role, email, password, path) => {
    setLoadingRole(role);
    const result = await login({ email, password });
    setLoadingRole(null);
    if (result && result.success) {
      navigate(path);
    } else {
      console.error('Role Switch Failed:', result?.message);
      alert(`Role Switch Failed: ${result?.message}\nPlease ensure the server is running and the database is seeded.`);
    }
  };

  return (
    <div className="fixed bottom-2 right-2 z-50 bg-[#0F172A]/80 backdrop-blur-md text-white px-2 py-1.5 rounded-[12px] shadow-lg border border-[#334155] flex items-center gap-1.5 text-[10px] font-medium opacity-60 hover:opacity-100 transition-all">
      <div className="flex gap-1">
        <button
          onClick={() => handleSwitchRole('Customer', 'customer@rentra.com', 'customer123', '/customer/dashboard')}
          disabled={loadingRole !== null}
          className={`px-2 py-1 rounded-[8px] transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50 ${
            currentRole === 'Customer'
              ? 'bg-[#CCCCFF] text-[#0F172A] font-bold'
              : 'hover:bg-[#1E293B] text-[#94A3B8]'
          }`}
        >
          {loadingRole === 'Customer' ? <FiLoader className="animate-spin text-[10px]" /> : <FiUserCheck className="text-[10px]" />} Cust
        </button>

        <button
          onClick={() => handleSwitchRole('Owner', 'owner@rentra.com', 'owner123', '/owner/dashboard')}
          disabled={loadingRole !== null}
          className={`px-2 py-1 rounded-[8px] transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50 ${
            currentRole === 'Owner'
              ? 'bg-amber-400 text-[#0F172A] font-bold'
              : 'hover:bg-[#1E293B] text-[#94A3B8]'
          }`}
        >
          {loadingRole === 'Owner' ? <FiLoader className="animate-spin text-[10px]" /> : <FiTruck className="text-[10px]" />} Own
        </button>

        <button
          onClick={() => handleSwitchRole('Admin', 'admin@rentra.com', 'admin123', '/admin/dashboard')}
          disabled={loadingRole !== null}
          className={`px-2 py-1 rounded-[8px] transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50 ${
            currentRole === 'Admin'
              ? 'bg-rose-500 text-white font-bold'
              : 'hover:bg-[#1E293B] text-[#94A3B8]'
          }`}
        >
          {loadingRole === 'Admin' ? <FiLoader className="animate-spin text-[10px]" /> : <FiShield className="text-[10px]" />} Adm
        </button>
      </div>
    </div>
  );
};

export default DemoRoleSwitcher;
