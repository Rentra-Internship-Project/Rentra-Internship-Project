import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEye, FiLock, FiUnlock, FiTrash2, FiUser, FiMail, FiPhone, FiCalendar, FiX } from 'react-icons/fi';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import SearchBar from '../../components/common/SearchBar';
import ConfirmModal from '../../components/common/ConfirmModal';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { mockUsers as initialUsers } from '../../data/adminMockData';

const Users = () => {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  // Search & Filter Logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || u.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesRole = roleFilter === 'all' || u.role.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Action Handlers
  const handleToggleBlock = (userId) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === 'Active' ? 'Blocked' : 'Active';
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const handleDeleteUser = () => {
    if (userToDelete) {
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setUserToDelete(null);
    }
  };

  const columns = ['User Name', 'Email', 'Role', 'Phone', 'Status', 'Joined Date', 'Actions'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">User Management</h1>
          <p className="text-xs md:text-sm text-[#64748B] mt-0.5">Manage all registered marketplace customers and verified business owners.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-[12px] text-[#0F172A]">
            Total Users: {users.length}
          </span>
        </div>
      </div>

      {/* Controls & Search */}
      <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-5 shadow-xs">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedFilter={statusFilter}
          onFilterChange={setStatusFilter}
          filterOptions={[
            { label: 'Active Status', value: 'active' },
            { label: 'Blocked Status', value: 'blocked' },
          ]}
          placeholder="Search users by name, email, or phone..."
        />

        {/* Role Sub-Filter */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#E2E8F0]">
          <span className="text-xs font-semibold text-[#64748B]">Filter Role:</span>
          {['all', 'Customer', 'Business Owner'].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role.toLowerCase())}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                roleFilter === role.toLowerCase()
                  ? 'bg-[#CCCCFF] text-[#0F172A] font-semibold'
                  : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#E2E8F0]'
              }`}
            >
              {role === 'all' ? 'All Roles' : role}
            </button>
          ))}
        </div>
      </div>

      {/* Users Data Table */}
      {filteredUsers.length > 0 ? (
        <DataTable columns={columns}>
          {filteredUsers.map((user) => (
            <tr key={user.id} className="hover:bg-[#F8FAFC] transition-colors">
              {/* User Name & Avatar */}
              <td className="px-5 py-4 first:pl-6 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-[#E2E8F0]"
                  />
                  <div>
                    <p className="font-bold text-[#0F172A] text-sm">{user.name}</p>
                    <span className="text-[10px] text-[#64748B] font-mono">{user.id}</span>
                  </div>
                </div>
              </td>

              {/* Email */}
              <td className="px-5 py-4 whitespace-nowrap text-xs text-[#64748B]">{user.email}</td>

              {/* Role */}
              <td className="px-5 py-4 whitespace-nowrap">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.role === 'Business Owner' ? 'bg-purple-50 text-purple-700 font-semibold' : 'bg-blue-50 text-blue-700'
                }`}>
                  {user.role}
                </span>
              </td>

              {/* Phone */}
              <td className="px-5 py-4 whitespace-nowrap text-xs text-[#64748B]">{user.phone}</td>

              {/* Status */}
              <td className="px-5 py-4 whitespace-nowrap">
                <StatusBadge status={user.status} />
              </td>

              {/* Joined Date */}
              <td className="px-5 py-4 whitespace-nowrap text-xs text-[#64748B]">{user.joinedDate}</td>

              {/* Actions */}
              <td className="px-5 py-4 last:pr-6 whitespace-nowrap">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="p-2 rounded-[10px] text-[#3B82F6] hover:bg-blue-50 transition-colors"
                    title="View Details"
                  >
                    <FiEye className="text-base" />
                  </button>

                  <button
                    onClick={() => handleToggleBlock(user.id)}
                    className={`p-2 rounded-[10px] transition-colors ${
                      user.status === 'Active' ? 'text-[#F59E0B] hover:bg-amber-50' : 'text-[#22C55E] hover:bg-green-50'
                    }`}
                    title={user.status === 'Active' ? 'Block User' : 'Unblock User'}
                  >
                    {user.status === 'Active' ? <FiLock className="text-base" /> : <FiUnlock className="text-base" />}
                  </button>

                  <button
                    onClick={() => setUserToDelete(user)}
                    className="p-2 rounded-[10px] text-[#EF4444] hover:bg-red-50 transition-colors"
                    title="Delete User"
                  >
                    <FiTrash2 className="text-base" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </DataTable>
      ) : (
        <EmptyState
          title="No Users Match Query"
          description="Try clearing your search keyword or selecting a different status filter."
          onAction={() => {
            setSearchTerm('');
            setStatusFilter('all');
            setRoleFilter('all');
          }}
          actionText="Reset Filters"
        />
      )}

      {/* User Details Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white border border-[#E2E8F0] rounded-[20px] shadow-2xl p-6 w-full max-w-lg z-10"
            >
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute top-4 right-4 text-[#64748B] hover:text-[#0F172A] p-1.5 rounded-full hover:bg-[#F8FAFC]"
              >
                <FiX className="text-lg" />
              </button>

              <div className="flex items-center gap-4 pb-4 border-b border-[#E2E8F0]">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-[#CCCCFF]"
                />
                <div>
                  <h3 className="text-lg font-bold text-[#0F172A]">{selectedUser.name}</h3>
                  <p className="text-xs text-[#64748B] font-mono">{selectedUser.id}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <StatusBadge status={selectedUser.status} />
                    <span className="text-xs font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                      {selectedUser.role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="py-4 space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-[12px]">
                  <span className="text-[#64748B] flex items-center gap-2">
                    <FiMail /> Email Address
                  </span>
                  <span className="font-semibold text-[#0F172A]">{selectedUser.email}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-[12px]">
                  <span className="text-[#64748B] flex items-center gap-2">
                    <FiPhone /> Contact Number
                  </span>
                  <span className="font-semibold text-[#0F172A]">{selectedUser.phone}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-[12px]">
                  <span className="text-[#64748B] flex items-center gap-2">
                    <FiCalendar /> Member Since
                  </span>
                  <span className="font-semibold text-[#0F172A]">{selectedUser.joinedDate}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E2E8F0] flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setSelectedUser(null)}>
                  Close
                </Button>
                <Button
                  variant={selectedUser.status === 'Active' ? 'warning' : 'success'}
                  onClick={() => {
                    handleToggleBlock(selectedUser.id);
                    setSelectedUser(null);
                  }}
                >
                  {selectedUser.status === 'Active' ? 'Block User' : 'Unblock User'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete User Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(userToDelete)}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteUser}
        title="Delete Marketplace User"
        message={`Are you sure you want to permanently delete user "${userToDelete?.name}"? All associated platform history will be revoked.`}
        confirmText="Permanently Delete"
        type="danger"
      />
    </motion.div>
  );
};

export default Users;
