import React from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';

const SearchBar = ({
  searchTerm = '',
  onSearchChange,
  filterOptions = [],
  selectedFilter = 'all',
  onFilterChange,
  placeholder = 'Search records...'
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full mb-6">
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] text-lg" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2E8F0] rounded-[12px] text-sm text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30 transition-all shadow-xs"
        />
      </div>

      {/* Filter Dropdown */}
      {filterOptions.length > 0 && (
        <div className="relative w-full sm:w-auto min-w-[160px]">
          <FiFilter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] text-sm pointer-events-none" />
          <select
            value={selectedFilter}
            onChange={(e) => onFilterChange && onFilterChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 bg-white border border-[#E2E8F0] rounded-[12px] text-sm text-[#0F172A] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30 cursor-pointer appearance-none shadow-xs font-medium"
          >
            <option value="all">All Statuses</option>
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#64748B] pointer-events-none">
            ▼
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
