import React from 'react';
import { FiSearch, FiMapPin, FiBox } from 'react-icons/fi';
import Button from '../common/Button';

const SearchHero = () => {
  return (
    <div className="dash-search-capsule p-2 md:p-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-0">
        <div className="flex-1 flex items-center gap-3 px-4 py-3">
          <FiSearch className="text-gray-400 shrink-0" size={20} />
          <div className="flex-1">
            <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-wider mb-0.5">Search Equipment</label>
            <input
              type="text"
              placeholder="Search equipment (e.g. Excavator, Generator)"
              className="bg-transparent border-none outline-none w-full text-gray-700 placeholder-gray-400 font-medium text-sm"
            />
          </div>
        </div>
        <div className="hidden md:block w-px h-8 bg-gray-200" />
        <div className="flex-1 flex items-center gap-3 px-4 py-3 border-t md:border-t-0 border-gray-100">
          <FiBox className="text-gray-400 shrink-0" size={20} />
          <div className="flex-1">
            <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-wider mb-0.5">Category</label>
            <select className="bg-transparent border-none outline-none w-full text-gray-700 font-medium text-sm cursor-pointer appearance-none">
              <option value="">All Categories</option>
              <option value="construction">Construction</option>
              <option value="agriculture">Agriculture</option>
              <option value="industrial">Industrial</option>
            </select>
          </div>
        </div>
        <div className="hidden md:block w-px h-8 bg-gray-200" />
        <div className="flex-1 flex items-center gap-3 px-4 py-3 border-t md:border-t-0 border-gray-100">
          <FiMapPin className="text-gray-400 shrink-0" size={20} />
          <div className="flex-1">
            <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-wider mb-0.5">Location</label>
            <input
              type="text"
              placeholder="Location (e.g. Mumbai)"
              className="bg-transparent border-none outline-none w-full text-gray-700 placeholder-gray-400 font-medium text-sm"
            />
          </div>
        </div>
        <div className="w-full md:w-auto p-2">
          <Button className="w-full md:w-auto py-3 px-8 rounded-xl shadow-md shrink-0">
            <FiSearch className="mr-2" /> Search
          </Button>
        </div>

      </div>
    </div>
  );
};

export default SearchHero;
