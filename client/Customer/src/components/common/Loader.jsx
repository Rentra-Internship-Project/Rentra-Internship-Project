import React from 'react';

const Loader = ({ fullScreen = false, message = 'Loading Rentra Marketplace...' }) => {
  const loaderContent = (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-[#CCCCFF]/30"></div>
        <div className="absolute inset-0 rounded-full border-4 border-[#CCCCFF] border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center font-bold text-[#0F172A] text-xs">
          R
        </div>
      </div>
      {message && <p className="mt-4 text-xs font-semibold text-[#64748B] tracking-wide">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-[#F8FAFC]/90 backdrop-blur-xs flex items-center justify-center">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};

export default Loader;
