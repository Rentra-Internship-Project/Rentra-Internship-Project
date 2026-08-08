import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid,
  FiBriefcase,
  FiCheckSquare,
  FiTruck,
  FiPlusCircle,
  FiCalendar,
  FiDollarSign,
  FiUser,
  FiLogOut,
  FiX,
  FiPackage
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { name: 'Dashboard', path: '/owner/dashboard', icon: FiGrid },
  // { name: 'Register Business', path: '/owner/register-business', icon: FiBriefcase },
  // { name: 'Verification Status', path: '/owner/business-status', icon: FiCheckSquare },
  { name: 'My Equipment', path: '/owner/equipment', icon: FiTruck },
  { name: 'Add Equipment', path: '/owner/add-equipment', icon: FiPlusCircle },
  { name: 'Booking Requests', path: '/owner/bookings', icon: FiCalendar },
  { name: 'Earnings', path: '/owner/earnings', icon: FiDollarSign },
  { name: 'Profile', path: '/owner/profile', icon: FiUser },
];

const OwnerSidebar = ({ mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-[#E2E8F0] w-64 shadow-xs">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[12px] bg-[#CCCCFF] flex items-center justify-center text-[#0F172A] font-bold shadow-xs">
            <FiPackage className="text-xl" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl text-[#0F172A] tracking-tight">RENTRA</h1>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">Owner Portal</p>
          </div>
        </div>
        {/* Mobile close button */}
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-[#64748B] hover:text-[#0F172A] p-1.5 rounded-full hover:bg-[#F8FAFC]"
          >
            <FiX className="text-xl" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">Main Navigation</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-[12px] text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#CCCCFF] text-[#0F172A] font-semibold shadow-xs'
                  : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
              }`}
            >
              <Icon className={`text-lg ${isActive ? 'text-[#0F172A]' : 'text-[#64748B]'}`} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Sidebar Footer / Logout */}
      <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC]/50">
        <button
          onClick={() => {
            logout();
            navigate('/login', { replace: true });
            setMobileOpen?.(false);
          }}
          className="flex items-center gap-3 w-full px-3.5 py-3 rounded-[12px] text-sm font-medium text-[#EF4444] hover:bg-red-50 transition-colors"
        >
          <FiLogOut className="text-lg" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:block fixed top-0 left-0 bottom-0 z-30 w-64">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative z-10 h-full"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OwnerSidebar;
