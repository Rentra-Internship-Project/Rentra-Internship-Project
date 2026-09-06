import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiMapPin,
  FiStar,
  FiCheckCircle,
  FiClock,
  FiHeart,
  FiArrowRight,
  FiTruck,
} from 'react-icons/fi';
import { useCustomer } from '../../context/CustomerContext';
import SearchBar from '../../components/common/SearchBar';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import FleetBundlerModal from '../../components/customer/FleetBundlerModal';
import { categoryService } from '../../services/api';

const BrowseEquipment = () => {
  const navigate = useNavigate();
  const { equipmentList, isInWishlist, toggleWishlist } = useCustomer();

  // Fleet Bundler Modal State
  const [isFleetModalOpen, setIsFleetModalOpen] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'price-low' | 'price-high' | 'rating'

  // Load categories from API
  const [apiCategories, setApiCategories] = useState([]);
  useEffect(() => {
    categoryService.getAll()
      .then((res) => setApiCategories(['All', ...(res.data || []).map((c) => c.name)]))
      .catch(() => setApiCategories([]));
  }, []);

  // Extract unique categories from equipment list as fallback
  const categories = useMemo(() => {
    if (apiCategories.length > 0) return apiCategories;
    const set = new Set(equipmentList.map((item) => item.category));
    return ['All', ...Array.from(set)];
  }, [equipmentList, apiCategories]);

  // Extract unique locations from equipment list
  const locations = useMemo(() => {
    const set = new Set(equipmentList.map((item) => item.location || item.locationAddress).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [equipmentList]);

  // Filter & Sort Logic
  const filteredEquipment = useMemo(() => {
    let result = equipmentList.filter((item) => {
      if (!item) return false;
      const q = (searchQuery || '').toLowerCase().trim();
      const matchesSearch =
        !q ||
        (item.name || '').toLowerCase().includes(q) ||
        (item.category || '').toLowerCase().includes(q) ||
        (item.location || item.locationAddress || '').toLowerCase().includes(q) ||
        (item.owner?.name || item.ownerName || '').toLowerCase().includes(q);

      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesLoc =
        selectedLocation === 'All' ||
        item.location === selectedLocation ||
        item.locationAddress === selectedLocation;
      const matchesAvail =
        selectedAvailability === 'All' || item.availability === selectedAvailability;

      return matchesSearch && matchesCat && matchesLoc && matchesAvail;
    });

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.pricePerDay - a.pricePerDay);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [equipmentList, searchQuery, selectedCategory, selectedLocation, selectedAvailability, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="panel-card p-6 bg-gradient-to-r from-[#0F172A] via-slate-900 to-slate-800 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#CCCCFF]/20 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 bg-[#CCCCFF] text-[#0F172A] text-xs font-bold rounded-full mb-2 inline-block">
              Rent Verified Equipment
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Browse Equipment Marketplace
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Discover heavy excavators, bulldozers, cranes, concrete boom pumps, and industrial generators available for immediate job site dispatch.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <button
              onClick={() => setIsFleetModalOpen(true)}
              className="px-4 py-2 bg-[#CCCCFF] hover:bg-[#B8B8FF] text-[#0F172A] rounded-[14px] text-xs font-extrabold transition-all flex items-center gap-2 shadow-md cursor-pointer"
            >
              <span>🏗️ Project Fleet Packages</span>
              <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">Save 10-12%</span>
            </button>

            <span className="px-4 py-2 bg-white/10 border border-white/20 rounded-[14px] text-xs font-semibold text-white">
              {filteredEquipment.length} Machinery Units Available
            </span>
          </div>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="panel-card p-5 space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Main Search Input */}
          <div className="w-full lg:w-96">
            <SearchBar
              searchTerm={searchQuery}
              onSearchChange={setSearchQuery}
              placeholder="Search by equipment name, category, or owner..."
            />
          </div>

          {/* Select Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
            {/* Location Select */}
            <div>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] text-xs text-[#0F172A] font-semibold outline-none focus:border-[#CCCCFF] transition-all cursor-pointer"
              >
                <option value="All">All Locations</option>
                {locations.filter((l) => l !== 'All').map((loc) => (
                  <option key={loc} value={loc}>
                    📍 {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability Select */}
            <div>
              <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] text-xs text-[#0F172A] font-semibold outline-none focus:border-[#CCCCFF] transition-all cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Available">🟢 Available Now</option>
                <option value="Rented">🟠 Currently Rented</option>
              </select>
            </div>

            {/* Sort Select */}
            <div className="col-span-2 sm:col-span-1">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] text-xs text-[#0F172A] font-semibold outline-none focus:border-[#CCCCFF] transition-all cursor-pointer"
              >
                <option value="default">Sort: Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-[#E2E8F0] pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#CCCCFF] text-[#0F172A] shadow-xs font-extrabold'
                  : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#E2E8F0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Marketplace Grid */}
      {filteredEquipment.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredEquipment.map((equipment) => {
            const isWishlisted = isInWishlist(equipment.id);

            return (
              <motion.div
                key={equipment.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => navigate(`/customer/equipment/${equipment.id}`)}
                className="panel-card overflow-hidden flex flex-col justify-between h-full group cursor-pointer"
              >
                <div>
                  {/* Card Image */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                    <img
                      src={equipment.image}
                      alt={equipment.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-50" />

                    {/* Category Tag */}
                    <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-xs text-[#0F172A] text-[11px] font-bold rounded-full shadow-xs">
                      {equipment.category}
                    </span>

                    {/* Availability Badge */}
                    <span
                      className={`absolute top-3 right-12 px-2.5 py-1 text-[10px] font-bold rounded-full shadow-xs flex items-center gap-1 ${
                        equipment.availability === 'Available'
                          ? 'bg-[#22C55E]/90 text-white'
                          : 'bg-[#F59E0B]/90 text-white'
                      }`}
                    >
                      {equipment.availability === 'Available' ? <FiCheckCircle className="text-xs" /> : <FiClock className="text-xs" />}
                      {equipment.availability}
                    </span>

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(equipment.id);
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-xs ${
                        isWishlisted
                          ? 'bg-[#EF4444] text-white'
                          : 'bg-white/80 hover:bg-white text-slate-700 hover:text-[#EF4444]'
                      }`}
                      aria-label="Toggle Wishlist"
                    >
                      <FiHeart className={`text-sm ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <div className="flex items-center justify-between text-xs text-[#64748B] mb-2">
                      <div className="flex items-center gap-1 text-amber-500 font-semibold">
                        <FiStar className="fill-current text-amber-400" />
                        <span>{equipment.rating}</span>
                        <span className="text-[#94A3B8] font-normal">({equipment.reviewsCount})</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#64748B]">
                        <FiMapPin className="text-[#3B82F6]" />
                        <span>{equipment.location}</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-base text-[#0F172A] mb-1 line-clamp-1 group-hover:text-[#3B82F6] transition-colors">
                      {equipment.name}
                    </h3>

                    <p className="text-xs text-[#64748B] mb-4">
                      Provided by <span className="font-semibold text-[#0F172A]">{equipment.owner.name}</span>
                    </p>

                    <div className="p-3 bg-[#F8FAFC] rounded-[14px] border border-[#E2E8F0] flex items-center justify-between">
                      <span className="text-xs font-medium text-[#64748B]">Rental Rate:</span>
                      <span className="text-base font-extrabold text-[#0F172A]">
                        ₹{equipment.pricePerDay.toLocaleString()} <span className="text-xs font-normal text-[#64748B]">/ day</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-[#E2E8F0] pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/customer/equipment/${equipment.id}`);
                    }}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/customer/equipment/${equipment.id}`);
                    }}
                    icon={FiArrowRight}
                  >
                    Book Now
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={FiTruck}
          title="No Equipment Found"
          description="There are no machinery units matching your search filters. Try clearing your filters."
          actionText="Reset All Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('All');
            setSelectedLocation('All');
            setSelectedAvailability('All');
            setSortBy('default');
          }}
        />
      )}

      {/* Fleet Bundler Modal */}
      <FleetBundlerModal
        isOpen={isFleetModalOpen}
        onClose={() => setIsFleetModalOpen(false)}
        onSelectBundle={(bundle) =>
          navigate('/customer/booking-summary/EQ-1001', {
            state: { isBundle: true, bundleName: bundle.name, discountPercent: bundle.discountPercent }
          })
        }
      />
    </div>
  );
};

export default BrowseEquipment;
