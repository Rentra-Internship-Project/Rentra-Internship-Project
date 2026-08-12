import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiTruck, FiMapPin, FiDollarSign, FiTag, FiFileText, FiUpload, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import api from '../../services/api';
import { mediaService } from '../../services/api';
const AddEquipment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    location: '',
    pricePerDay: '',
    availability: 'Available',
    operatorAvailable: true,
    operatorDailyRate: '150',
  });
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = ['Earthmoving', 'Material Handling', 'Road Construction', 'Hauling', 'Lifting Equipment', 'Compaction', 'Construction', 'Agriculture', 'Industrial', 'Logistics', 'Power & Energy', 'Mining'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setImages([...images, ...newFiles]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      let imageUrl = 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=800';
      if (images.length > 0) {
        const fileData = new FormData();
        fileData.append('file', images[0]);
        fileData.append('filename', images[0].name);
        const uploadRes = await mediaService.uploadPhoto(fileData);
        if (uploadRes.data && uploadRes.data.url) {
          imageUrl = uploadRes.data.url;
        }
      }

      const { location, ...restData } = formData;
      await api.post('/equipment', {
        ...restData,
        locationAddress: location,
        pricePerDay: Number(formData.pricePerDay),
        operatorDailyRate: Number(formData.operatorDailyRate),
        image: imageUrl,
      });
      setMessage('Equipment added successfully! It will be visible after admin approval.');
      setFormData({ name: '', category: '', description: '', location: '', pricePerDay: '', availability: 'Available', operatorAvailable: true, operatorDailyRate: '150' });
      setImages([]);
      setTimeout(() => setMessage(''), 5000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to add equipment. Please try again.');
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Add Equipment</h1>
          <p className="text-sm text-[#64748B] mt-0.5">List new equipment on the Rentra marketplace.</p>
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

      {/* Form Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 md:p-8 shadow-xs">
        <div className="flex items-center gap-3 pb-5 border-b border-[#E2E8F0] mb-6">
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-[12px]">
            <FiTruck className="text-xl" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">Equipment Details</h3>
            <p className="text-xs text-[#64748B]">Provide accurate details about your equipment.</p>
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
                placeholder="e.g. Caterpillar 320 Excavator"
                className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[12px] text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30"
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
                <option value="">Select category</option>
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
              placeholder="Describe the equipment specifications, condition, and any included accessories..."
              className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[12px] text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30 resize-none"
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
                placeholder="e.g. Houston, TX"
                className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[12px] text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30"
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
                placeholder="e.g. 450"
                className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[12px] text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30"
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

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
              <span className="flex items-center gap-1.5"><FiUpload className="text-[11px] text-[#64748B]" /> Upload Images</span>
            </label>
            <div className="border-2 border-dashed border-[#E2E8F0] rounded-[16px] p-6 text-center hover:border-[#CCCCFF] transition-colors bg-[#F8FAFC]/50">
              <FiUpload className="mx-auto text-2xl text-[#94A3B8] mb-2" />
              <p className="text-xs text-[#64748B] mb-2">Upload high-quality images of your equipment</p>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 bg-[#CCCCFF] hover:bg-[#B8B8FF] text-[#0F172A] text-xs font-semibold rounded-[10px] transition-colors">
                <FiUpload className="text-sm" /> Browse Images
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {images.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {images.map((img, index) => (
                  <div key={index} className="relative group">
                    <div className="w-20 h-20 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0] overflow-hidden flex items-center justify-center">
                      <span className="text-[10px] text-[#64748B] text-center px-1 truncate">{img.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#EF4444] text-white rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
            <Button variant="secondary" onClick={() => navigate('/owner/equipment')}>Cancel</Button>
            <Button variant="primary" type="submit" icon={FiTruck} disabled={loading}>{loading ? 'Adding...' : 'Add Equipment'}</Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AddEquipment;
