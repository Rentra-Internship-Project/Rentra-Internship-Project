import React from 'react';

const DataTable = ({ columns = [], children, emptyMessage = 'No records found' }) => {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[20px] shadow-xs overflow-hidden w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              {columns.map((col, index) => (
                <th key={index} className="px-5 py-3.5 first:pl-6 last:pr-6 whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] text-sm text-[#0F172A]">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
