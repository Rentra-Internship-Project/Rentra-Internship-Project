import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { adminService, equipmentService } from '../services/api';
import { useSocket } from './SocketContext';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [stats, setStats] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [users, setUsers] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAdminData = useCallback(async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      const [statsRes, bizRes, usersRes, eqRes, bkRes] = await Promise.all([
        adminService.getStats(),
        adminService.getBusinesses(),
        adminService.getUsers(),
        adminService.getEquipment(),   // Admin-scoped: returns ALL statuses
        adminService.getBookings(),
      ]);

      setStats(statsRes.data);

      // Map Businesses — use real field names from Business model
      const mappedBiz = (bizRes.data || []).map((b) => ({
        ...b,
        id: b._id,
        businessName: b.businessName || 'Unknown Business',
        ownerName: b.ownerName || b.ownerId?.name || 'Unknown Owner',
        email: b.email || b.ownerId?.email || 'N/A',
        phone: b.phone || b.ownerId?.phone || 'N/A',
        registrationNumber: b.registrationNumber || '—',
        gstNumber: b.gstNumber || '—',
        taxId: b.taxId || '—',
        documents: (b.documents || []).map((d, i) => ({
          name: `Document_${i + 1}.pdf`,
          size: '—',
          url: d,
        })),
        businessType: b.businessType || 'Equipment Owner',
        status: b.status || 'Pending',
        submittedDate: b.createdAt
          ? new Date(b.createdAt).toLocaleDateString('en-IN')
          : '—',
        rejectionReason: b.rejectionReason || '',
      }));
      setBusinesses(mappedBiz);

      // Map Users
      const mappedUsers = (usersRes.data || []).map((u) => ({
        ...u,
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        phone: u.phone || '—',
        status: u.status || 'Active',
        joinedDate: u.createdAt
          ? new Date(u.createdAt).toLocaleDateString('en-IN')
          : '—',
        avatar:
          u.avatar ||
          'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150',
      }));
      setUsers(mappedUsers);

      // Equipment — already mapped via mapEquipmentResponse in api.js
      setEquipmentList(eqRes.data || []);

      // Map Bookings
      const mappedBookings = (bkRes.data || []).map((b) => ({
        ...b,
        id: b._id,
        customer: b.customerId?.name || 'Unknown Customer',
        owner: b.ownerId?.name || 'Unknown Owner',
        equipment: b.equipmentName || b.equipmentId?.name || 'Unknown Equipment',
        bookingDate: b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-IN') : '—',
        duration: `${b.durationDays || 0} days`,
        startDate: b.startDate ? new Date(b.startDate).toLocaleDateString('en-IN') : '—',
        endDate: b.endDate ? new Date(b.endDate).toLocaleDateString('en-IN') : '—',
        amount: `₹${(b.totalValue || 0).toLocaleString('en-IN')}`,
        status: b.status || 'Pending Approval',
      }));
      setBookings(mappedBookings);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  // Real-time: Refresh admin records and stats on Socket.IO notification
  const { socket } = useSocket();
  useEffect(() => {
    if (!socket) return;

    const handleNotification = () => {
      fetchAdminData(true);
    };

    socket.on('notification', handleNotification);

    // Safety net: Auto-sync when admin focuses or returns to the tab
    const handleSyncOnFocus = () => {
      if (document.visibilityState === 'visible') {
        fetchAdminData(true);
      }
    };
    window.addEventListener('focus', handleSyncOnFocus);
    document.addEventListener('visibilitychange', handleSyncOnFocus);

    return () => {
      socket.off('notification', handleNotification);
      window.removeEventListener('focus', handleSyncOnFocus);
      document.removeEventListener('visibilitychange', handleSyncOnFocus);
    };
  }, [socket, fetchAdminData]);

  return (
    <AdminContext.Provider
      value={{
        stats,
        businesses,
        setBusinesses,
        users,
        setUsers,
        equipmentList,
        setEquipmentList,
        bookings,
        setBookings,
        isLoading,
        refreshData: fetchAdminData,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminContext must be used within AdminProvider');
  }
  return context;
};
