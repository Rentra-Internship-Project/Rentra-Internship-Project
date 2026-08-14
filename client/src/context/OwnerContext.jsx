import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { equipmentService, bookingService, businessService, notificationService } from '../services/api';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

const OwnerContext = createContext();

export const OwnerProvider = ({ children }) => {
  const { user } = useAuth();

  const [equipmentList, setEquipmentList] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [business, setBusiness] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [businessLoading, setBusinessLoading] = useState(true);

  // Fetch owner's business status from DB — NOT from user.company
  const fetchBusiness = useCallback(async () => {
    if (!user || user.role !== 'OWNER') return;
    try {
      setBusinessLoading(true);
      const res = await businessService.getMyBusiness();
      setBusiness(res.data.business || null);
    } catch (err) {
      console.error('Failed to fetch business:', err);
      setBusiness(null);
    } finally {
      setBusinessLoading(false);
    }
  }, [user]);

  // Fetch owner's own equipment (all statuses) and bookings
  const fetchData = useCallback(async () => {
    if (!user || user.role !== 'OWNER') return;
    try {
      setIsLoading(true);
      const [eqRes, bkRes, notifRes] = await Promise.all([
        equipmentService.getMyEquipment(),
        bookingService.getOwnerBookings(),
        notificationService.getAll(),
      ]);

      setEquipmentList(eqRes.data || []);

      // Map booking fields to what UI expects
      const mappedBookings = (bkRes.data || []).map((b) => ({
        ...b,
        id: b._id || b.id,
        amount: b.totalValue || 0,
        startDate: new Date(b.startDate).toLocaleDateString('en-IN'),
        endDate: new Date(b.endDate).toLocaleDateString('en-IN'),
        image: b.equipmentId?.image || 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=800',
        category: b.equipmentId?.category || 'Heavy Machinery',
        equipmentName: b.equipmentName || b.equipmentId?.name || 'Unknown Equipment',
        customerName: b.customerId?.name || 'Unknown Customer',
        customerEmail: b.customerId?.email || '',
        customerPhone: b.customerId?.phone || '',
        customerAvatar: b.customerId?.avatar || null,
      }));

      setBookings(mappedBookings);
      setNotifications(notifRes.data?.notifications || []);
    } catch (err) {
      console.error('Failed to fetch owner data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBusiness();
    fetchData();
  }, [fetchBusiness, fetchData]);

  // Real-time: refresh bookings on Socket.IO notification
  const { socket } = useSocket();
  useEffect(() => {
    if (!socket || !user) return;

    const handleNotification = async (notifData) => {
      // Add live notification to list
      setNotifications((prev) => [notifData, ...prev]);
      // Refresh booking list
      try {
        const bkRes = await bookingService.getOwnerBookings();
        const mappedBookings = (bkRes.data || []).map((b) => ({
          ...b,
          id: b._id || b.id,
          amount: b.totalValue || 0,
          startDate: new Date(b.startDate).toLocaleDateString('en-IN'),
          endDate: new Date(b.endDate).toLocaleDateString('en-IN'),
          image: b.equipmentId?.image || 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=800',
          category: b.equipmentId?.category || 'Heavy Machinery',
          equipmentName: b.equipmentName || b.equipmentId?.name || 'Unknown Equipment',
          customerName: b.customerId?.name || 'Unknown Customer',
          customerEmail: b.customerId?.email || '',
          customerPhone: b.customerId?.phone || '',
          customerAvatar: b.customerId?.avatar || null,
        }));
        setBookings(mappedBookings);
      } catch (err) {
        console.error('Failed to refresh owner bookings:', err);
      }
    };

    socket.on('notification', handleNotification);
    return () => socket.off('notification', handleNotification);
  }, [socket, user]);

  // Derived stats from real data
  const ownerStats = {
    totalEquipment: equipmentList.length,
    approvedEquipment: equipmentList.filter((e) => e.status === 'Approved').length,
    pendingEquipment: equipmentList.filter((e) => e.status === 'Pending Approval').length,
    activeBookings: bookings.filter((b) => b.status === 'Rental Active').length,
    pendingRequests: bookings.filter((b) => b.status === 'Pending Approval').length,
    depositPendingBookings: bookings.filter((b) => b.status === 'Approved').length,
    monthlyEarnings: '₹' + bookings
      .filter((b) => ['Completed', 'Rental Active', 'Deposit Paid'].includes(b.status))
      .reduce((sum, b) => sum + ((b.totalValue || b.rentalCost || 0) - (b.platformFee || 0)), 0)
      .toLocaleString('en-IN'),
  };

  // businessStatus object for backward compat with existing UI components
  const businessStatus = business
    ? {
        status: business.status,
        businessName: business.businessName,
        businessType: business.businessType,
        rejectionReason: business.rejectionReason,
        email: business.email,
        phone: business.phone,
        gstNumber: business.gstNumber,
        city: business.city,
        state: business.state,
      }
    : {
        status: 'Not Registered',
        businessName: '',
        businessType: '',
        rejectionReason: '',
        email: '',
        phone: '',
        gstNumber: '',
        city: '',
        state: '',
      };

  const markNotificationRead = async (notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId || n._id === notifId ? { ...n, read: true } : n))
    );
    try {
      await notificationService.markRead(notifId);
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  };

  const markAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await notificationService.markAllRead();
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  return (
    <OwnerContext.Provider
      value={{
        equipmentList,
        setEquipmentList,
        bookings,
        setBookings,
        business,
        setBusiness,
        businessStatus,
        businessLoading,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        unreadNotifCount,
        isLoading,
        ownerStats,
        refreshData: fetchData,
        refreshBusiness: fetchBusiness,
      }}
    >
      {children}
    </OwnerContext.Provider>
  );
};

export const useOwner = () => {
  const context = useContext(OwnerContext);
  if (!context) {
    throw new Error('useOwner must be used within an OwnerProvider');
  }
  return context;
};
