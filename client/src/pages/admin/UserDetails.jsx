import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, 
  FiBriefcase, FiFileText, FiCreditCard, FiAlertCircle, FiCheckCircle
} from 'react-icons/fi';
import { adminService } from '../../services/api';
import StatusBadge from '../../components/admin/StatusBadge';

const UserDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await adminService.getUserDetails(id);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch user details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B82F6]"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-red-500">
        <FiAlertCircle className="w-12 h-12 mb-4" />
        <h2 className="text-xl font-bold">Error Loading Details</h2>
        <p className="text-sm">{error}</p>
        <Link to="/admin/users" className="mt-4 text-[#3B82F6] hover:underline">
          &larr; Back to Users
        </Link>
      </div>
    );
  }

  const { user, business } = data;
  const isOwner = user.role === 'OWNER';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-5xl mx-auto pb-10"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/admin/users"
          className="p-2 bg-white border border-[#E2E8F0] rounded-full text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
        >
          <FiArrowLeft className="text-xl" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">User Details</h1>
          <p className="text-xs text-[#64748B] mt-0.5">ID: {user.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]"></div>
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-[#E0E7FF] text-[#3B82F6] flex items-center justify-center text-3xl font-bold mb-4 shadow-inner">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-[#0F172A]">{user.name}</h2>
              <div className="mt-2 flex items-center justify-center gap-2">
                <span className="px-2.5 py-1 bg-[#F1F5F9] text-[#475569] text-[10px] font-bold uppercase tracking-wider rounded-md">
                  {user.role}
                </span>
                <StatusBadge status={user.status} />
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-[#F8FAFC] flex items-center justify-center text-[#64748B] shrink-0">
                  <FiMail />
                </div>
                <div className="truncate">
                  <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Email</p>
                  <p className="text-[#0F172A] font-medium truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-[#F8FAFC] flex items-center justify-center text-[#64748B] shrink-0">
                  <FiPhone />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Phone</p>
                  <p className="text-[#0F172A] font-medium">{user.phone || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-[#F8FAFC] flex items-center justify-center text-[#64748B] shrink-0">
                  <FiCalendar />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Joined</p>
                  <p className="text-[#0F172A] font-medium">{new Date(user.joinedDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Business / Additional Info */}
        <div className="lg:col-span-2 space-y-6">
          {!isOwner && (
            <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-8 shadow-xs h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-[#F8FAFC] rounded-full flex items-center justify-center mb-4">
                <FiUser className="text-2xl text-[#94A3B8]" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">Customer Profile</h3>
              <p className="text-sm text-[#64748B] mt-2 max-w-xs mx-auto">
                This user is a customer and does not have a registered business profile.
              </p>
            </div>
          )}

          {isOwner && !business && (
            <div className="bg-amber-50 border border-amber-200 rounded-[20px] p-6 shadow-xs">
              <div className="flex gap-3">
                <FiAlertCircle className="text-amber-500 text-xl shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-amber-800">Incomplete Profile</h3>
                  <p className="text-xs text-amber-700 mt-1">This user registered as an Owner but has not submitted their business verification details yet.</p>
                </div>
              </div>
            </div>
          )}

          {isOwner && business && (
            <>
              {/* Business Overview */}
              <div className="bg-white border border-[#E2E8F0] rounded-[20px] overflow-hidden shadow-xs">
                <div className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiBriefcase className="text-[#3B82F6]" />
                    <h2 className="text-base font-bold text-[#0F172A]">Company Details</h2>
                  </div>
                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                    business.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                    business.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {business.status}
                  </span>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1">Business Name</p>
                    <p className="text-[#0F172A] font-semibold">{business.businessName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1">Category</p>
                    <p className="text-[#0F172A] font-semibold">{business.businessType || 'General Equipment'}</p>
                  </div>
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                    <div>
                      <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1">Registration Number</p>
                      <p className="text-[#0F172A] font-mono font-semibold">{business.registrationNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1">GST Number</p>
                      <p className="text-[#0F172A] font-mono font-semibold">{business.gstNumber || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="md:col-span-2 flex items-start gap-2 pt-2 border-t border-[#E2E8F0]">
                    <FiMapPin className="text-[#64748B] mt-1 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1">Registered Address</p>
                      <p className="text-[#0F172A] text-sm">
                        {business.address}<br />
                        {business.city}, {business.state} {business.pincode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legal & Documents */}
              <div className="bg-white border border-[#E2E8F0] rounded-[20px] overflow-hidden shadow-xs">
                <div className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4 flex items-center gap-2">
                  <FiFileText className="text-[#8B5CF6]" />
                  <h2 className="text-base font-bold text-[#0F172A]">Legal Documents</h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Aadhar Number</p>
                      <p className="text-sm font-mono text-[#0F172A] mt-0.5">{business.aadharNumber || 'Not Provided'}</p>
                    </div>
                    {business.documents?.aadhar && (
                      <a href={business.documents.aadhar} target="_blank" rel="noreferrer" className="text-xs text-[#3B82F6] hover:underline font-semibold">View</a>
                    )}
                  </div>
                  <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">PAN Number</p>
                      <p className="text-sm font-mono text-[#0F172A] mt-0.5">{business.panNumber || 'Not Provided'}</p>
                    </div>
                    {business.documents?.pan && (
                      <a href={business.documents.pan} target="_blank" rel="noreferrer" className="text-xs text-[#3B82F6] hover:underline font-semibold">View</a>
                    )}
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="bg-white border border-[#E2E8F0] rounded-[20px] overflow-hidden shadow-xs">
                <div className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4 flex items-center gap-2">
                  <FiCreditCard className="text-[#10B981]" />
                  <h2 className="text-base font-bold text-[#0F172A]">Bank Details</h2>
                </div>
                <div className="p-6">
                  {business.bankAccountNumber || business.upiId ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                      <div>
                        <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Account Name</p>
                        <p className="text-sm font-semibold text-[#0F172A]">{business.ownerName}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">UPI ID</p>
                        <p className="text-sm font-semibold text-[#0F172A]">{business.upiId || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Account Number</p>
                        <p className="text-sm font-mono font-semibold text-[#0F172A]">{business.bankAccountNumber || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">IFSC Code</p>
                        <p className="text-sm font-mono font-semibold text-[#0F172A]">{business.ifscCode || 'N/A'}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-[#64748B] italic">No bank details provided.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default UserDetails;
