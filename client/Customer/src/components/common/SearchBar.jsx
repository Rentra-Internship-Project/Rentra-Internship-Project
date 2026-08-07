import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = ({
  value,
  onChange,
  placeholder = 'Search equipment, categories, locations...',
  onClear,
  className = '',
}) => {
  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <FiSearch className="absolute left-3.5 text-[#64748B] text-base pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#E2E8F0] rounded-[14px] text-sm text-[#0F172A] placeholder-[#64748B] outline-none transition-all focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30 shadow-xs"
      />
      {value && (
        <button
          onClick={() => (onClear ? onClear() : onChange(''))}
          className="absolute right-3 p-1 rounded-full text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
          type="button"
        >
          <FiX className="text-sm" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
