import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiCalendar, FiClock, FiCheck, FiArrowUpRight } from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';
import EarningsCard from '../../components/owner/EarningsCard';
import { ownerEarnings as mockEarnings } from '../../data/ownerMockData';
import { useOwner } from '../../context/OwnerContext';

const Earnings = () => {
  const { bookings, ownerStats } = useOwner();
  const maxEarning = Math.max(...mockEarnings.monthlyData.map((m) => m.earnings));

  const recentTransactions = bookings.filter(b => b.status === 'ACTIVE' || b.status === 'COMPLETED').map(b => ({
    id: b.id,
    bookingId: b.id,
    customer: b.customerName,
    equipment: b.equipmentName,
    date: b.startDate,
    amount: b.rentalCost,
    status: b.status === 'COMPLETED' ? 'Paid' : 'Pending',
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A]">Earnings & Revenue</h1>
        <p className="text-sm text-[#64748B] mt-1">Track your equipment rental income and payment history.</p>
        
      </div>

      {/* Earnings Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <EarningsCard
          title="Total Earnings"
          value={ownerStats.monthlyEarnings}
          icon={FaRupeeSign}
          accentBg="bg-emerald-50"
          iconColor="text-[#22C55E]"
          trend="32.5%"
        />
        <EarningsCard
          title="Monthly Earnings"
          value={ownerStats.monthlyEarnings}
          icon={FiTrendingUp}
          accentBg="bg-blue-50"
          iconColor="text-[#3B82F6]"
          trend="18.4%"
        />
        <EarningsCard
          title="Completed Bookings"
          value={bookings.filter(b => b.status === 'COMPLETED').length}
          subtitle="Revenue-generating rentals"
          icon={FiCalendar}
          accentBg="bg-purple-50"
          iconColor="text-purple-600"
        />
        <EarningsCard
          title="Pending Payments"
          value={`₹${bookings.filter(b => b.status === 'ACTIVE').reduce((sum, b) => sum + b.remainingBalance, 0).toLocaleString()}`}
          subtitle="Awaiting settlement"
          icon={FiClock}
          accentBg="bg-amber-50"
          iconColor="text-[#F59E0B]"
        />
      </div>

      {/* Monthly Revenue Chart */}
      <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">Monthly Revenue</h3>
            <p className="text-xs text-[#64748B] mt-0.5">Revenue trend across the last 8 months</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-[10px]">
            <FiArrowUpRight className="text-[#22C55E] text-sm" />
            <span className="text-xs font-bold text-[#22C55E]">+18.4%</span>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="flex items-end justify-between gap-3 h-52 px-2">
          {mockEarnings.monthlyData.map((month, index) => {
            const height = (month.earnings / maxEarning) * 100;
            return (
              <motion.div
                key={month.month}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                className="flex-1 flex flex-col items-center gap-2 group relative"
              >
                {/* Tooltip */}
                <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0F172A] text-white text-[10px] font-bold px-2 py-1 rounded-[6px] whitespace-nowrap pointer-events-none">
                  ${month.earnings.toLocaleString()}
                </div>
                {/* Bar */}
                <div
                  className="w-full rounded-t-[8px] bg-[#CCCCFF] hover:bg-[#B8B8FF] transition-colors cursor-pointer"
                  style={{ height: '100%', minHeight: '8px' }}
                />
              </motion.div>
            );
          })}
        </div>
        {/* Labels */}
        <div className="flex items-center justify-between gap-3 px-2 mt-2">
          {mockEarnings.monthlyData.map((month) => (
            <div key={month.month} className="flex-1 text-center">
              <span className="text-[10px] font-semibold text-[#64748B]">{month.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white border border-[#E2E8F0] rounded-[20px] shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E2E8F0]">
          <h3 className="text-base font-bold text-[#0F172A]">Recent Transactions</h3>
          <p className="text-xs text-[#64748B] mt-0.5">Payment history for completed and pending bookings</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Transaction ID</th>
                <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Booking</th>
                <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Customer</th>
                <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Equipment</th>
                <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Date</th>
                <th className="text-right px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Amount</th>
                <th className="text-right px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {recentTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-[#F8FAFC]/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-mono font-bold text-[#0F172A]">{txn.id}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-mono text-[#64748B]">{txn.bookingId}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-medium text-[#0F172A]">{txn.customer}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-[#64748B] line-clamp-1 max-w-[160px]">{txn.equipment}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-[#64748B]">{txn.date}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="text-sm font-bold text-[#0F172A]">₹{txn.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      txn.status === 'Paid'
                        ? 'bg-green-50 text-[#22C55E]'
                        : 'bg-amber-50 text-[#F59E0B]'
                    }`}>
                      {txn.status === 'Paid' ? <FiCheck className="text-[8px]" /> : <FiClock className="text-[8px]" />}
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <p className="text-xs text-[#64748B]">
            Showing {recentTransactions.length} recent transactions
          </p>
          <p className="text-xs font-bold text-[#0F172A]">
            Total: ₹{recentTransactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Earnings;
