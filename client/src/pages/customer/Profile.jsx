import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase, FiShield, FiLock, FiCheckCircle, FiCalendar, FiHeart, FiClock, FiSave } from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';
import { useCustomer } from '../../context/CustomerContext';
import ProfileCard from '../../components/customer/ProfileCard';
import Button from '../../components/common/Button';
import { authService, mediaService } from '../../services/api';
import { DEFAULT_COVER_IMAGE } from '../../constants/assets';

const Profile = () => {
  const { profile, updateProfile, bookings, wishlistEquipment } = useCustomer();

  const [activeTab, setActiveTab] = useState('personal');

  // Form State
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    companyName: profile?.companyName || '',
    businessType: profile?.businessType || '',
    address: profile?.address || '',
    city: profile?.city || '',
    state: profile?.state || '',
    zip: profile?.zip || '',
    avatar: profile?.avatar || '',
    cover: profile?.cover || '',
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactor: profile?.security?.twoFactorEnabled || false,
    emailAlerts: profile?.security?.emailNotifications !== false,
    smsAlerts: profile?.security?.smsAlerts || false,
  });

  // Sync state when profile loads
  React.useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        companyName: profile.companyName || '',
        businessType: profile.businessType || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        zip: profile.zip || '',
        avatar: profile.avatar || '',
        cover: profile.cover || '',
      });
      setSecurityData(prev => ({
        ...prev,
        twoFactor: profile.security?.twoFactorEnabled || false,
        emailAlerts: profile.security?.emailNotifications !== false,
        smsAlerts: profile.security?.smsAlerts || false,
      }));
    }
  }, [profile]);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [securitySuccess, setSecuritySuccess] = useState(false);
  const [securityError, setSecurityError] = useState('');

  const handlePersonalSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    setSecurityError('');
    
    if (securityData.newPassword) {
      if (securityData.newPassword !== securityData.confirmPassword) {
        setSecurityError('New passwords do not match');
        return;
      }
      try {
        await authService.updatePassword({
          currentPassword: securityData.currentPassword,
          newPassword: securityData.newPassword,
        });
        setSecurityData({ ...securityData, currentPassword: '', newPassword: '', confirmPassword: '' });
        setSecuritySuccess(true);
        setTimeout(() => setSecuritySuccess(false), 3000);
      } catch (err) {
        setSecurityError(err.response?.data?.error || 'Failed to update password');
      }
    } else {
      // Just updating preferences
      setSecuritySuccess(true);
      setTimeout(() => setSecuritySuccess(false), 3000);
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Overview Card Banner */}
      <ProfileCard
        profile={profile}
        onUpdateCover={async (newCover) => {
          await updateProfile({ cover: newCover });
          setFormData((prev) => ({ ...prev, cover: newCover }));
        }}
      />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('personal')}
          className={`px-4 py-2 text-xs font-bold rounded-[12px] transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'personal'
              ? 'bg-[#CCCCFF] text-[#0F172A] shadow-xs'
              : 'text-[#64748B] hover:bg-[#F8FAFC]'
          }`}
        >
          <FiUser /> Personal Information
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 text-xs font-bold rounded-[12px] transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'security'
              ? 'bg-[#CCCCFF] text-[#0F172A] shadow-xs'
              : 'text-[#64748B] hover:bg-[#F8FAFC]'
          }`}
        >
          <FiLock /> Security & Notifications
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 text-xs font-bold rounded-[12px] transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'stats'
              ? 'bg-[#CCCCFF] text-[#0F172A] shadow-xs'
              : 'text-[#64748B] hover:bg-[#F8FAFC]'
          }`}
        >
          <FiCalendar /> Booking Statistics
        </button>
      </div>

      {/* TAB 1: PERSONAL INFORMATION */}
      {activeTab === 'personal' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="panel-card p-6 space-y-6"
        >
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
            <div>
              <h3 className="text-base font-extrabold text-[#0F172A]">Edit Personal Details</h3>
              <p className="text-xs text-[#64748B]">Update your primary contact information and business credentials.</p>
            </div>
            {saveSuccess && (
              <span className="px-3 py-1 bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 rounded-full text-xs font-bold flex items-center gap-1.5 animate-pulse">
                <FiCheckCircle /> Profile Saved Successfully!
              </span>
            )}
          </div>

          <form onSubmit={handlePersonalSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="form-input"
                />
              </div>

              <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="form-label !mb-0">Profile Avatar</label>
                    <label className="text-[11px] font-semibold text-[#3B82F6] hover:underline cursor-pointer">
                      Upload File
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const fd = new FormData();
                            fd.append('file', file);
                            fd.append('filename', file.name);
                            const res = await mediaService.uploadPhoto(fd);
                            if (res.data?.url) {
                              setFormData((prev) => ({ ...prev, avatar: res.data.url }));
                            }
                          } catch (err) {
                            alert('Failed to upload avatar.');
                          }
                        }}
                      />
                    </label>
                  </div>
                  <input
                    type="url"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    className="form-input"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="form-label !mb-0">Cover Banner</label>
                    <div className="flex items-center gap-2">
                      <label className="text-[11px] font-semibold text-[#3B82F6] hover:underline cursor-pointer">
                        Upload File
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/jpg"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              const fd = new FormData();
                              fd.append('file', file);
                              fd.append('filename', file.name);
                              const res = await mediaService.uploadPhoto(fd);
                              if (res.data?.url) {
                                setFormData((prev) => ({ ...prev, cover: res.data.url }));
                              }
                            } catch (err) {
                              alert('Failed to upload cover banner.');
                            }
                          }}
                        />
                      </label>
                      <span className="text-[#E2E8F0]">|</span>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, cover: DEFAULT_COVER_IMAGE }))}
                        className="text-[11px] font-semibold text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                      >
                        Reset Default
                      </button>
                    </div>
                  </div>
                  <input
                    type="url"
                    value={formData.cover}
                    onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
                    className="form-input"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Company Name</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="form-label">Street Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">State & Zip Code</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="form-input"
                    placeholder="State"
                  />
                  <input
                    type="text"
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className="form-input"
                    placeholder="Zip Code"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#E2E8F0]">
              <Button type="submit" variant="primary" size="md" icon={FiSave}>
                Save Changes
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* TAB 2: SECURITY & NOTIFICATIONS */}
      {activeTab === 'security' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="panel-card p-6 space-y-6"
        >
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
            <div>
              <h3 className="text-base font-extrabold text-[#0F172A]">Security Settings</h3>
              <p className="text-xs text-[#64748B]">Manage your account password, 2FA authentication, and notification preferences.</p>
            </div>
            {securitySuccess && (
              <span className="px-3 py-1 bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 rounded-full text-xs font-bold flex items-center gap-1.5 animate-pulse">
                <FiCheckCircle /> Settings Saved!
              </span>
            )}
          </div>

          {securityError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-[12px] flex items-center gap-2">
              <FiLock className="text-base" /> {securityError}
            </div>
          )}

          <form onSubmit={handleSecuritySubmit} className="space-y-6">
            {/* Password Fields - Hidden for Google Auth Users */}
            {profile?.authProvider !== 'google' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Change Password</h4>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={securityData.currentPassword}
                      onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={securityData.newPassword}
                      onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={securityData.confirmPassword}
                      onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[16px]">
                <h4 className="text-xs font-bold text-[#0F172A] mb-1">Google Authentication</h4>
                <p className="text-[11px] text-[#64748B]">
                  Your account is secured via Google OAuth. You do not need a password to sign in.
                </p>
              </div>
            )}

            {/* Toggles */}
            <div className="space-y-4 pt-4 border-t border-[#E2E8F0]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Account Preferences</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 bg-[#F8FAFC] rounded-[16px] border border-[#E2E8F0]">
                  <div>
                    <p className="text-xs font-bold text-[#0F172A]">Two-Factor Authentication (2FA)</p>
                    <p className="text-[11px] text-[#64748B]">Require SMS security code during sign in.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={securityData.twoFactor}
                    onChange={(e) => setSecurityData({ ...securityData, twoFactor: e.target.checked })}
                    className="w-5 h-5 accent-[#0F172A] rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-[#F8FAFC] rounded-[16px] border border-[#E2E8F0]">
                  <div>
                    <p className="text-xs font-bold text-[#0F172A]">Email Booking Notifications</p>
                    <p className="text-[11px] text-[#64748B]">Receive email alerts for booking confirmation & status updates.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={securityData.emailAlerts}
                    onChange={(e) => setSecurityData({ ...securityData, emailAlerts: e.target.checked })}
                    className="w-5 h-5 accent-[#0F172A] rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-[#F8FAFC] rounded-[16px] border border-[#E2E8F0]">
                  <div>
                    <p className="text-xs font-bold text-[#0F172A]">SMS Delivery Alerts</p>
                    <p className="text-[11px] text-[#64748B]">Receive SMS when machinery is dispatched to job site.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={securityData.smsAlerts}
                    onChange={(e) => setSecurityData({ ...securityData, smsAlerts: e.target.checked })}
                    className="w-5 h-5 accent-[#0F172A] rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#E2E8F0]">
              <Button type="submit" variant="primary" size="md" icon={FiLock}>
                Save Security Settings
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* TAB 3: BOOKING STATISTICS & ACTIVITY LOG */}
      {activeTab === 'stats' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="panel-card p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-[12px] bg-[#CCCCFF] flex items-center justify-center text-[#0F172A] font-bold">
                  <FaRupeeSign className="text-lg" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#94A3B8]">Total Expenditure</p>
                  <p className="text-xl font-extrabold text-[#0F172A]">{profile.stats?.totalSpent || '₹0'}</p>
                </div>
              </div>
              <p className="text-[11px] text-[#64748B]">Across {bookings?.length || 0} total equipment bookings</p>
            </div>

            <div className="panel-card p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-[12px] bg-[#22C55E]/20 flex items-center justify-center text-[#22C55E] font-bold">
                  <FiClock className="text-lg" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#94A3B8]">Active Equipment</p>
                  <p className="text-xl font-extrabold text-[#0F172A]">{(bookings || []).filter(b => b.status === 'Active').length} Rentals</p>
                </div>
              </div>
              <p className="text-[11px] text-[#64748B]">Currently deployed on job sites</p>
            </div>

            <div className="panel-card p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-[12px] bg-pink-100 flex items-center justify-center text-pink-600 font-bold">
                  <FiHeart className="text-lg" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#94A3B8]">Saved Wishlist</p>
                  <p className="text-xl font-extrabold text-[#0F172A]">{wishlistEquipment?.length || 0} Items</p>
                </div>
              </div>
              <p className="text-[11px] text-[#64748B]">Machinery saved for quick booking</p>
            </div>
          </div>

          {/* Activity Log List */}
          <div className="panel-card p-6 space-y-4">
            <h3 className="text-base font-extrabold text-[#0F172A] border-b border-[#E2E8F0] pb-3">
              Recent Account Activity
            </h3>
            <div className="divide-y divide-[#E2E8F0]">
              {(profile?.activityLog || []).map((act) => (
                <div key={act.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                    <span className="font-semibold text-[#0F172A]">{act.action}</span>
                  </div>
                  <span className="text-[#94A3B8] font-medium">{act.date}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Profile;
