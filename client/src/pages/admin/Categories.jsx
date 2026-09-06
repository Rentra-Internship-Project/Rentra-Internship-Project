import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiLayers, FiX } from 'react-icons/fi';
import DataTable from '../../components/admin/DataTable';
import SearchBar from '../../components/common/SearchBar';
import ConfirmModal from '../../components/common/ConfirmModal';
import Button from '../../components/common/Button';
import { categoryService } from '../../services/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await categoryService.getAll();
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Form State
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');

  // Search Filter
  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open Modal for Add
  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setFormName('');
    setFormDesc('');
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (category) => {
    setEditingCategory(category);
    setFormName(category.name);
    setFormDesc(category.description);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id || editingCategory._id, { name: formName, description: formDesc });
      } else {
        await categoryService.create({ name: formName, description: formDesc });
      }
      await fetchCategories();
      setIsModalOpen(false);
      setEditingCategory(null);
    } catch (err) {
      alert('Failed to save category');
    }
  };

  const handleConfirmDelete = async () => {
    if (categoryToDelete) {
      try {
        await categoryService.delete(categoryToDelete.id || categoryToDelete._id);
        await fetchCategories();
      } catch (err) {
        alert('Failed to delete category');
      }
      setCategoryToDelete(null);
    }
  };

  const columns = ['Category Name', 'Description', 'Equipment Count', 'Actions'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Category Management</h1>
          <p className="text-xs md:text-sm text-[#64748B] mt-0.5">
            Organize heavy equipment listings into industrial category taxonomies.
          </p>
        </div>
        <Button variant="primary" icon={FiPlus} onClick={handleOpenAddModal}>
          Add New Category
        </Button>
      </div>

      {/* Controls */}
      <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-5 shadow-xs">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Search categories by name or description..."
        />
      </div>

      {/* Categories Table */}
      <DataTable columns={columns}>
        {filteredCategories.map((cat) => (
          <tr key={cat.id} className="hover:bg-[#F8FAFC] transition-colors">
            {/* Category Name */}
            <td className="px-5 py-4 first:pl-6 whitespace-nowrap">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-[#CCCCFF]/30 text-[#0F172A] flex items-center justify-center font-bold">
                  <FiLayers className="text-base" />
                </div>
                <div>
                  <p className="font-bold text-[#0F172A] text-sm">{cat.name}</p>
                  <span className="text-[10px] text-[#64748B] font-mono">{cat.id}</span>
                </div>
              </div>
            </td>

            {/* Description */}
            <td className="px-5 py-4 max-w-md text-xs text-[#64748B] truncate">{cat.description}</td>

            {/* Equipment Count */}
            <td className="px-5 py-4 whitespace-nowrap">
              <span className="px-3 py-1 bg-slate-100 text-[#0F172A] text-xs font-bold rounded-full">
                {cat.equipmentCount} assets
              </span>
            </td>

            {/* Actions */}
            <td className="px-5 py-4 last:pr-6 whitespace-nowrap">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEditModal(cat)}
                  className="p-2 text-[#3B82F6] hover:bg-blue-50 rounded-[10px] transition-colors"
                  title="Edit Category"
                >
                  <FiEdit2 className="text-base" />
                </button>
                <button
                  onClick={() => setCategoryToDelete(cat)}
                  className="p-2 text-[#EF4444] hover:bg-red-50 rounded-[10px] transition-colors"
                  title="Delete Category"
                >
                  <FiTrash2 className="text-base" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      {/* Add / Edit Category Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white border border-[#E2E8F0] rounded-[20px] shadow-2xl p-4 md:p-6 w-full max-w-md z-10"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-[#64748B] hover:text-[#0F172A] p-1.5 rounded-full hover:bg-[#F8FAFC]"
              >
                <FiX className="text-lg" />
              </button>

              <div className="flex items-center gap-3 pb-4 border-b border-[#E2E8F0]">
                <div className="p-2.5 bg-[#CCCCFF]/40 text-[#0F172A] rounded-[12px]">
                  <FiLayers className="text-xl" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A]">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h3>
              </div>

              <form onSubmit={handleSaveCategory} className="py-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Category Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Mining & Tunneling"
                    className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[12px] text-xs text-[#0F172A] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Description</label>
                  <textarea
                    rows="3"
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Describe equipment type contained in this category..."
                    className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-[12px] text-xs text-[#0F172A] focus:outline-none focus:border-[#CCCCFF] focus:ring-2 focus:ring-[#CCCCFF]/30"
                  />
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] flex justify-end gap-2">
                  <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    {editingCategory ? 'Update Category' : 'Create Category'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={Boolean(categoryToDelete)}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Equipment Category"
        message={`Are you sure you want to delete "${categoryToDelete?.name}"? Equipment currently listed under this category will need reassignment.`}
        confirmText="Delete Category"
        type="danger"
      />
    </motion.div>
  );
};

export default Categories;
