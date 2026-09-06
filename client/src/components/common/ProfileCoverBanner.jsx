import React, { useState, useRef, useEffect } from 'react';
import { FiCamera, FiUploadCloud, FiLink, FiRotateCcw, FiLoader, FiCheck, FiX } from 'react-icons/fi';
import { DEFAULT_COVER_IMAGE } from '../../constants/assets';
import { mediaService } from '../../services/api';

const ProfileCoverBanner = ({ cover, onUpdateCover, editable = true, className = '' }) => {
  const [currentCover, setCurrentCover] = useState(cover || DEFAULT_COVER_IMAGE);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState(null);

  const fileInputRef = useRef(null);
  const menuRef = useRef(null);

  // Keep in sync when prop changes
  useEffect(() => {
    if (cover) {
      setCurrentCover(cover);
    }
  }, [cover]);

  // Handle outside clicks for dropdown menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const showFeedback = (type, text) => {
    setUploadFeedback({ type, text });
    setTimeout(() => setUploadFeedback(null), 3500);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showFeedback('error', 'Image must be less than 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      showFeedback('error', 'Only JPEG, PNG, and WebP images are allowed');
      return;
    }

    setIsUploading(true);
    setIsMenuOpen(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', file.name);

      const res = await mediaService.uploadPhoto(formData);
      const newUrl = res.data?.url;

      if (newUrl) {
        setCurrentCover(newUrl);
        if (onUpdateCover) {
          await onUpdateCover(newUrl);
        }
        showFeedback('success', 'Cover photo updated successfully!');
      } else {
        throw new Error('Upload did not return a valid image URL');
      }
    } catch (err) {
      console.error('Failed to upload cover photo:', err);
      showFeedback('error', err.response?.data?.error || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    setIsUploading(true);
    try {
      setCurrentCover(trimmed);
      if (onUpdateCover) {
        await onUpdateCover(trimmed);
      }
      setIsUrlModalOpen(false);
      setUrlInput('');
      showFeedback('success', 'Cover updated from URL!');
    } catch (err) {
      showFeedback('error', 'Failed to update cover URL');
    } finally {
      setIsUploading(false);
    }
  };

  const handleResetToDefault = async () => {
    setIsMenuOpen(false);
    setIsUploading(true);
    try {
      setCurrentCover(DEFAULT_COVER_IMAGE);
      if (onUpdateCover) {
        await onUpdateCover(DEFAULT_COVER_IMAGE);
      }
      showFeedback('success', 'Cover reset to default banner');
    } catch (err) {
      showFeedback('error', 'Failed to reset cover');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`h-40 sm:h-48 md:h-56 w-full relative bg-[#0F172A] overflow-hidden ${className}`}>
      {/* Cover Image with reliable error fallback */}
      <img
        src={currentCover || DEFAULT_COVER_IMAGE}
        alt="Profile Cover Banner"
        referrerPolicy="no-referrer"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = DEFAULT_COVER_IMAGE;
        }}
        className="w-full h-full object-cover select-none"
      />

      {/* Aesthetic dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent pointer-events-none" />

      {/* Feedback banner overlay */}
      {uploadFeedback && (
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20">
          <div
            className={`px-3 py-1.5 rounded-[10px] text-xs font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-md ${
              uploadFeedback.type === 'success'
                ? 'bg-[#22C55E]/90 text-white border border-[#22C55E]'
                : 'bg-[#EF4444]/90 text-white border border-[#EF4444]'
            }`}
          >
            {uploadFeedback.type === 'success' ? <FiCheck /> : <FiX />}
            <span>{uploadFeedback.text}</span>
          </div>
        </div>
      )}

      {/* Uploading Spinner Overlay */}
      {isUploading && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-30">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/90 rounded-[12px] shadow-lg text-[#0F172A] text-xs font-bold">
            <FiLoader className="animate-spin text-sm text-[#3B82F6]" />
            <span>Updating Cover Photo...</span>
          </div>
        </div>
      )}

      {/* Change Cover Button & Dropdown */}
      {editable && onUpdateCover && (
        <div ref={menuRef} className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 hover:bg-black/85 text-white text-xs font-semibold rounded-full border border-white/20 backdrop-blur-md shadow-md cursor-pointer transition-all duration-200"
            title="Customize cover photo"
          >
            <FiCamera className="text-sm" />
            <span className="hidden sm:inline">Change Cover</span>
          </button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E2E8F0] rounded-[16px] shadow-xl p-1.5 z-30">
              <button
                type="button"
                onClick={() => {
                  fileInputRef.current?.click();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] rounded-[10px] transition-colors cursor-pointer text-left"
              >
                <FiUploadCloud className="text-[#3B82F6] text-sm" />
                <span>Upload from Device</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsUrlModalOpen(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] rounded-[10px] transition-colors cursor-pointer text-left"
              >
                <FiLink className="text-[#10B981] text-sm" />
                <span>Use Image URL</span>
              </button>

              <div className="my-1 border-t border-[#E2E8F0]" />

              <button
                type="button"
                onClick={handleResetToDefault}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#64748B] hover:text-[#EF4444] hover:bg-red-50 rounded-[10px] transition-colors cursor-pointer text-left"
              >
                <FiRotateCcw className="text-xs" />
                <span>Reset to Default</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* URL Modal Dialog */}
      {isUrlModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#E2E8F0] rounded-[20px] shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center gap-2">
                <FiLink className="text-[#3B82F6]" />
                <h3 className="text-sm font-bold text-[#0F172A]">Enter Custom Cover URL</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsUrlModalOpen(false)}
                className="text-[#64748B] hover:text-[#0F172A] p-1 rounded-full hover:bg-[#F8FAFC]"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleUrlSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1.5">Image Link</label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  required
                  className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[12px] text-xs text-[#0F172A] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30"
                />
                <p className="text-[11px] text-[#64748B] mt-1">
                  Paste a direct link to any public JPG, PNG, or WebP image.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUrlModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] rounded-[10px] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!urlInput.trim() || isUploading}
                  className="px-4 py-2 bg-[#0F172A] hover:bg-slate-800 text-white rounded-[10px] text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                >
                  Apply Cover
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCoverBanner;
