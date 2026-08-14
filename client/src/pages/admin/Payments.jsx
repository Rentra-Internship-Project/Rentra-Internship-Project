import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiRefreshCw, FiAlertCircle, FiCheckCircle, FiSearch, FiClock } from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';
import api from '../../services/api';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [refundingId, setRefundingId] = useState(null);
  const [transferringId, setTransferringId] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/payments');
      setPayments(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (id) => {
    if (!window.confirm('Are you sure you want to manually trigger this refund? This action cannot be undone.')) return;
    
    try {
      setRefundingId(id);
      await api.post(`/admin/payments/${id}/refund`);
      fetchPayments(); // Refresh list to see updated status
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to issue refund');
    } finally {
      setRefundingId(null);
    }
  };

  const handleTransfer = async (id) => {
    if (!window.confirm('Have you manually transferred this amount to the owner? Clicking OK will permanently mark this payout as Transferred.')) return;
    
    try {
      setTransferringId(id);
      await api.post(`/admin/payments/${id}/payout`);
      fetchPayments(); // Refresh list to see updated status
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to mark payout as transferred');
    } finally {
      setTransferringId(null);
    }
  };

  const filteredPayments = payments.filter(p => 
    p.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.razorpayPaymentId && p.razorpayPaymentId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalDepositsCollected = payments.reduce((sum, p) => sum + (p.depositAmount || 0), 0);
  const totalActiveDeposits = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + (p.depositAmount || 0), 0);
  const totalRefunded = payments.filter(p => p.status === 'Refunded').reduce((sum, p) => sum + (p.depositAmount || 0), 0);
  const totalRevenue = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + (p.platformFee || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Payments & Refunds</h1>
        <p className="text-sm text-[#64748B] mt-1">Manage platform deposits, revenues, and issue refunds.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-[20px] border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Total Collected</p>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
              <FaRupeeSign className="w-4 h-4 text-blue-500" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-[#0F172A]">₹{totalDepositsCollected.toLocaleString()}</h2>
        </div>

        <div className="bg-white p-5 rounded-[20px] border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Active Deposits Held</p>
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
              <FiCheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-[#0F172A]">₹{totalActiveDeposits.toLocaleString()}</h2>
        </div>

        <div className="bg-white p-5 rounded-[20px] border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Refunded to Customers</p>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <FiClock className="w-4 h-4 text-gray-500" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-[#0F172A]">₹{totalRefunded.toLocaleString()}</h2>
        </div>
        
        <div className="bg-white p-5 rounded-[20px] border border-[#E2E8F0] shadow-sm flex flex-col justify-between border-l-4 border-l-[#5D5DEB]">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Platform Revenue</p>
            <div className="w-8 h-8 rounded-full bg-[#CCCCFF]/30 flex items-center justify-center">
              <FaRupeeSign className="w-4 h-4 text-[#5D5DEB]" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-[#0F172A]">₹{totalRevenue.toLocaleString()}</h2>
        </div>
      </div>

      <div className="bg-white rounded-[24px] border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col h-[calc(100vh-280px)]">
        <div className="p-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search customer, owner, or payment ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] text-sm focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/20"
            />
          </div>
          <button 
            onClick={fetchPayments}
            className="flex items-center gap-2 text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          {loading && payments.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-[#64748B]">
              <FiRefreshCw className="animate-spin w-6 h-6 mr-3" /> Loading payments...
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 text-red-500">
              <FiAlertCircle className="w-8 h-8 mb-2" />
              <p>{error}</p>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-[#64748B]">
              <p>No payments found.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F8FAFC] sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">Transaction ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">Equipment</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">Users</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">Deposit Paid</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">Platform Fee</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">Owner Payout</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">Payout Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredPayments.map((p) => (
                  <motion.tr 
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-[#F8FAFC]/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm">
                      <div className="font-mono text-[#0F172A]">{p.razorpayPaymentId || 'N/A'}</div>
                      <div className="text-xs text-[#94A3B8] mt-1">{new Date(p.date).toLocaleString()}</div>
                      {p.status === 'Refunded' && <span className="text-xs text-red-500 font-bold mt-1 block">Refunded</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-[#0F172A] line-clamp-1 max-w-[150px]" title={p.equipmentName}>{p.equipmentName || 'Unknown'}</div>
                      <div className="text-[10px] font-mono text-[#94A3B8] mt-1">ID: {(p.equipmentId || '').toString().slice(-8).toUpperCase()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-[#0F172A]">{p.customer} <span className="text-xs font-normal text-[#94A3B8]">(Customer)</span></div>
                      <div className="text-sm text-[#475569]">{p.owner} <span className="text-xs text-[#94A3B8]">(Owner)</span></div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#0F172A]">
                      ₹{p.depositAmount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-emerald-600">
                      ₹{p.platformFee?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-blue-600">
                      ₹{p.ownerPayoutAmount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {p.status === 'Refunded' ? (
                         <span className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-semibold">Cancelled</span>
                      ) : p.payoutStatus === 'Transferred' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">
                          <FiCheckCircle /> Transferred
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold">
                          <FiClock /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {p.status === 'Paid' && p.payoutStatus === 'Pending' && (
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleTransfer(p.id)}
                            disabled={transferringId === p.id}
                            className="px-3 py-1.5 bg-[#0F172A] text-white hover:bg-[#1E293B] rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                          >
                            {transferringId === p.id ? 'Saving...' : 'Mark Transferred'}
                          </button>
                          <button
                            onClick={() => handleRefund(p.id)}
                            disabled={refundingId === p.id}
                            className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                          >
                            {refundingId === p.id ? 'Refunding...' : 'Manual Refund'}
                          </button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payments;
