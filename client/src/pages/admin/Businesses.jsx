import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiFileText, FiDownload, FiBriefcase, FiUser, FiCalendar, FiShield, FiTrash2 } from 'react-icons/fi';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import SearchBar from '../../components/common/SearchBar';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { useAdminContext } from '../../context/AdminContext';
import { adminService } from '../../services/api';

const Businesses = () => {
  const { businesses: liveBusinesses, setBusinesses: updateLiveBusinesses, isLoading } = useAdminContext();
  const [businesses, setBusinesses] = useState(liveBusinesses || []);
  
  useEffect(() => {
    setBusinesses(liveBusinesses || []);
  }, [liveBusinesses]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDocsBusiness, setSelectedDocsBusiness] = useState(null);

  // Search & Filter
  const filteredBusinesses = businesses.filter((b) => {
    const matchesSearch =
      b.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.businessType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Verification Actions
  const handleApprove = async (id) => {
    try {
      await adminService.verifyBusiness(id, { status: 'Approved' });
      setBusinesses((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'Approved' } : b))
      );
    } catch (err) {
      console.error('Failed to approve business:', err);
    }
  };

  const handleReject = async (id) => {
    try {
      await adminService.verifyBusiness(id, { status: 'Rejected' });
      setBusinesses((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'Rejected' } : b))
      );
    } catch (err) {
      console.error('Failed to reject business:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to completely delete this business profile? This action cannot be undone.")) return;
    try {
      await adminService.deleteBusiness(id);
      setBusinesses((prev) => prev.filter((b) => b.id !== id && b._id !== id));
    } catch (err) {
      console.error('Failed to delete business:', err);
      alert('Failed to delete business: ' + (err.response?.data?.error || err.message));
    }
  };

  const columns = [
    'Business Name',
    'Owner Name',
    'Business Type',
    'Submitted Date',
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
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Business Verifications</h1>
          <p className="text-xs md:text-sm text-[#64748B] mt-0.5">
            Review legal tax documents, registration IDs, and verify business owners before equipment listing.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 bg-amber-50 text-[#F59E0B] border border-amber-200 rounded-[12px]">
            Pending Verifications: {businesses.filter((b) => b.status === 'Pending').length}
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
            { label: 'Pending Verification', value: 'pending' },
            { label: 'Approved Businesses', value: 'approved' },
            { label: 'Rejected Applications', value: 'rejected' }
          ]}
          placeholder="Search by business name, owner, or industry type..."
        />
      </div>

      {/* Businesses Table */}
      {filteredBusinesses.length > 0 ? (
        <DataTable columns={columns}>
          {filteredBusinesses.map((b) => (
            <tr key={b.id} className="hover:bg-[#F8FAFC] transition-colors">
              {/* Business Name */}
              <td className="px-5 py-4 first:pl-6 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[10px] bg-[#CCCCFF]/30 text-[#0F172A] flex items-center justify-center font-bold">
                    <FiBriefcase className="text-base" />
                  </div>
                  <div>
                    <p className="font-bold text-[#0F172A] text-sm">{b.businessName}</p>
                    <span className="text-[10px] text-[#64748B] font-mono">{b.registrationNumber}</span>
                  </div>
                </div>
              </td>

              {/* Owner Name */}
              <td className="px-5 py-4 whitespace-nowrap text-xs font-medium text-[#0F172A]">{b.ownerName}</td>

              {/* Business Type */}
              <td className="px-5 py-4 whitespace-nowrap text-xs text-[#64748B]">{b.businessType}</td>

              {/* Submitted Date */}
              <td className="px-5 py-4 whitespace-nowrap text-xs text-[#64748B]">{b.submittedDate}</td>

              {/* Status */}
              <td className="px-5 py-4 whitespace-nowrap">
                <StatusBadge status={b.status} />
              </td>

              {/* Actions */}
              <td className="px-5 py-4 last:pr-6 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={FiFileText}
                    onClick={() => setSelectedDocsBusiness(b)}
                  >
                    View Docs ({b.documents ? b.documents.length : 0})
                  </Button>

                  {b.status === 'Pending' && (
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        icon={FiCheck}
                        onClick={() => handleApprove(b.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        icon={FiX}
                        onClick={() => handleReject(b.id)}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  
                  <Button
                    variant="danger"
                    size="sm"
                    icon={FiTrash2}
                    onClick={() => handleDelete(b.id || b._id)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </DataTable>
      ) : (
        <EmptyState
          title="No Business Verifications Found"
          description="There are currently no verification applications matching your current filter criteria."
          onAction={() => {
            setSearchTerm('');
            setStatusFilter('all');
          }}
          actionText="Reset Filters"
        />
      )}

      {/* View Documents & Details Modal */}
      <AnimatePresence>
        {selectedDocsBusiness && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDocsBusiness(null)}
              className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white border border-[#E2E8F0] rounded-[20px] shadow-2xl p-6 w-full max-w-xl z-10"
            >
              <button
                onClick={() => setSelectedDocsBusiness(null)}
                className="absolute top-4 right-4 text-[#64748B] hover:text-[#0F172A] p-1.5 rounded-full hover:bg-[#F8FAFC]"
              >
                <FiX className="text-lg" />
              </button>

              <div className="flex items-center gap-3 pb-4 border-b border-[#E2E8F0]">
                <div className="p-3 bg-[#CCCCFF]/30 text-[#0F172A] rounded-[12px]">
                  <FiBriefcase className="text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0F172A]">{selectedDocsBusiness.businessName}</h3>
                  <p className="text-xs text-[#64748B]">Owner: {selectedDocsBusiness.ownerName} • {selectedDocsBusiness.phone}</p>
                </div>
              </div>

              {/* Info Summary */}
              <div className="py-4 grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#F8FAFC] rounded-[12px]">
                  <p className="text-[#64748B]">GST/Tax ID</p>
                  <p className="font-bold text-[#0F172A] mt-0.5">{selectedDocsBusiness.gstNumber}</p>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-[12px]">
                  <p className="text-[#64748B]">Registration No.</p>
                  <p className="font-bold text-[#0F172A] mt-0.5">{selectedDocsBusiness.registrationNumber}</p>
                </div>
              </div>

              {/* Uploaded Documents List */}
              <div className="mt-2">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">Uploaded Verification Files</h4>
                <div className="space-y-2">
                  {(selectedDocsBusiness.documents || []).map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 border border-[#E2E8F0] rounded-[12px] hover:border-[#CCCCFF] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FiFileText className="text-[#3B82F6] text-lg" />
                        <div>
                          <p className="text-xs font-semibold text-[#0F172A]">{typeof doc === 'string' ? doc.split('/').pop() || 'Document' : doc.name || 'Document'}</p>
                          <span className="text-[10px] text-[#64748B]">{typeof doc === 'string' ? 'File' : doc.size || ''}</span>
                        </div>
                      </div>
                      <a
                        href={typeof doc === 'string' && doc.startsWith('http') ? doc : '#'}
                        target={typeof doc === 'string' && doc.startsWith('http') ? '_blank' : '_self'}
                        rel="noreferrer"
                        onClick={(e) => {
                          if (typeof doc !== 'string' || !doc.startsWith('http')) {
                            e.preventDefault();
                            alert(`File URL not available for ${typeof doc === 'string' ? doc : doc.name}`);
                          }
                        }}
                        className="p-2 text-[#3B82F6] hover:bg-blue-50 rounded-[8px] transition-colors inline-block"
                        title="View Document"
                      >
                        <FiDownload className="text-base" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                <StatusBadge status={selectedDocsBusiness.status} />
                <div className="flex items-center gap-2">
                  <Button variant="secondary" onClick={() => setSelectedDocsBusiness(null)}>
                    Close
                  </Button>
                  {selectedDocsBusiness.status === 'Pending' && (
                    <>
                      <Button
                        variant="success"
                        onClick={() => {
                          handleApprove(selectedDocsBusiness.id);
                          setSelectedDocsBusiness(null);
                        }}
                      >
                        Approve Business
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => {
                          handleReject(selectedDocsBusiness.id);
                          setSelectedDocsBusiness(null);
                        }}
                      >
                        Reject Application
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Businesses;
