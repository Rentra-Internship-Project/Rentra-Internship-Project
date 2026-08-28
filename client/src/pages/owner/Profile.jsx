import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiUser,
  FiLock,
  FiActivity,
  FiCheckCircle,
  FiSave,
  FiTruck,
  FiCalendar,
  FiZap
} from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';
import ProfileCard from '../../components/owner/ProfileCard';
import StatsCard from '../../components/owner/StatsCard';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useOwner } from '../../context/OwnerContext';
import { authService } from '../../services/api';

const Profile = () => {
  const { user, setUser } = useAuth();
  const { ownerStats, business } = useOwner();
  
  const profile = {
    name: user?.name || 'Owner',
    email: user?.email || '',
    phone: user?.phone || '',
    businessName: business?.businessName || user?.companyName || 'My Business',
    gstNumber: business?.gstNumber || 'PENDING',
    address: business?.address || user?.address || 'HQ',
    city: business?.city || user?.city || 'Local',
    state: business?.state || user?.state || 'State',
    joinedDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : 'Recently',
    avatar: user?.avatar,
    cover: user?.cover,
    stats: {
      totalEquipment: ownerStats?.totalEquipment || 0,
      activeBookings: ownerStats?.activeBookings || 0,
      completedBookings: ownerStats?.totalEquipment || 0,
      totalEarnings: ownerStats?.monthlyEarnings || '₹0',
    },
    recentActivity: []
  };

  // Personal Info Form
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);

  // Sync state when user loads
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  // Password Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Messages
  const [infoMessage, setInfoMessage] = useState('');
  const [passMessage, setPassMessage] = useState('');

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.updateProfile({ name, phone });
      if (setUser) setUser(res.data.user);
      setInfoMessage('Personal information updated successfully!');
    } catch (err) {
      setInfoMessage('Failed to update information.');
    }
    setTimeout(() => setInfoMessage(''), 3000);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setPassMessage('Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassMessage('New passwords do not match!');
      return;
    }
    try {
      await authService.updatePassword({ currentPassword, newPassword });
      setPassMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPassMessage(err.response?.data?.error || 'Failed to update password');
    }
    setTimeout(() => setPassMessage(''), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* 1. Profile Header */}
      <ProfileCard profile={profile} />

      {/* 2. Account Statistics */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#64748B] mb-4">
          Account Performance Statistics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatsCard
            title="Total Equipment"
            value={profile.stats.totalEquipment}
            icon={FiTruck}
            accentBg="bg-purple-50"
            iconColor="text-purple-600"
          />
          <StatsCard
            title="Active Bookings"
            value={profile.stats.activeBookings}
            icon={FiCalendar}
            accentBg="bg-blue-50"
            iconColor="text-[#3B82F6]"
          />
          <StatsCard
            title="Completed Bookings"
            value={profile.stats.completedBookings}
            icon={FiZap}
            accentBg="bg-amber-50"
            iconColor="text-[#F59E0B]"
          />
          <StatsCard
            title="Total Earned"
            value={profile.stats.totalEarnings}
            icon={FaRupeeSign}
            accentBg="bg-emerald-50"
            iconColor="text-[#22C55E]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* 3. Personal Information Form */}
          <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 shadow-xs">
            <div className="flex items-center gap-3 pb-4 border-b border-[#E2E8F0] mb-5">
              <div className="p-2.5 bg-[#CCCCFF]/40 text-[#0F172A] rounded-[12px]">
                <FiUser className="text-xl" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">Personal Information</h3>
                <p className="text-xs text-[#64748B]">Update your contact and bio details.</p>
              </div>
            </div>

            {infoMessage && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-[#22C55E] text-xs font-semibold rounded-[12px] flex items-center gap-2">
                <FiCheckCircle className="text-base" /> {infoMessage}
              </div>
            )}

            <form onSubmit={handleUpdateInfo} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[12px] text-xs text-[#0F172A] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Email Address</label>
                  <input
                    type="email"
                    readOnly
                    value={profile.email}
                    className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[12px] text-xs text-[#64748B] bg-[#F8FAFC] cursor-not-allowed"
                    title="Email cannot be changed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[12px] text-xs text-[#0F172A] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="primary" type="submit" icon={FiSave}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>


          {/* 4. Security Settings */}
          <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 shadow-xs">
            <div className="flex items-center gap-3 pb-4 border-b border-[#E2E8F0] mb-5">
              <div className="p-2.5 bg-amber-50 text-[#F59E0B] rounded-[12px]">
                <FiLock className="text-xl" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">Security & Credentials</h3>
                <p className="text-xs text-[#64748B]">Update your account password.</p>
              </div>
            </div>

            {passMessage && (
              <div
                className={`mb-4 p-3 border text-xs font-semibold rounded-[12px] flex items-center gap-2 ${
                  passMessage.includes('successfully')
                    ? 'bg-emerald-50 border-emerald-200 text-[#22C55E]'
                    : 'bg-rose-50 border-rose-200 text-[#EF4444]'
                }`}
              >
                <FiCheckCircle className="text-base" /> {passMessage}
              </div>
            )}

            {user?.authProvider !== 'google' ? (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[12px] text-xs text-[#0F172A] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[12px] text-xs text-[#0F172A] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[12px] text-xs text-[#0F172A] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button variant="warning" type="submit" icon={FiLock}>
                    Update Password
                  </Button>
                </div>
              </form>
            ) : (
              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[16px]">
                <h4 className="text-xs font-bold text-[#0F172A] mb-1">Google Authentication</h4>
                <p className="text-[11px] text-[#64748B]">
                  Your account is secured via Google OAuth. You do not need a password to sign in.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Activity */}
        <div className="space-y-6">
          {/* Business Information */}
          <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 shadow-xs">
            <div className="flex items-center gap-3 pb-4 border-b border-[#E2E8F0] mb-4">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-[12px]">
                <FiTruck className="text-xl" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">Business Information</h3>
                <p className="text-xs text-[#64748B]">Your registered business details</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                ['Business Name', profile.businessName],
                ['GST Number', profile.gstNumber],
                ['Address', profile.address],
                ['Location', `${profile.city}, ${profile.state}`],
                ['Member Since', profile.joinedDate],
              ].map(([label, value]) => (
                <div key={label} className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">{label}</p>
                  <p className="text-xs font-semibold text-[#0F172A] mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 shadow-xs">
            <div className="flex items-center gap-3 pb-4 border-b border-[#E2E8F0] mb-4">
              <div className="p-2.5 bg-blue-50 text-[#3B82F6] rounded-[12px]">
                <FiActivity className="text-xl" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">Recent Activity</h3>
                <p className="text-xs text-[#64748B]">Your recent actions on Rentra</p>
              </div>
            </div>

            <div className="space-y-3">
              {profile.recentActivity.map((act) => (
                <div
                  key={act.id}
                  className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] hover:border-[#CCCCFF] transition-colors"
                >
                  <p className="text-xs font-semibold text-[#0F172A]">{act.action}</p>
                  <span className="text-[10px] text-[#64748B] mt-1 block">{act.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
