import React from 'react';

const HorizontalCategoryCard = ({ icon, name, count }) => {
  return (
    <button className="flex items-center gap-4 bg-white rounded-[24px] p-4 pr-6 border border-[#EEF2F4] shadow-sm hover:shadow-lg hover:border-[#18968E]/30 transition-all duration-300 group min-w-[240px] shrink-0 transform hover:-translate-y-1">
      <div className="w-16 h-16 rounded-[20px] bg-[#FAFBFC] flex items-center justify-center text-3xl group-hover:scale-110 group-hover:bg-[#E7F8F7] transition-all duration-300">
        {icon}
      </div>
      <div className="text-left">
        <h4 className="font-jakarta font-bold text-gray-900 group-hover:text-[#18968E] transition-colors">{name}</h4>
        <p className="text-sm text-gray-500 mt-0.5">{count} items</p>
      </div>
    </button>
  );
};

export default HorizontalCategoryCard;
