import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiEye, FiXCircle, FiAlertCircle, FiTrash2 } from 'react-icons/fi';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import SearchBar from '../../components/common/SearchBar';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { useAdminContext } from '../../context/AdminContext';
import { adminService } from '../../services/api';

const Equipment = () => {
  const { equipmentList, setEquipmentList, refreshData } = useAdminContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEqp, setSelectedEqp] = useState(null);
  const [rejectModal, setRejectModal] = useState({ open: false, id: null });
  const [approveModal, setApproveModal] = useState({ open: false, id: null });
  const [rejectionReason, setRejectionReason] = useState('');
  const [platformFeeRate, setPlatformFeeRate] = useState(2);
  const [actionLoading, setActionLoading] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: '' });

  const filteredEquipment = (equipmentList || []).filter((eq) => {
    const matchesSearch =
      eq.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.owner?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || eq.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Real API call — approve equipment
  const handleApproveConfirm = async () => {
    const id = approveModal.id;
    try {
      setActionLoading(id);
      await adminService.approveEquipment(id, { platformFeeRate: Number(platformFeeRate) });
      // Optimistic update
      setEquipmentList((prev) =>
        prev.map((item) =>
          (item.id === id || item._id === id)
            ? { ...item, status: 'Approved', approvedAt: new Date().toISOString(), platformFeeRate: Number(platformFeeRate) }
            : item
        )
      );
      if (selectedEqp?.id === id || selectedEqp?._id === id) {
        setSelectedEqp((prev) => ({ ...prev, status: 'Approved' }));
      }
      setApproveModal({ open: false, id: null });
    } catch (err) {
      alert('Failed to approve equipment: ' + (err.response?.data?.error || err.message));
    } finally {
      setActionLoading(null);
    }
  };

  // Real API call — reject equipment with reason
  const handleRejectConfirm = async () => {
    const id = rejectModal.id;
    try {
      setActionLoading(id);
      await adminService.rejectEquipment(id, { rejectionReason });
      setEquipmentList((prev) =>
        prev.map((item) =>
          (item.id === id || item._id === id)
            ? { ...item, status: 'Rejected', rejectionReason }
            : item
        )
      );
      if (selectedEqp?.id === id || selectedEqp?._id === id) {
        setSelectedEqp(null);
      }
      setRejectModal({ open: false, id: null });
      setRejectionReason('');
    } catch (err) {
      alert('Failed to reject equipment: ' + (err.response?.data?.error || err.message));
    } finally {
      setActionLoading(null);
    }
  };

  // Real API call — delete equipment
  const handleDeleteConfirm = async () => {
    const id = deleteModal.id;
    try {
      setActionLoading(id);
      await adminService.deleteEquipment(id);
      setEquipmentList((prev) => prev.filter((item) => item.id !== id && item._id !== id));
      if (selectedEqp?.id === id || selectedEqp?._id === id) {
        setSelectedEqp(null);
      }
      setDeleteModal({ open: false, id: null, name: '' });
    } catch (err) {
      alert('Failed to delete equipment: ' + (err.response?.data?.error || err.message));
    } finally {
      setActionLoading(null);
    }
  };

  const columns = ['Equipment Name', 'Owner', 'Category', 'Price Per Day', 'Status', 'Actions'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Equipment Management</h1>
          <p className="text-xs md:text-sm text-[#64748B] mt-0.5">
            Approve or reject machinery listings submitted by verified owners.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 bg-blue-50 text-[#3B82F6] border border-blue-200 rounded-[12px]">
            Pending: {(equipmentList || []).filter((e) => e.status === 'Pending Approval').length}
          </span>
          <span className="text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-[12px]">
            Approved: {(equipmentList || []).filter((e) => e.status === 'Approved').length}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-5 shadow-xs">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedFilter={statusFilter}
          onFilterChange={setStatusFilter}
          filterOptions={[
            { label: 'Pending Approval', value: 'pending approval' },
            { label: 'Approved Listings', value: 'approved' },
            { label: 'Rejected Listings', value: 'rejected' },
          ]}
          placeholder="Search by name, category, or owner..."
        />
      </div>

      {/* Table */}
      {filteredEquipment.length > 0 ? (
        <DataTable columns={columns}>
          {filteredEquipment.map((eq) => (
            <tr key={eq.id || eq._id} className="hover:bg-[#F8FAFC] transition-colors">
              <td className="px-5 py-4 first:pl-6 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <img
                    src={eq.image}
                    alt={eq.name}
                    className="w-12 h-10 rounded-[10px] object-cover ring-1 ring-[#E2E8F0]"
                  />
                  <div>
                    <p className="font-bold text-[#0F172A] text-sm">{eq.name}</p>
                    <span className="text-[10px] text-[#64748B] font-mono">
                      {(eq.id || eq._id || '').toString().slice(-8).toUpperCase()}
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4 whitespace-nowrap text-xs text-[#64748B]">
                {eq.owner?.name || 'Unknown Owner'}
              </td>
              <td className="px-5 py-4 whitespace-nowrap">
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#F1F5F9] text-[#334155]">
                  {eq.category}
                </span>
              </td>
              <td className="px-5 py-4 whitespace-nowrap text-xs font-bold text-[#0F172A]">
                ₹{(eq.pricePerDay || 0).toLocaleString('en-IN')} / day
              </td>
              <td className="px-5 py-4 whitespace-nowrap">
                <StatusBadge status={eq.status} />
              </td>
              <td className="px-5 py-4 last:pr-6 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" icon={FiEye} onClick={() => setSelectedEqp(eq)}>
                    Details
                  </Button>
                  {eq.status === 'Pending Approval' && (
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        icon={FiCheck}
                        disabled={actionLoading === (eq.id || eq._id)}
                        onClick={() => { setPlatformFeeRate(2); setApproveModal({ open: true, id: eq.id || eq._id }); }}
                      >
                        {actionLoading === (eq.id || eq._id) ? '...' : 'Approve'}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        icon={FiX}
                        onClick={() => setRejectModal({ open: true, id: eq.id || eq._id })}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {eq.status === 'Approved' && (
                    <button
                      onClick={() => setDeleteModal({ open: true, id: eq.id || eq._id, name: eq.name })}
                      disabled={actionLoading === (eq.id || eq._id)}
                      className="p-2 text-[#EF4444] hover:bg-red-50 rounded-[10px] transition-colors"
                      title="Remove Equipment"
                    >
                      <FiTrash2 className="text-base" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </DataTable>
      ) : (
        <EmptyState
          title="No Equipment Found"
          description="No machinery listings match your current search or filter."
          onAction={() => { setSearchTerm(''); setStatusFilter('all'); }}
          actionText="Reset Filters"
        />
      )}

      {/* Rejection Reason Modal */}
      <AnimatePresence>
        {rejectModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRejectModal({ open: false, id: null })}
              className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white border border-[#E2E8F0] rounded-[20px] shadow-2xl p-6 w-full max-w-md z-10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-red-50 rounded-[12px]">
                  <FiAlertCircle className="text-xl text-[#EF4444]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0F172A]">Reject Equipment Listing</h3>
                  <p className="text-xs text-[#64748B]">Provide a reason for the owner</p>
                </div>
              </div>
              <textarea
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Images are unclear, price seems inflated, missing description..."
                className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[12px] text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20 resize-none"
              />
              <div className="flex gap-2 mt-4">
                <Button variant="secondary" onClick={() => { setRejectModal({ open: false, id: null }); setRejectionReason(''); }}>
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleRejectConfirm}
                  disabled={!rejectionReason.trim() || actionLoading === rejectModal.id}
                >
                  {actionLoading === rejectModal.id ? 'Rejecting...' : 'Confirm Rejection'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Approval Fee Modal */}
      <AnimatePresence>
        {approveModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setApproveModal({ open: false, id: null })}
              className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white border border-[#E2E8F0] rounded-[20px] shadow-2xl p-6 w-full max-w-md z-10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-emerald-50 rounded-[12px]">
                  <FiCheck className="text-xl text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0F172A]">Approve Equipment</h3>
                  <p className="text-xs text-[#64748B]">Set the platform fee for this listing</p>
                </div>
              </div>
              
              <div className="space-y-1 mb-4 mt-2">
                <label className="text-xs font-semibold text-[#64748B]">Platform Fee (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={platformFeeRate}
                    onChange={(e) => setPlatformFeeRate(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[12px] text-sm font-bold text-[#0F172A] focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[#94A3B8] font-bold">
                    %
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="secondary" onClick={() => { setApproveModal({ open: false, id: null }); }}>
                  Cancel
                </Button>
                <Button
                  variant="success"
                  onClick={handleApproveConfirm}
                  disabled={actionLoading === approveModal.id || platformFeeRate === ''}
                >
                  {actionLoading === approveModal.id ? 'Approving...' : 'Confirm Approval'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedEqp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEqp(null)}
              className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white border border-[#E2E8F0] rounded-[20px] shadow-2xl p-6 w-full max-w-lg z-10 overflow-hidden"
            >
              <button
                onClick={() => setSelectedEqp(null)}
                className="absolute top-4 right-4 z-10 bg-white/80 text-[#64748B] hover:text-[#0F172A] p-1.5 rounded-full"
              >
                <FiXCircle className="text-xl" />
              </button>

              <div className="-mx-6 -mt-6 mb-4 h-48 relative overflow-hidden bg-[#F8FAFC]">
                <img src={selectedEqp.image} alt={selectedEqp.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-3 left-4 bg-[#0F172A]/80 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold">
                  ₹{(selectedEqp.pricePerDay || 0).toLocaleString('en-IN')} / day
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#0F172A]">{selectedEqp.name}</h3>
                  <StatusBadge status={selectedEqp.status} />
                </div>
                <p className="text-xs text-[#64748B]">
                  Listed by <span className="font-bold text-[#0F172A]">{selectedEqp.owner?.name}</span>
                  {selectedEqp.businessName && ` · ${selectedEqp.businessName}`}
                </p>
                <p className="text-xs text-[#64748B]">📍 {selectedEqp.location || selectedEqp.locationAddress}</p>
                {selectedEqp.description && (
                  <p className="text-xs text-[#64748B] leading-relaxed">{selectedEqp.description}</p>
                )}
                {selectedEqp.rejectionReason && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-[12px] text-xs text-[#EF4444]">
                    <span className="font-bold">Rejection Reason:</span> {selectedEqp.rejectionReason}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setSelectedEqp(null)}>Close</Button>
                {selectedEqp.status === 'Pending Approval' && (
                  <>
                    <Button
                      variant="success"
                      onClick={() => { handleApprove(selectedEqp.id || selectedEqp._id); setSelectedEqp(null); }}
                    >
                      Approve Listing
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => { setRejectModal({ open: true, id: selectedEqp.id || selectedEqp._id }); setSelectedEqp(null); }}
                    >
                      Reject Listing
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirm Delete Modal */}
      <AnimatePresence>
        {deleteModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white border border-[#E2E8F0] rounded-[20px] shadow-2xl p-6 w-full max-w-md z-10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-100 text-[#EF4444] rounded-full">
                  <FiAlertCircle className="text-xl" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A]">Remove Equipment</h3>
              </div>
              <p className="text-sm text-[#64748B] mb-6">
                Are you sure you want to permanently remove "{deleteModal.name}" from the platform? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setDeleteModal({ open: false, id: null, name: '' })}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleDeleteConfirm}
                  disabled={actionLoading === deleteModal.id}
                  className="!bg-[#EF4444] hover:!bg-red-600 border-none"
                >
                  {actionLoading === deleteModal.id ? 'Removing...' : 'Remove Equipment'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Equipment;
