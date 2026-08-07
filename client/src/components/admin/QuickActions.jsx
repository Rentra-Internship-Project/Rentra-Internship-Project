import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiPlusCircle, FiGrid, FiArrowRight } from 'react-icons/fi';
import Button from '../common/Button';

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-4">
        <h3 className="font-bold text-base text-[#0F172A]">Quick Actions</h3>
        <span className="text-xs text-[#64748B]">Shortcuts</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => navigate('/admin/businesses')}
          className="flex items-center justify-between p-4 rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#CCCCFF]/20 hover:border-[#CCCCFF] transition-all text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-[10px] bg-emerald-50 text-[#22C55E]">
              <FiCheckCircle className="text-lg" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#0F172A]">Verify Businesses</p>
              <p className="text-[10px] text-[#64748B]">Review pending owners</p>
            </div>
          </div>
          <FiArrowRight className="text-[#64748B] group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => navigate('/admin/equipment')}
          className="flex items-center justify-between p-4 rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#CCCCFF]/20 hover:border-[#CCCCFF] transition-all text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-[10px] bg-blue-50 text-[#3B82F6]">
              <FiPlusCircle className="text-lg" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#0F172A]">Approve Equipment</p>
              <p className="text-[10px] text-[#64748B]">Review asset listings</p>
            </div>
          </div>
          <FiArrowRight className="text-[#64748B] group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => navigate('/admin/categories')}
          className="flex items-center justify-between p-4 rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#CCCCFF]/20 hover:border-[#CCCCFF] transition-all text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-[10px] bg-amber-50 text-[#F59E0B]">
              <FiGrid className="text-lg" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#0F172A]">Manage Categories</p>
              <p className="text-[10px] text-[#64748B]">Add or edit categories</p>
            </div>
          </div>
          <FiArrowRight className="text-[#64748B] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
