import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBriefcase, FiUser, FiMail, FiPhone, FiMapPin, FiHash, FiFileText, FiUpload, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';
import Button from '../../components/common/Button';
import { businessService, mediaService } from '../../services/api';
import { useOwner } from '../../context/OwnerContext';
import { useNavigate } from 'react-router-dom';

const RegisterBusiness = () => {
  const { business, businessLoading, refreshBusiness } = useOwner();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    gstNumber: '',
    description: '',
    aadharNumber: '',
    panNumber: '',
    bankAccountNumber: '',
    ifscCode: '',
    upiId: '',
  });
  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Pre-populate data if business exists (e.g. for correcting a rejected application)
  useEffect(() => {
    if (business) {
      setFormData({
        businessName: business.businessName || '',
        businessType: business.businessType || '',
        ownerName: business.ownerName || '',
        email: business.email || '',
        phone: business.phone || '',
        address: business.address || '',
        city: business.city || '',
        state: business.state || '',
        gstNumber: business.gstNumber || '',
        description: business.description || '',
        aadharNumber: business.aadharNumber || '',
        panNumber: business.panNumber || '',
        bankAccountNumber: business.bankAccountNumber || '',
        ifscCode: business.ifscCode || '',
        upiId: business.upiId || '',
      });
      // Note: we can't fully pre-populate File objects securely, so users have to re-upload documents
    }
  }, [business]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles([...files, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      // 1. Upload files to Cloudinary first
      const uploadedDocUrls = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await mediaService.uploadPhoto(formData);
        uploadedDocUrls.push(res.data.url);
      }

      // 2. Submit registration with real Cloudinary URLs
      const submissionData = {
        ...formData,
        documents: uploadedDocUrls
      };
      
      // POST to /api/business — ownerId attached from JWT on backend
      await businessService.register(submissionData);
      setSubmitted(true);
      await refreshBusiness(); // Reload business status in context
      navigate('/owner/business-status');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const businessTypes = [
    'Construction & Heavy Rigging',
    'Agriculture Machinery',
    'Industrial Equipment',
    'Logistics & Warehousing',
    'Media & Studio Production',
    'Events & Staging',
    'Mining Equipment',
    'Power & Energy',
    'Other'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A]">Register Your Business</h1>
        <p className="text-sm text-[#64748B] mt-1">Submit your business details and verification documents for platform approval.</p>
      </div>

      {/* Show existing business status if already registered */}
      {!businessLoading && business && !submitted && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 border rounded-[16px] flex items-center gap-3 ${
            business.status === 'Approved'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : business.status === 'Rejected'
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-amber-50 border-amber-200 text-amber-700'
          }`}
        >
          {business.status === 'Approved' ? (
            <FiCheckCircle className="text-xl shrink-0" />
          ) : business.status === 'Rejected' ? (
            <FiAlertCircle className="text-xl shrink-0" />
          ) : (
            <FiClock className="text-xl shrink-0" />
          )}
          <div>
            <p className="font-bold text-sm">{business.businessName} — {business.status}</p>
            {business.status === 'Rejected' && business.rejectionReason && (
              <p className="text-xs mt-0.5">Reason: {business.rejectionReason}. Edit and resubmit below.</p>
            )}
            {business.status === 'Pending' && (
              <p className="text-xs mt-0.5">Your application is being reviewed by admin.</p>
            )}
            {business.status === 'Approved' && (
              <p className="text-xs mt-0.5">Your business is verified. You can now list equipment.</p>
            )}
          </div>
        </motion.div>
      )}

      {/* Success Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-emerald-50 border border-emerald-200 text-[#22C55E] text-sm font-semibold rounded-[16px] flex items-center gap-2"
        >
          <FiCheckCircle className="text-lg" /> {message}
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-[16px] flex items-center gap-2"
        >
          <FiAlertCircle className="text-lg" /> {error}
        </motion.div>
      )}

      {/* Hide form if Approved */}
      {business?.status !== 'Approved' && (
        <>
          {/* Registration Form */}
          <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 md:p-8 shadow-xs">
        <div className="flex items-center gap-3 pb-5 border-b border-[#E2E8F0] mb-6">
          <div className="p-2.5 bg-[#CCCCFF]/40 text-[#0F172A] rounded-[12px]">
            <FiBriefcase className="text-xl" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">Business Information</h3>
            <p className="text-xs text-[#64748B]">Please fill in all required details accurately.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                <span className="flex items-center gap-1.5"><FiBriefcase className="text-[11px] text-[#64748B]" /> Business Name</span>
              </label>
              <input
                type="text"
                name="businessName"
                required
                value={formData.businessName}
                onChange={handleChange}
                placeholder="e.g. Titan Heavy Rentals Inc."
                className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[12px] text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5">Business Type</label>
              <select
                name="businessType"
                required
                value={formData.businessType}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[12px] text-sm text-[#0F172A] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30 appearance-none bg-white cursor-pointer"
              >
                <option value="">Select business type</option>
                {businessTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                <span className="flex items-center gap-1.5"><FiUser className="text-[11px] text-[#64748B]" /> Owner Name</span>
              </label>
              <input
                type="text"
                name="ownerName"
                required
                value={formData.ownerName}
                onChange={handleChange}
                placeholder="Full legal name"
                className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[12px] text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                <span className="flex items-center gap-1.5"><FiMail className="text-[11px] text-[#64748B]" /> Email Address</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="business@company.com"
                className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[12px] text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30"
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                <span className="flex items-center gap-1.5"><FiPhone className="text-[11px] text-[#64748B]" /> Phone Number</span>
              </label>
              <input
                type="text"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[12px] text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                <span className="flex items-center gap-1.5"><FiHash className="text-[11px] text-[#64748B]" /> GST Number</span>
              </label>
              <input
                type="text"
                name="gstNumber"
                required
                value={formData.gstNumber}
                onChange={handleChange}
                placeholder="GST-XX-XXXXXXX"
                className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[12px] text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30"
              />
            </div>
          </div>

          {/* KYC Information */}
          <div className="pt-4 border-t border-[#E2E8F0]">
            <h3 className="text-base font-bold text-[#0F172A] mb-4">KYC & Financial Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1.5">Aadhar Number</label>
                <input
                  type="text"
                  name="aadharNumber"
                  required
                  value={formData.aadharNumber}
                  onChange={handleChange}
                  placeholder="XXXX-XXXX-XXXX"
                  className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[12px] text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1.5">PAN Number</label>
                <input
                  type="text"
                  name="panNumber"
                  required
                  value={formData.panNumber}
                  onChange={handleChange}
                  placeholder="ABCDE1234F"
                  className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[12px] text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1.5">Bank Account Number</label>
                <input
                  type="text"
                  name="bankAccountNumber"
                  required
                  value={formData.bankAccountNumber}
                  onChange={handleChange}
                  placeholder="XXXXXXXXXXXXXX"
                  className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[12px] text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1.5">IFSC Code</label>
                <input
                  type="text"
                  name="ifscCode"
                  required
                  value={formData.ifscCode}
                  onChange={handleChange}
                  placeholder="SBIN0000001"
                  className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[12px] text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#0F172A] mb-1.5">UPI ID (For Deposits)</label>
                <input
                  type="text"
                  name="upiId"
                  required
                  value={formData.upiId}
                  onChange={handleChange}
                  placeholder="businessname@bank"
                  className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[12px] text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30"
                />
              </div>
            </div>
          </div>

          {/* Row 4 - Address */}
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
              <span className="flex items-center gap-1.5"><FiMapPin className="text-[11px] text-[#64748B]" /> Address</span>
            </label>
            <input
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              placeholder="Full street address"
              className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[12px] text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30"
            />
          </div>

          {/* Row 5 - City / State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5">City</label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Pune"
                className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[12px] text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5">State</label>
              <input
                type="text"
                name="state"
                required
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g. Maharashtra"
                className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[12px] text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
              <span className="flex items-center gap-1.5"><FiFileText className="text-[11px] text-[#64748B]" /> Business Description</span>
            </label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your business, specializations, and fleet details..."
              className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[12px] text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30 resize-none"
            />
          </div>

          {/* Document Upload */}
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
              <span className="flex items-center gap-1.5"><FiUpload className="text-[11px] text-[#64748B]" /> Verification Documents</span>
            </label>
            <p className="text-[11px] text-[#64748B] mb-3 font-medium">Please upload copies of your Aadhar card, PAN card, Bank Passbook, and any business license (PDF, JPG, PNG).</p>

            <div className="border-2 border-dashed border-[#E2E8F0] rounded-[16px] p-6 text-center hover:border-[#CCCCFF] transition-colors bg-[#F8FAFC]/50">
              <FiUpload className="mx-auto text-2xl text-[#94A3B8] mb-2" />
              <p className="text-xs text-[#64748B] mb-2">Drag and drop files here, or click to browse</p>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 bg-[#CCCCFF] hover:bg-[#B8B8FF] text-[#0F172A] text-xs font-semibold rounded-[10px] transition-colors">
                <FiUpload className="text-sm" /> Browse Files
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Uploaded Files List */}
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px]">
                    <div className="flex items-center gap-2">
                      <FiFileText className="text-[#64748B] text-sm" />
                      <span className="text-xs font-medium text-[#0F172A] truncate max-w-[200px]">{file.name}</span>
                      <span className="text-[10px] text-[#94A3B8]">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-xs text-[#EF4444] hover:underline font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4 border-t border-[#E2E8F0]">
            <Button variant="primary" type="submit" icon={FiBriefcase} size="lg" isLoading={loading}>
              Submit Registration
            </Button>
          </div>
        </form>
      </div>
      </>
      )}
    </motion.div>
  );
};

export default RegisterBusiness;
