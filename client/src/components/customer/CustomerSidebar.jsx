import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid,
  FiSearch,
  FiHeart,
  FiCalendar,
  FiUser,
  FiBell,
  FiLogOut,
  FiX,
  FiTruck,
  FiArrowRight,
  FiBriefcase,
} from 'react-icons/fi';
import { useCustomer } from '../../context/CustomerContext';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { name: 'Dashboard', path: '/customer/dashboard', icon: FiGrid },
  { name: 'Browse Equipment', path: '/customer/browse-equipment', icon: FiSearch },
  { name: 'Wishlist', path: '/customer/wishlist', icon: FiHeart },
  { name: 'Bookings', path: '/customer/bookings', icon: FiCalendar },
  { name: 'Profile', path: '/customer/profile', icon: FiUser },
  { name: 'Notifications', path: '/customer/notifications', icon: FiBell, showBadge: true },
];

const CustomerSidebar = ({ mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { unreadNotifCount } = useCustomer();
  const { user, logout, switchRole } = useAuth();
  const [switchingRole, setSwitchingRole] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
    setMobileOpen?.(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-[#E2E8F0] w-64 shadow-xs">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[12px] bg-[#CCCCFF] flex items-center justify-center text-[#0F172A] font-bold shadow-xs">
            <FiTruck className="text-xl" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl text-[#0F172A] tracking-tight">RENTRA</h1>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">Customer Portal</p>
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
      <div className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
        <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">Main Navigation</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path === '/customer/bookings' && location.pathname.startsWith('/customer/bookings/'));

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={`flex items-center justify-between px-3.5 py-3 rounded-[12px] text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#CCCCFF] text-[#0F172A] font-semibold shadow-xs'
                  : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`text-lg ${isActive ? 'text-[#0F172A]' : 'text-[#64748B]'}`} />
                <span>{item.name}</span>
              </div>
              {item.showBadge && unreadNotifCount > 0 && (
                <span className="bg-[#EF4444] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
                  {unreadNotifCount}
                </span>
              )}
            </NavLink>
          );
        })}

        {/* Switch / Become Owner Section */}
        <div className="pt-4 mt-4 border-t border-[#E2E8F0]">
          {user?.role === 'OWNER' ? (
            <motion.div
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className="p-4 rounded-[18px] bg-gradient-to-br from-[#5D5DEB]/15 via-white to-[#CCCCFF]/20 border border-[#5D5DEB]/30 shadow-xs"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1.5 bg-[#5D5DEB] text-white rounded-[8px] text-xs">
                  <FiTruck />
                </span>
                <h4 className="text-xs font-bold text-[#0F172A]">Owner Portal</h4>
              </div>
              <p className="text-[11px] text-[#64748B] leading-relaxed mb-3">
                Switch to your fleet dashboard to manage equipment, bookings, and rental earnings.
              </p>
              <button
                onClick={() => {
                  setMobileOpen?.(false);
                  navigate('/owner/dashboard');
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-[#5D5DEB] hover:bg-[#4E4ED8] text-white rounded-[10px] text-xs font-semibold transition-all duration-200 cursor-pointer shadow-xs"
              >
                <FiTruck className="text-xs" />
                <span>Switch to Owner Portal</span>
                <FiArrowRight className="text-xs" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className="p-4 rounded-[18px] bg-gradient-to-br from-[#CCCCFF]/30 via-white to-[#B8B8FF]/20 border border-[#CCCCFF]/50 shadow-xs relative overflow-hidden group"
            >
              <div className="absolute -right-3 -top-3 w-16 h-16 bg-[#CCCCFF]/20 rounded-full blur-lg group-hover:bg-[#CCCCFF]/40 transition-all" />
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1.5 bg-[#0F172A] text-white rounded-[8px] text-xs">
                  <FiBriefcase />
                </span>
                <h4 className="text-xs font-bold text-[#0F172A]">Become An Equipment Owner</h4>
              </div>
              <p className="text-[11px] text-[#64748B] leading-relaxed mb-3">
                Start earning by listing your heavy machinery and commercial equipment on Rentra.
              </p>
              <button
                onClick={async () => {
                  setSwitchingRole(true);
                  const res = await switchRole('OWNER');
                  setSwitchingRole(false);
                  setMobileOpen?.(false);
                  if (res.success) {
                    navigate('/owner/dashboard');
                  }
                }}
                disabled={switchingRole}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-[10px] text-xs font-semibold transition-all duration-200 cursor-pointer shadow-xs disabled:opacity-50"
              >
                <FiTruck className="text-xs" />
                <span>{switchingRole ? 'Switching to Owner...' : 'Change to Owner'}</span>
                <FiArrowRight className="text-xs group-hover:translate-x-0.5 transition-transform" />
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Sidebar Footer / Logout */}
      <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC]/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3.5 py-3 rounded-[12px] text-sm font-medium text-[#EF4444] hover:bg-red-50 transition-colors cursor-pointer"
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

export default CustomerSidebar;
