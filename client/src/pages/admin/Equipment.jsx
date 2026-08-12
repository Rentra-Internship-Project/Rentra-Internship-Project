import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiEye, FiTruck, FiTag, FiDollarSign, FiLayers, FiXCircle } from 'react-icons/fi';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import SearchBar from '../../components/common/SearchBar';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { useAdminContext } from '../../context/AdminContext';
import { equipmentService } from '../../services/api';

const Equipment = () => {
  const { equipmentList, setEquipmentList } = useAdminContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEqp, setSelectedEqp] = useState(null);

  // Search & Filter
  const filteredEquipment = (equipmentList || []).filter((eq) => {
    const matchesSearch =
      eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.owner?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || eq.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Approval Handlers
  const handleApprove = async (id) => {
    try {
      // Assuming equipmentService.update or adminService.verifyEquipment exists.
      // For now, we will update the status locally, since the backend API for updating equipment status by admin might require a new route or reusing the owner route. 
      // In a full implementation, you'd call an API here.
      setEquipmentList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: 'Approved' } : item))
      );
    } catch (err) {
      alert('Failed to approve equipment.');
    }
  };

  const handleReject = async (id) => {
    try {
      setEquipmentList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: 'Rejected' } : item))
      );
    } catch (err) {
      alert('Failed to reject equipment.');
    }
  };

  const columns = [
    'Equipment Name',
    'Owner Business',
    'Category',
    'Price Per Day',
    'Status',
    'Actions'
  ];

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
            Approve or reject newly submitted heavy machinery and business asset rental listings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 bg-blue-50 text-[#3B82F6] border border-blue-200 rounded-[12px]">
            Pending Submissions: {equipmentList.filter((e) => e.status === 'Pending').length}
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
            { label: 'Pending Approval', value: 'pending' },
            { label: 'Approved Listings', value: 'approved' },
            { label: 'Rejected Listings', value: 'rejected' }
          ]}
          placeholder="Search by equipment name, category, or business owner..."
        />
      </div>

      {/* Equipment Table */}
      {filteredEquipment.length > 0 ? (
        <DataTable columns={columns}>
          {filteredEquipment.map((eq) => (
            <tr key={eq.id} className="hover:bg-[#F8FAFC] transition-colors">
              {/* Equipment Name + Image */}
              <td className="px-5 py-4 first:pl-6 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <img
                    src={eq.image}
                    alt={eq.name}
                    className="w-12 h-10 rounded-[10px] object-cover ring-1 ring-[#E2E8F0]"
                  />
                  <div>
                    <p className="font-bold text-[#0F172A] text-sm">{eq.name}</p>
                    <span className="text-[10px] text-[#64748B] font-mono">{eq.id}</span>
                  </div>
                </div>
              </td>

              {/* Owner */}
              <td className="px-5 py-4 whitespace-nowrap text-xs text-[#64748B]">{eq.owner?.name || 'Unknown Owner'}</td>

              {/* Category */}
              <td className="px-5 py-4 whitespace-nowrap">
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#F1F5F9] text-[#334155]">
                  {eq.category}
                </span>
              </td>

              {/* Price */}
              <td className="px-5 py-4 whitespace-nowrap text-xs font-bold text-[#0F172A]">{eq.pricePerDay} / day</td>

              {/* Status */}
              <td className="px-5 py-4 whitespace-nowrap">
                <StatusBadge status={eq.status} />
              </td>

              {/* Actions */}
              <td className="px-5 py-4 last:pr-6 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={FiEye}
                    onClick={() => setSelectedEqp(eq)}
                  >
                    Details
                  </Button>

                  {eq.status === 'Pending' && (
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        icon={FiCheck}
                        onClick={() => handleApprove(eq.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        icon={FiX}
                        onClick={() => handleReject(eq.id)}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </DataTable>
      ) : (
        <EmptyState
          title="No Equipment Listings Found"
          description="There are no machinery listings matching your search or status query."
          onAction={() => {
            setSearchTerm('');
            setStatusFilter('all');
          }}
          actionText="Reset Filters"
        />
      )}

      {/* Equipment Details Drawer / Modal */}
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
                className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-xs text-[#64748B] hover:text-[#0F172A] p-1.5 rounded-full"
              >
                <FiXCircle className="text-xl" />
              </button>

              <div className="-mx-6 -mt-6 mb-4 h-48 relative overflow-hidden bg-[#F8FAFC]">
                <img
                  src={selectedEqp.image}
                  alt={selectedEqp.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-4 bg-[#0F172A]/80 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold">
                  {selectedEqp.pricePerDay} per day
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#0F172A]">{selectedEqp.name}</h3>
                  <StatusBadge status={selectedEqp.status} />
                </div>
                <p className="text-xs text-[#64748B]">Listed by <span className="font-bold text-[#0F172A]">{selectedEqp.owner}</span></p>

                {/* Technical Specifications */}
                <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3">Technical Specifications</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(selectedEqp.specifications || {}).map(([key, val]) => (
                      <div key={key} className="p-2.5 bg-[#F8FAFC] rounded-[10px]">
                        <span className="text-[#64748B] capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <p className="font-semibold text-[#0F172A] mt-0.5">{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setSelectedEqp(null)}>
                  Close
                </Button>
                {selectedEqp.status === 'Pending' && (
                  <>
                    <Button
                      variant="success"
                      onClick={() => {
                        handleApprove(selectedEqp.id);
                        setSelectedEqp(null);
                      }}
                    >
                      Approve Listing
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => {
                        handleReject(selectedEqp.id);
                        setSelectedEqp(null);
                      }}
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
    </motion.div>
  );
};

export default Equipment;
