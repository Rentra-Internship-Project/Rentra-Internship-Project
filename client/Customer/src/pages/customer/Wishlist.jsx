import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiSearch, FiCheckCircle, FiShield, FiArrowRight, FiTrash2 } from 'react-icons/fi';
import { useCustomer } from '../../context/CustomerContext';
import WishlistCard from '../../components/customer/WishlistCard';
import SearchBar from '../../components/common/SearchBar';
import EmptyState from '../../components/common/EmptyState';
import ConfirmModal from '../../components/common/ConfirmModal';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlistEquipment, removeFromWishlist, addBooking } = useCustomer();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Confirmation Modal for removing item
  const [itemToRemove, setItemToRemove] = useState(null);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  // Booking Modal
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [startDate, setStartDate] = useState('2026-08-15');
  const [endDate, setEndDate] = useState('2026-08-20');
  const [siteAddress, setSiteAddress] = useState('104 Industrial Parkway, Austin TX');
  const [bookingNotes, setBookingNotes] = useState('');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  // Detail Modal
  const [detailEquipment, setDetailEquipment] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Extract Categories
  const categories = useMemo(() => {
    const set = new Set(wishlistEquipment.map((item) => item.category));
    return ['All', ...Array.from(set)];
  }, [wishlistEquipment]);

  // Filtered Items
  const filteredWishlist = useMemo(() => {
    return wishlistEquipment.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [wishlistEquipment, searchQuery, selectedCategory]);

  const handleConfirmRemove = () => {
    if (itemToRemove) {
      removeFromWishlist(itemToRemove);
      setItemToRemove(null);
      setIsRemoveModalOpen(false);
    }
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!selectedEquipment) return;
    setIsSubmittingBooking(true);

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const subtotal = durationDays * selectedEquipment.pricePerDay;
    const deposit = 1000;
    const serviceFee = Math.round(subtotal * 0.05);
    const tax = Math.round(subtotal * 0.08);
    const totalAmount = subtotal + deposit + serviceFee + tax;

    setTimeout(() => {
      const bookingId = addBooking({
        equipmentId: selectedEquipment.id,
        equipmentName: selectedEquipment.name,
        category: selectedEquipment.category,
        image: selectedEquipment.image,
        ownerName: selectedEquipment.owner.name,
        ownerContact: selectedEquipment.owner.phone,
        ownerEmail: selectedEquipment.owner.email,
        ownerAvatar: selectedEquipment.owner.avatar,
        startDate,
        endDate,
        durationDays,
        dailyRate: selectedEquipment.pricePerDay,
        subtotal,
        deposit,
        serviceFee,
        tax,
        totalAmount,
        siteAddress,
        notes: bookingNotes,
      });

      setIsSubmittingBooking(false);
      setIsBookModalOpen(false);
      navigate(`/customer/bookings/${bookingId}`);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="panel-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">Saved Equipment Wishlist</h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Quick access to your saved heavy machinery, cranes, excavators, and asset rentals.
          </p>
        </div>
        <div className="px-3.5 py-1.5 bg-[#CCCCFF]/30 border border-[#CCCCFF] rounded-full text-xs font-bold text-[#0F172A] flex items-center gap-1.5 shrink-0">
          <FiHeart className="fill-current text-[#EF4444]" />
          <span>{wishlistEquipment.length} Items Saved</span>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="panel-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-80">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search saved equipment..."
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#CCCCFF] text-[#0F172A] shadow-xs'
                  : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#E2E8F0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Wishlist Items Grid */}
      {filteredWishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredWishlist.map((equipment) => (
            <WishlistCard
              key={equipment.id}
              equipment={equipment}
              onRemove={(id) => {
                setItemToRemove(id);
                setIsRemoveModalOpen(true);
              }}
              onBook={(eq) => {
                setSelectedEquipment(eq);
                setIsBookModalOpen(true);
              }}
              onViewDetails={(eq) => {
                setDetailEquipment(eq);
                setIsDetailModalOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FiHeart}
          title="Wishlist is Empty"
          description={
            searchQuery
              ? `No saved items match "${searchQuery}".`
              : "You haven't added any equipment to your wishlist yet. Browse available assets to save items for future rentals."
          }
          actionText="Browse Machinery"
          onAction={() => navigate('/customer/dashboard')}
          actionIcon={FiSearch}
        />
      )}

      {/* Remove Confirmation Modal */}
      <ConfirmModal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        onConfirm={handleConfirmRemove}
        title="Remove Item from Wishlist"
        message="Are you sure you want to remove this equipment from your saved wishlist?"
        confirmText="Remove"
        variant="danger"
      />

      {/* Booking Form Modal */}
      {selectedEquipment && (
        <Modal
          isOpen={isBookModalOpen}
          onClose={() => setIsBookModalOpen(false)}
          title={`Book ${selectedEquipment.name}`}
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleConfirmBooking} className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-[#F8FAFC] rounded-[16px] border border-[#E2E8F0]">
              <img
                src={selectedEquipment.image}
                alt={selectedEquipment.name}
                className="w-16 h-16 rounded-[12px] object-cover shrink-0"
              />
              <div>
                <h4 className="text-sm font-bold text-[#0F172A]">{selectedEquipment.name}</h4>
                <p className="text-xs text-[#64748B]">{selectedEquipment.category} • {selectedEquipment.location}</p>
                <p className="text-xs font-bold text-[#3B82F6] mt-0.5">${selectedEquipment.pricePerDay} / day</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Rental Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Rental End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Job Site Delivery Address</label>
              <input
                type="text"
                value={siteAddress}
                onChange={(e) => setSiteAddress(e.target.value)}
                required
                className="form-input"
                placeholder="Enter full job site address..."
              />
            </div>

            <div>
              <label className="form-label">Special Notes / Instructions</label>
              <textarea
                value={bookingNotes}
                onChange={(e) => setBookingNotes(e.target.value)}
                rows={2}
                className="form-input resize-none"
                placeholder="Mention site access requirements..."
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setIsBookModalOpen(false)}
                disabled={isSubmittingBooking}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                type="submit"
                loading={isSubmittingBooking}
                icon={FiCheckCircle}
              >
                Confirm Booking Request
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Detail Modal */}
      {detailEquipment && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={detailEquipment.name}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-5">
            <div className="h-56 w-full rounded-[20px] overflow-hidden relative">
              <img
                src={detailEquipment.image}
                alt={detailEquipment.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 font-bold text-xs rounded-full">
                {detailEquipment.category}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#0F172A]">{detailEquipment.name}</h3>
              <p className="text-xs text-[#64748B] mt-1">{detailEquipment.description}</p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2">Technical Specifications</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(detailEquipment.specs).map(([key, val]) => (
                  <div key={key} className="p-3 bg-[#F8FAFC] rounded-[14px] border border-[#E2E8F0]">
                    <p className="text-[10px] capitalize text-[#64748B]">{key.replace(/([A-Z])/g, ' $1')}</p>
                    <p className="text-xs font-bold text-[#0F172A] mt-0.5">{val}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-[#F8FAFC] rounded-[18px] border border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={detailEquipment.owner.avatar}
                  alt={detailEquipment.owner.ownerName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#CCCCFF]"
                />
                <div>
                  <p className="text-xs font-bold text-[#0F172A] flex items-center gap-1">
                    {detailEquipment.owner.name} <FiShield className="text-[#3B82F6] text-xs" />
                  </p>
                  <p className="text-[11px] text-[#64748B]">Verified Equipment Owner</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#64748B]">Daily Rate</p>
                <p className="text-base font-extrabold text-[#0F172A]">${detailEquipment.pricePerDay}/day</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
              <Button variant="secondary" size="md" onClick={() => setIsDetailModalOpen(false)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setSelectedEquipment(detailEquipment);
                  setIsBookModalOpen(true);
                }}
                icon={FiArrowRight}
              >
                Book Equipment Now
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Wishlist;
