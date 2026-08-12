import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiCalendar,
  FiClock,
  FiHeart,
  FiBell,
  FiTruck,
  FiArrowRight,
  FiUser,
  FiCheckCircle,
  FiSearch,
} from 'react-icons/fi';
import { useCustomer } from '../../context/CustomerContext';
import StatsCard from '../../components/customer/StatsCard';
import BookingCard from '../../components/customer/BookingCard';
import NotificationCard from '../../components/customer/NotificationCard';
import Button from '../../components/common/Button';

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    profile,
    equipmentList,
    wishlistEquipment,
    bookings,
    notifications,
    unreadNotifCount,
    markNotificationRead,
    deleteNotification,
    isInWishlist,
    toggleWishlist,
  } = useCustomer();

  const activeRentalsCount = bookings.filter(
    (b) => b.status?.toUpperCase() === 'ACTIVE' || b.status?.toUpperCase() === 'RENTAL ACTIVE'
  ).length;

  return (
    <div className="space-y-6">
      {/* Customer Welcome Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="panel-card p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-[#0F172A] text-white relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#CCCCFF]/20 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-[#CCCCFF] text-[#0F172A] text-xs font-bold rounded-full">
                Welcome back
              </span>
              <span className="text-xs text-slate-300">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Hello, {profile.name}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Manage your active heavy equipment rentals, track bookings in real-time, and discover available machinery from verified asset owners.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/customer/browse-equipment')}
              icon={FiTruck}
            >
              Browse Equipment
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/customer/bookings')}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              icon={FiCalendar}
            >
              My Bookings
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Bookings"
          value={bookings.length}
          icon={FiCalendar}
          change="+2 this month"
          trend="up"
          onClick={() => navigate('/customer/bookings')}
          accentBg="bg-[#CCCCFF]/40"
        />
        <StatsCard
          title="Active Rentals"
          value={activeRentalsCount}
          icon={FiClock}
          change="Machinery on site"
          trend="up"
          onClick={() => navigate('/customer/bookings')}
          accentBg="bg-[#22C55E]/20 text-[#22C55E]"
        />
        <StatsCard
          title="Wishlist Items"
          value={wishlistEquipment.length}
          icon={FiHeart}
          change="Saved equipment"
          trend="up"
          onClick={() => navigate('/customer/wishlist')}
          accentBg="bg-pink-100 text-pink-600"
        />
        <StatsCard
          title="Notifications"
          value={unreadNotifCount}
          icon={FiBell}
          change={unreadNotifCount > 0 ? `${unreadNotifCount} unread` : 'All read'}
          trend={unreadNotifCount > 0 ? 'up' : 'down'}
          onClick={() => navigate('/customer/notifications')}
          accentBg="bg-amber-100 text-amber-600"
        />
      </div>

      {/* Quick Actions Bar */}
      <div className="panel-card p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => navigate('/customer/browse-equipment')}
            className="flex items-center gap-3 p-3.5 rounded-[16px] bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#CCCCFF]/20 hover:border-[#CCCCFF] transition-all text-left cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-[12px] bg-[#CCCCFF] flex items-center justify-center text-[#0F172A] shrink-0 font-bold group-hover:scale-105 transition-transform">
              <FiTruck className="text-lg" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#0F172A]">Browse Equipment</p>
              <p className="text-[10px] text-[#64748B]">Explore marketplace</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/customer/bookings')}
            className="flex items-center gap-3 p-3.5 rounded-[16px] bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#CCCCFF]/20 hover:border-[#CCCCFF] transition-all text-left cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-[12px] bg-[#3B82F6]/20 flex items-center justify-center text-[#3B82F6] shrink-0 font-bold group-hover:scale-105 transition-transform">
              <FiCalendar className="text-lg" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#0F172A]">View Bookings</p>
              <p className="text-[10px] text-[#64748B]">Track status</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/customer/wishlist')}
            className="flex items-center gap-3 p-3.5 rounded-[16px] bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#CCCCFF]/20 hover:border-[#CCCCFF] transition-all text-left cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-[12px] bg-pink-100 flex items-center justify-center text-pink-600 shrink-0 font-bold group-hover:scale-105 transition-transform">
              <FiHeart className="text-lg" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#0F172A]">Saved Wishlist</p>
              <p className="text-[10px] text-[#64748B]">View favorites</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/customer/profile')}
            className="flex items-center gap-3 p-3.5 rounded-[16px] bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#CCCCFF]/20 hover:border-[#CCCCFF] transition-all text-left cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-[12px] bg-[#22C55E]/20 flex items-center justify-center text-[#22C55E] shrink-0 font-bold group-hover:scale-105 transition-transform">
              <FiUser className="text-lg" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#0F172A]">Update Profile</p>
              <p className="text-[10px] text-[#64748B]">Manage account</p>
            </div>
          </button>
        </div>
      </div>

      {/* Main Grid: Recent Bookings (Left) & Recent Notifications (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-[#0F172A]">Recent Bookings</h2>
              <p className="text-xs text-[#64748B]">Your latest rental reservations and active orders</p>
            </div>
            <Button
              variant="outline"
              size="xs"
              onClick={() => navigate('/customer/bookings')}
              icon={FiArrowRight}
            >
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {bookings.slice(0, 3).map((bk) => (
              <BookingCard key={bk.id} booking={bk} />
            ))}
          </div>
        </div>

        {/* Recent Notifications Widget */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-[#0F172A]">Activity Alerts</h2>
              <p className="text-xs text-[#64748B]">System notifications</p>
            </div>
            <Button
              variant="outline"
              size="xs"
              onClick={() => navigate('/customer/notifications')}
            >
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {notifications.slice(0, 3).map((notif) => (
              <NotificationCard
                key={notif.id}
                notification={notif}
                onMarkRead={markNotificationRead}
                onDelete={deleteNotification}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Equipment Section */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-extrabold text-[#0F172A]">Recommended Machinery & Assets</h2>
            <p className="text-xs text-[#64748B]">Verified equipment available for immediate rental dispatch</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/customer/browse-equipment')}
            icon={FiArrowRight}
          >
            Browse Marketplace
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {equipmentList.slice(0, 4).map((eq) => {
            const isWishlisted = isInWishlist(eq.id);
            return (
              <motion.div
                key={eq.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="panel-card overflow-hidden flex flex-col justify-between h-full group"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <img
                      src={eq.image}
                      alt={eq.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 text-[#0F172A] text-[11px] font-bold rounded-full">
                      {eq.category}
                    </span>
                    <button
                      onClick={() => toggleWishlist(eq.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                        isWishlisted ? 'bg-[#EF4444] text-white' : 'bg-white/80 hover:bg-white text-slate-700'
                      }`}
                    >
                      <FiHeart className={`text-sm ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-sm text-[#0F172A] line-clamp-1">{eq.name}</h4>
                    <p className="text-xs font-bold text-[#3B82F6] mt-1">₹{eq.pricePerDay.toLocaleString()} / day</p>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <Button
                    variant="primary"
                    size="xs"
                    onClick={() => navigate(`/customer/equipment/${eq.id}`)}
                    className="w-full"
                    icon={FiArrowRight}
                  >
                    View Details
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
