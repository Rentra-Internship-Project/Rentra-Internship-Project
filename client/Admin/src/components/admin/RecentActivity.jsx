import React from 'react';
import { FiClock, FiActivity } from 'react-icons/fi';

const RecentActivity = ({ activities = [] }) => {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 shadow-xs h-full">
      <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-[10px] bg-[#CCCCFF]/30 text-[#0F172A]">
            <FiActivity className="text-lg" />
          </div>
          <h3 className="font-bold text-base text-[#0F172A]">Recent Activities</h3>
        </div>
        <span className="text-xs text-[#64748B] font-medium">Real-time log</span>
      </div>

      <div className="space-y-4">
        {activities.map((item) => (
          <div key={item.id} className="flex items-start gap-3 p-3 rounded-[12px] hover:bg-[#F8FAFC] transition-colors">
            <div className="w-2 h-2 rounded-full bg-[#CCCCFF] mt-2 shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#0F172A] truncate">{item.title}</p>
              <p className="text-xs text-[#64748B] mt-0.5 leading-snug">{item.description}</p>
            </div>
            <span className="text-[10px] font-medium text-[#94A3B8] flex items-center gap-1 shrink-0 mt-0.5">
              <FiClock className="text-[10px]" /> {item.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
