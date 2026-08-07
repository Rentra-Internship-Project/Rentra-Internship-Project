import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiBriefcase, FiTruck, FiCalendar, FiAlertCircle, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../../components/admin/StatsCard';
import RecentActivity from '../../components/admin/RecentActivity';
import QuickActions from '../../components/admin/QuickActions';
import { mockStats, mockActivities } from '../../data/mockData';

const Dashboard = () => {
  const navigate = useNavigate();

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
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Platform Operations</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] mt-1">Welcome back, Victoria 👋</h1>
          <p className="text-xs md:text-sm text-[#64748B] mt-1">Here is what is happening across the Rentra Equipment Rental Marketplace today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/businesses')}
            className="px-4 py-2 bg-[#0F172A] text-white text-xs font-semibold rounded-[12px] hover:bg-slate-800 transition-all shadow-xs"
          >
            Review Pending Tasks ({mockStats.pendingVerifications + mockStats.pendingEquipmentApprovals})
          </button>
        </div>
      </div>

      {/* 1. Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Users"
          value={mockStats.totalUsers.toLocaleString()}
          change="14.2%"
          isPositive={true}
          icon={FiUsers}
          accentBg="bg-blue-50"
          iconColor="text-[#3B82F6]"
        />
        <StatsCard
          title="Total Businesses"
          value={mockStats.totalBusinesses.toLocaleString()}
          change="8.5%"
          isPositive={true}
          icon={FiBriefcase}
          accentBg="bg-emerald-50"
          iconColor="text-[#22C55E]"
        />
        <StatsCard
          title="Total Equipment"
          value={mockStats.totalEquipment.toLocaleString()}
          change="18.9%"
          isPositive={true}
          icon={FiTruck}
          accentBg="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatsCard
          title="Total Bookings"
          value={mockStats.totalBookings.toLocaleString()}
          change="22.4%"
          isPositive={true}
          icon={FiCalendar}
          accentBg="bg-amber-50"
          iconColor="text-[#F59E0B]"
        />
      </div>

      {/* 2. Pending Actions Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Pending Business Verification Alert */}
        <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-[16px] bg-amber-50 text-[#F59E0B] shrink-0">
              <FiAlertCircle className="text-2xl" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#0F172A]">Pending Business Verifications</h4>
              <p className="text-xs text-[#64748B] mt-0.5">
                <span className="font-bold text-[#0F172A]">{mockStats.pendingVerifications} business owners</span> waiting for identity document approvals.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/businesses')}
            className="p-2.5 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#CCCCFF]/30 text-[#0F172A] transition-colors shrink-0"
          >
            <FiArrowRight className="text-lg" />
          </button>
        </div>

        {/* Pending Equipment Approvals Alert */}
        <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-[16px] bg-blue-50 text-[#3B82F6] shrink-0">
              <FiAlertCircle className="text-2xl" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#0F172A]">Pending Equipment Approvals</h4>
              <p className="text-xs text-[#64748B] mt-0.5">
                <span className="font-bold text-[#0F172A]">{mockStats.pendingEquipmentApprovals} machinery listings</span> submitted for platform review.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/equipment')}
            className="p-2.5 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#CCCCFF]/30 text-[#0F172A] transition-colors shrink-0"
          >
            <FiArrowRight className="text-lg" />
          </button>
        </div>
      </div>

      {/* 3. Quick Actions */}
      <QuickActions />

      {/* 4. Recent Activities */}
      <RecentActivity activities={mockActivities} />
    </motion.div>
  );
};

export default Dashboard;
