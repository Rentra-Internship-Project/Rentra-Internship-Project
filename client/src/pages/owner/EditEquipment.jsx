import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiTruck, FiMapPin, FiDollarSign, FiTag, FiFileText, FiUpload, FiCheckCircle, FiArrowLeft, FiSave } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import { ownerEquipment } from '../../data/ownerMockData';

const EditEquipment = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Find equipment by ID or use first as fallback
  const equipmentData = ownerEquipment.find((eq) => eq.id === id) || ownerEquipment[0];

  const [formData, setFormData] = useState({
    name: equipmentData.name,
    category: equipmentData.category,
    description: equipmentData.description,
    location: equipmentData.location,
    pricePerDay: equipmentData.pricePerDay.toString(),
    availability: equipmentData.availability,
    operatorAvailable: equipmentData.operatorAvailable ?? true,
    operatorDailyRate: (equipmentData.operatorDailyRate || 150).toString(),
  });
  const [message, setMessage] = useState('');

  const categories = ['Construction', 'Agriculture', 'Industrial', 'Logistics', 'Media Production', 'Events', 'Mining', 'Power & Energy'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('Equipment updated successfully!');
    setTimeout(() => setMessage(''), 5000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/owner/equipment')}
          className="p-2 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#CCCCFF]/20 text-[#0F172A] transition-colors"
        >
          <FiArrowLeft className="text-lg" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Edit Equipment</h1>
          <p className="text-sm text-[#64748B] mt-0.5">Update listing details for <span className="font-semibold text-[#0F172A]">{equipmentData.name}</span></p>
        </div>
      </div>

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

      {/* Equipment Preview */}
      {equipmentData.images[0] && (
        <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-4 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-[14px] overflow-hidden bg-[#F8FAFC] border border-[#E2E8F0] shrink-0">
              <img src={equipmentData.images[0]} alt={equipmentData.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Currently Editing</p>
              <h3 className="text-base font-bold text-[#0F172A] mt-0.5">{equipmentData.name}</h3>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="text-xs text-[#64748B]">ID: {equipmentData.id}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  equipmentData.status === 'Approved' ? 'bg-green-50 text-[#22C55E]' :
                  equipmentData.status === 'Pending' ? 'bg-amber-50 text-[#F59E0B]' :
                  'bg-red-50 text-[#EF4444]'
                }`}>{equipmentData.status}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 md:p-8 shadow-xs">
        <div className="flex items-center gap-3 pb-5 border-b border-[#E2E8F0] mb-6">
          <div className="p-2.5 bg-blue-50 text-[#3B82F6] rounded-[12px]">
            <FiTruck className="text-xl" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">Update Equipment Details</h3>
            <p className="text-xs text-[#64748B]">Modify the information below and save changes.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                <span className="flex items-center gap-1.5"><FiTruck className="text-[11px] text-[#64748B]" /> Equipment Name</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[12px] text-sm text-[#0F172A] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                <span className="flex items-center gap-1.5"><FiTag className="text-[11px] text-[#64748B]" /> Category</span>
              </label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[12px] text-sm text-[#0F172A] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30 appearance-none bg-white cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
              <span className="flex items-center gap-1.5"><FiFileText className="text-[11px] text-[#64748B]" /> Description</span>
            </label>
            <textarea
              name="description"
              rows="4"
              required
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[12px] text-sm text-[#0F172A] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30 resize-none"
            />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                <span className="flex items-center gap-1.5"><FiMapPin className="text-[11px] text-[#64748B]" /> Location</span>
              </label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[12px] text-sm text-[#0F172A] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                <span className="flex items-center gap-1.5"><FiDollarSign className="text-[11px] text-[#64748B]" /> Price Per Day ($)</span>
              </label>
              <input
                type="number"
                name="pricePerDay"
                required
                min="1"
                value={formData.pricePerDay}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[12px] text-sm text-[#0F172A] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5">Availability</label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[12px] text-sm text-[#0F172A] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30 appearance-none bg-white cursor-pointer"
              >
                <option value="Available">Available</option>
                <option value="Rented">Rented</option>
                <option value="Maintenance">Under Maintenance</option>
              </select>
            </div>
          </div>

          {/* Certified Operator Option */}
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-[16px] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-bold text-[#0F172A] text-xs block">Certified Skilled Operator Option</label>
                <p className="text-[11px] text-[#64748B]">Provide a qualified, licensed driver with this equipment</p>
              </div>
              <input
                type="checkbox"
                name="operatorAvailable"
                checked={formData.operatorAvailable}
                onChange={(e) => setFormData({ ...formData, operatorAvailable: e.target.checked })}
                className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
              />
            </div>

            {formData.operatorAvailable && (
              <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between gap-4">
                <label className="text-xs font-semibold text-[#0F172A]">Driver Daily Surcharge ($/day):</label>
                <input
                  type="number"
                  name="operatorDailyRate"
                  value={formData.operatorDailyRate}
                  onChange={handleChange}
                  placeholder="150"
                  className="w-32 px-3 py-1.5 border border-[#E2E8F0] rounded-[10px] text-xs font-bold text-[#0F172A] bg-white"
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
            <Button variant="secondary" onClick={() => navigate('/owner/equipment')}>Cancel</Button>
            <Button variant="primary" type="submit" icon={FiSave}>Save Changes</Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditEquipment;
