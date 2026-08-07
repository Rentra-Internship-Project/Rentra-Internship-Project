import React from 'react';

const Loader = ({ label = 'Loading platform data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 w-full min-h-[300px]">
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-4 border-[#E2E8F0]"></div>
        <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-[#CCCCFF] border-t-transparent animate-spin"></div>
      </div>
      {label && <p className="mt-4 text-sm font-medium text-[#64748B] animate-pulse">{label}</p>}
    </div>
  );
};

export default Loader;
