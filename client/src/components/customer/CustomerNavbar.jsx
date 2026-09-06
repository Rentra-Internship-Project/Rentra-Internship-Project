import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiBell, FiSearch, FiCheckCircle, FiUser, FiTruck } from 'react-icons/fi';
import { useCustomer } from '../../context/CustomerContext';
import { useAuth } from '../../context/AuthContext';

const pageTitles = {
  '/customer/dashboard': 'Customer Dashboard',
  '/customer/wishlist': 'My Wishlist',
  '/customer/bookings': 'Rental Bookings History',
  '/customer/profile': 'Customer Profile',
  '/customer/notifications': 'Notifications Center',
};

const CustomerNavbar = ({ setMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    profile,
    equipmentList,
    bookings,
    notifications,
    unreadNotifCount,
    markNotificationRead,
    markAllNotificationsRead,
  } = useCustomer();
  const { user, switchRole } = useAuth();
  const [switchingRole, setSwitchingRole] = useState(false);

  const handleBecomeOwner = async () => {
    setSwitchingRole(true);
    const res = await switchRole('OWNER');
    setSwitchingRole(false);
    if (res.success) {
      navigate('/owner/dashboard');
    }
  };

  const currentTitle = pageTitles[location.pathname] || (location.pathname.startsWith('/customer/bookings/') ? 'Booking Details' : 'Customer Portal');

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Notification Dropdown State
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Refs for Outside Click Listeners
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const notifRef = useRef(null);

  // Real-time search across equipment, bookings, categories
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const results = [];

    (equipmentList || []).forEach((eq) => {
      if (!eq) return;
      if (
        (eq.name || '').toLowerCase().includes(q) ||
        (eq.category || '').toLowerCase().includes(q) ||
        (eq.location || eq.locationAddress || '').toLowerCase().includes(q)
      ) {
        results.push({
          id: eq.id || eq._id,
          title: eq.name,
          subtitle: `Equipment • ${eq.category} • ₹${eq.pricePerDay}/day`,
          type: 'Equipment',
          link: `/customer/equipment/${eq.id || eq._id}`,
        });
      }
    });

    (bookings || []).forEach((bk) => {
      if (!bk) return;
      if (
        (bk.id || bk._id || '').toLowerCase().includes(q) ||
        (bk.equipmentName || '').toLowerCase().includes(q) ||
        (bk.ownerName || '').toLowerCase().includes(q)
      ) {
        results.push({
          id: bk.id || bk._id,
          title: bk.id || bk._id,
          subtitle: `Booking • ${bk.equipmentName} • ${bk.status}`,
          type: 'Booking',
          link: `/customer/bookings/${bk.id || bk._id}`,
        });
      }
    });

    return results.slice(0, 6);
  }, [searchQuery, equipmentList, bookings]);

  // Outside click listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);



  const handleMarkAllAsRead = async () => {
    await markAllNotificationsRead();
    setIsNotifOpen(false);
  };

  const handleNotificationClick = (n) => {
    markNotificationRead(n.id || n._id);
    setIsNotifOpen(false);
    
    let targetLink = '/customer/dashboard';
    if (n.type?.startsWith('Booking') || ['DepositPaid', 'ReadyForPickup', 'RentalActive', 'ReturnRequested', 'RentalCompleted'].includes(n.type)) {
      targetLink = n.bookingId ? `/customer/bookings/${n.bookingId}` : '/customer/bookings';
    } else if (n.link) {
      targetLink = n.link;
    }
    
    navigate(targetLink);
  };

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] px-4 md:px-8 py-3.5 flex items-center justify-between transition-all">
      <div className="flex items-center gap-3">
        {/* Mobile Toggle Button */}
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2 rounded-[12px] text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] border border-[#E2E8F0]"
          aria-label="Toggle menu"
        >
          <FiMenu className="text-xl" />
        </button>

        <div>
          <h2 className="text-lg md:text-xl font-bold text-[#0F172A] leading-tight">{currentTitle}</h2>
          <p className="text-xs text-[#64748B] hidden sm:block">Rentra Heavy Machinery & Business Asset Rental Marketplace</p>
        </div>
      </div>

      {/* Right Side Header Items */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Functional Search Bar */}
        <div ref={searchRef} className="relative hidden lg:block">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] text-xs text-[#64748B] focus-within:border-[#CCCCFF] focus-within:ring-2 focus-within:ring-[#CCCCFF]/30 transition-all">
            <FiSearch className="text-sm shrink-0 text-[#64748B]" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search equipment, bookings..."
              className="bg-transparent focus:outline-none text-xs text-[#0F172A] placeholder-[#64748B] w-40 focus:w-56 transition-all"
            />

          </div>

          {/* Real-time Search Dropdown */}
          {isSearchFocused && searchQuery.trim() && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E2E8F0] rounded-[16px] shadow-xl p-2 z-50">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0] flex justify-between items-center">
                <span>Search Results ({searchResults.length})</span>
                <span className="text-[10px] font-normal text-[#94A3B8]">Real-time</span>
              </div>
              {searchResults.length > 0 ? (
                <div className="py-1 max-h-64 overflow-y-auto">
                  {searchResults.map((item) => (
                    <button
                      key={`${item.type}-${item.id}`}
                      onClick={() => {
                        navigate(item.link);
                        setIsSearchFocused(false);
                        setSearchQuery('');
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-[#F8FAFC] rounded-[10px] transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <p className="text-xs font-semibold text-[#0F172A] group-hover:text-[#3B82F6] transition-colors">{item.title}</p>
                        <p className="text-[10px] text-[#64748B]">{item.subtitle}</p>
                      </div>
                      <span className="text-[10px] font-medium px-2 py-0.5 bg-[#F1F5F9] text-[#475569] rounded-full">
                        {item.type}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-[#64748B]">
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications Bell Dropdown */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className="relative p-2.5 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-[#CCCCFF]/20 transition-all cursor-pointer"
            aria-label="Notifications"
          >
            <FiBell className="text-lg" />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#EF4444] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none ring-2 ring-white">
                {unreadNotifCount}
              </span>
            )}
          </button>

          {/* Dropdown Panel */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E2E8F0] rounded-[16px] shadow-xl p-3 z-50">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Notifications</h3>
                  {unreadNotifCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-[#EF4444]/10 text-[#EF4444] rounded-full">
                      {unreadNotifCount} new
                    </span>
                  )}
                </div>
                {unreadNotifCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-[11px] font-semibold text-[#3B82F6] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <FiCheckCircle className="text-xs" /> Mark all read
                  </button>
                )}
              </div>

              {/* Notification Items List */}
              <div className="divide-y divide-[#E2E8F0] max-h-72 overflow-y-auto my-1">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`p-3 text-left hover:bg-[#F8FAFC] rounded-[12px] cursor-pointer transition-colors flex items-start gap-3 my-0.5 ${
                        !n.read ? 'bg-[#CCCCFF]/10' : ''
                      }`}
                    >
                      <div className="mt-1 shrink-0">
                        {!n.read ? (
                          <span className="w-2 h-2 rounded-full bg-[#EF4444] block"></span>
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-slate-300 block"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className={`text-xs ${!n.read ? 'font-bold text-[#0F172A]' : 'font-medium text-[#475569]'}`}>
                            {n.title}
                          </p>
                        </div>
                        <p className="text-[11px] text-[#64748B] mt-0.5 line-clamp-2">{n.message}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-xs text-[#64748B]">
                    No notifications available.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>



        {/* Customer Avatar & Profile */}
        <div
          onClick={() => navigate('/customer/profile')}
          className="flex items-center gap-3 pl-2 border-l border-[#E2E8F0] cursor-pointer group"
        >
          <img
            src={profile.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"}
            alt={profile.name}
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300";
            }}
            className="w-9 h-9 shrink-0 rounded-full object-cover ring-2 ring-[#CCCCFF] group-hover:ring-[#B8B8FF] transition-all"
          />
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-[#0F172A] leading-none group-hover:text-[#3B82F6] transition-colors">{profile.name}</p>
            <span className="text-[10px] font-medium text-[#64748B] flex items-center gap-1 mt-0.5">
              <FiUser className="text-[#3B82F6] text-[10px]" /> {profile.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CustomerNavbar;
