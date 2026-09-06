import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiBell, FiSearch, FiShield, FiCheckCircle } from 'react-icons/fi';
import { notificationService } from '../../services/api';
import { useAdminContext } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import { mockCategories } from '../../data/adminMockData';

const pageTitles = {
  '/admin/dashboard': 'Platform Overview',
  '/admin/users': 'User Management',
  '/admin/businesses': 'Business Verifications',
  '/admin/equipment': 'Equipment Moderation',
  '/admin/categories': 'Category Management',
  '/admin/bookings': 'Rental Bookings Monitor',
  '/admin/profile': 'Administrator Profile',
};

const AdminNavbar = ({ setMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentTitle = pageTitles[location.pathname] || 'Admin Dashboard';

  // Search Bar State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Notification Bell State
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Refs for Outside Click Listeners
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const notifRef = useRef(null);

  const { users, businesses, equipmentList, bookings } = useAdminContext();

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await notificationService.getAll();
        setNotifications(res.data?.notifications || []);
      } catch (err) {
        console.error('Failed to fetch admin notifications:', err);
      }
    };
    fetchNotifs();
  }, []);

  // Calculate Unread Notification Count
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // Real-time Search Filter logic across marketplace entities
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const results = [];

    (users || []).forEach((u) => {
      if ((u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q)) {
        results.push({ id: u.id, title: u.name, subtitle: `User • ${u.role}`, type: 'User', link: '/admin/users' });
      }
    });

    (businesses || []).forEach((b) => {
      if ((b.businessName || '').toLowerCase().includes(q) || (b.ownerName || '').toLowerCase().includes(q)) {
        results.push({ id: b.id, title: b.businessName, subtitle: `Business • ${b.businessType}`, type: 'Business', link: '/admin/businesses' });
      }
    });

    (equipmentList || []).forEach((eq) => {
      if ((eq.name || '').toLowerCase().includes(q) || (eq.category || '').toLowerCase().includes(q)) {
        results.push({ id: eq.id || eq._id, title: eq.name, subtitle: `Equipment • ${eq.category}`, type: 'Equipment', link: '/admin/equipment' });
      }
    });

    (mockCategories || []).forEach((cat) => {
      if ((cat.name || '').toLowerCase().includes(q) || (cat.description || '').toLowerCase().includes(q)) {
        results.push({ id: cat.id, title: cat.name, subtitle: `Category`, type: 'Category', link: '/admin/categories' });
      }
    });

    (bookings || []).forEach((bk) => {
      if ((bk.id || bk._id || '').toLowerCase().includes(q) || (bk.customer || '').toLowerCase().includes(q)) {
        results.push({ id: bk.id || bk._id, title: bk.id || bk._id, subtitle: `Booking • ${bk.customer}`, type: 'Booking', link: '/admin/bookings' });
      }
    });

    return results.slice(0, 6);
  }, [searchQuery, users, businesses, equipmentList, bookings]);

  // Handle Outside Clicks
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
    try {
      await notificationService.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setIsNotifOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAsRead = async (id, link) => {
    try {
      await notificationService.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id || n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
    setIsNotifOpen(false);
    if (link) navigate(link);
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
              placeholder="Quick search..."
              className="bg-transparent focus:outline-none text-xs text-[#0F172A] placeholder-[#64748B] w-36 focus:w-48 transition-all"
            />

          </div>

          {/* Real-time Search Results Dropdown */}
          {isSearchFocused && searchQuery.trim() && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E2E8F0] rounded-[16px] shadow-xl p-2 z-50">
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
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#EF4444] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {isNotifOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 sm:w-80 max-w-[80vw] bg-white border border-[#E2E8F0] rounded-[16px] shadow-xl p-3 z-50 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-[#EF4444]/10 text-[#EF4444] rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
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
                      key={n._id || n.id}
                      onClick={() => handleMarkAsRead(n._id || n.id, n.link)}
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
                          <span className="text-[10px] text-[#94A3B8] shrink-0">
                            {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : n.time}
                          </span>
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

        {/* Admin Avatar & Role */}
        <div 
          onClick={() => navigate('/admin/profile')}
          className="flex items-center gap-3 pl-2 border-l border-[#E2E8F0] cursor-pointer hover:opacity-80 transition-opacity"
        >
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150"}
            alt={user?.name || "Admin"}
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150";
            }}
            className="w-9 h-9 shrink-0 aspect-square rounded-full object-cover ring-2 ring-[#CCCCFF]"
          />
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-[#0F172A] leading-none">{user?.name || "System Admin"}</p>
            <span className="text-[10px] font-medium text-[#64748B] flex items-center gap-1 mt-0.5">
              <FiShield className="text-[#3B82F6] text-[10px]" /> Super Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};


export default AdminNavbar;
