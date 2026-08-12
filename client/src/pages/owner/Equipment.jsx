import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiPlusCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import EquipmentCard from '../../components/owner/EquipmentCard';
import SearchBar from '../../components/common/SearchBar';
import EmptyState from '../../components/common/EmptyState';
import ConfirmModal from '../../components/common/ConfirmModal';
import { useOwner } from '../../context/OwnerContext';
import { equipmentService } from '../../services/api';

const Equipment = () => {
  const navigate = useNavigate();
  const { equipmentList, isLoading } = useOwner();
  const [equipment, setEquipment] = useState(equipmentList);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Sync state if context loads late
  React.useEffect(() => {
    setEquipment(equipmentList);
  }, [equipmentList]);

  const filteredEquipment = useMemo(() => {
    return equipment.filter((eq) => {
      const matchesSearch =
        eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        statusFilter === 'all' || eq.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [equipment, searchTerm, statusFilter]);

  const handleDelete = (id) => {
    setEquipment((prev) => prev.filter((eq) => eq.id !== id));
    setDeleteTarget(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">My Equipment</h1>
          <p className="text-sm text-[#64748B] mt-1">Manage your equipment inventory ({equipment.length} total)</p>
        </div>
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/owner/add-equipment')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#CCCCFF] hover:bg-[#B8B8FF] text-[#0F172A] text-sm font-semibold rounded-[12px] shadow-sm transition-all"
        >
          <FiPlusCircle className="text-base" /> Add Equipment
        </motion.button>
      </div>

      {/* Search & Filter */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search equipment by name, category, or location..."
        selectedFilter={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={[
          { value: 'approved', label: 'Approved' },
          { value: 'pending', label: 'Pending' },
          { value: 'rejected', label: 'Rejected' },
        ]}
      />

      {/* Equipment Grid */}
      {filteredEquipment.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEquipment.map((eq) => (
            <EquipmentCard
              key={eq.id}
              equipment={eq}
              onDelete={(id) => setDeleteTarget(id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Equipment Found"
          description="No equipment matches your search or filter criteria. Try adjusting your search terms."
          actionText="Add Equipment"
          onAction={() => navigate('/owner/add-equipment')}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget)}
        title="Delete Equipment"
        message="Are you sure you want to delete this equipment listing? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </motion.div>
  );
};

export default Equipment;
