import React from 'react';
import { motion } from 'framer-motion';
import { FiTruck, FiCalendar, FiClock, FiDollarSign, FiArrowRight, FiPlusCircle, FiSettings, FiEye, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../../components/owner/StatsCard';
import BookingCard from '../../components/owner/BookingCard';
import { ownerStats, ownerBookings, ownerEquipment, businessStatus } from '../../data/ownerMockData';

const Dashboard = () => {
  const navigate = useNavigate();

  const recentBookings = ownerBookings.slice(0, 3);
  const recentEquipment = ownerEquipment.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#CCCCFF]/40 via-white to-white border border-[#E2E8F0] rounded-[20px] p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Business Operations</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] mt-1">Welcome back, Alicia 👋</h1>
          <p className="text-xs md:text-sm text-[#64748B] mt-1">Here is a summary of your equipment, bookings, and revenue on the Rentra marketplace.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/owner/bookings')}
            className="px-4 py-2 bg-[#0F172A] text-white text-xs font-semibold rounded-[12px] hover:bg-slate-800 transition-all shadow-xs"
          >
            Pending Requests ({ownerStats.pendingRequests})
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Equipment"
          value={ownerStats.totalEquipment}
          change="16.8%"
          isPositive={true}
          icon={FiTruck}
          accentBg="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatsCard
          title="Active Bookings"
          value={ownerStats.activeBookings}
          change="25.0%"
          isPositive={true}
          icon={FiCalendar}
          accentBg="bg-blue-50"
          iconColor="text-[#3B82F6]"
        />
        <StatsCard
          title="Pending Requests"
          value={ownerStats.pendingRequests}
          icon={FiClock}
          accentBg="bg-amber-50"
          iconColor="text-[#F59E0B]"
        />
        <StatsCard
          title="Monthly Earnings"
          value={ownerStats.monthlyEarnings}
          change="18.4%"
          isPositive={true}
          icon={FiDollarSign}
          accentBg="bg-emerald-50"
          iconColor="text-[#22C55E]"
        />
      </div>

      {/* Business Verification Status Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`p-3.5 rounded-[16px] shrink-0 ${
            businessStatus.status === 'Approved' ? 'bg-green-50 text-[#22C55E]' :
            businessStatus.status === 'Pending' ? 'bg-amber-50 text-[#F59E0B]' :
            'bg-red-50 text-[#EF4444]'
          }`}>
            <FiCheckCircle className="text-2xl" />
          </div>
          <div>
            <h4 className="text-base font-bold text-[#0F172A]">Business Verification: {businessStatus.status}</h4>
            <p className="text-xs text-[#64748B] mt-0.5">
              <span className="font-bold text-[#0F172A]">{businessStatus.businessName}</span> — {businessStatus.businessType}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/owner/business-status')}
          className="p-2.5 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#CCCCFF]/30 text-[#0F172A] transition-colors shrink-0"
        >
          <FiArrowRight className="text-lg" />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 shadow-xs">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#64748B] mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Add Equipment', icon: FiPlusCircle, path: '/owner/add-equipment', bg: 'bg-purple-50', color: 'text-purple-600' },
            { label: 'Manage Equipment', icon: FiSettings, path: '/owner/equipment', bg: 'bg-blue-50', color: 'text-[#3B82F6]' },
            { label: 'View Bookings', icon: FiEye, path: '/owner/bookings', bg: 'bg-amber-50', color: 'text-[#F59E0B]' },
            { label: 'View Earnings', icon: FiTrendingUp, path: '/owner/earnings', bg: 'bg-emerald-50', color: 'text-[#22C55E]' },
          ].map((action) => {
            const ActionIcon = action.icon;
            return (
              <motion.button
                key={action.label}
                whileHover={{ y: -2 }}
                onClick={() => navigate(action.path)}
                className="flex flex-col items-center gap-2.5 p-4 rounded-[16px] border border-[#E2E8F0] hover:border-[#CCCCFF] bg-white hover:bg-[#F8FAFC] transition-all cursor-pointer"
              >
                <div className={`p-3 rounded-[12px] ${action.bg} ${action.color}`}>
                  <ActionIcon className="text-xl" />
                </div>
                <span className="text-xs font-semibold text-[#0F172A]">{action.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Recent Booking Requests */}
      <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#64748B]">Recent Booking Requests</h3>
          <button
            onClick={() => navigate('/owner/bookings')}
            className="text-xs font-semibold text-[#3B82F6] hover:underline flex items-center gap-1"
          >
            View All <FiArrowRight className="text-[11px]" />
          </button>
        </div>
        <div className="space-y-3">
          {recentBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      </div>

      {/* Recent Equipment Listings */}
      <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#64748B]">Recent Equipment Listings</h3>
          <button
            onClick={() => navigate('/owner/equipment')}
            className="text-xs font-semibold text-[#3B82F6] hover:underline flex items-center gap-1"
          >
            View All <FiArrowRight className="text-[11px]" />
          </button>
        </div>
        <div className="space-y-3">
          {recentEquipment.map((eq) => (
            <div
              key={eq.id}
              className="flex items-center gap-4 p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px] hover:border-[#CCCCFF] transition-colors"
            >
              <div className="w-14 h-14 rounded-[12px] overflow-hidden bg-white border border-[#E2E8F0] shrink-0">
                {eq.images[0] ? (
                  <img src={eq.images[0]} alt={eq.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl">🏗️</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#0F172A] truncate">{eq.name}</p>
                <p className="text-[11px] text-[#64748B]">{eq.category} • {eq.location} • ${eq.pricePerDay}/day</p>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                eq.status === 'Approved' ? 'bg-green-50 text-[#22C55E] border-green-100' :
                eq.status === 'Pending' ? 'bg-amber-50 text-[#F59E0B] border-amber-100' :
                'bg-red-50 text-[#EF4444] border-red-100'
              }`}>
                {eq.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
