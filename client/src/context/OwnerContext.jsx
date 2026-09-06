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
  const fetchBusiness = useCallback(async (silent = false) => {
    if (!user || user.role !== 'OWNER') return;
    try {
      if (!silent) setBusinessLoading(true);
      const res = await businessService.getMyBusiness();
      setBusiness(res.data.business || null);
    } catch (err) {
      console.error('Failed to fetch business:', err);
      setBusiness(null);
    } finally {
      if (!silent) setBusinessLoading(false);
    }
  }, [user]);

  // Fetch owner's own equipment (all statuses) and bookings
  const fetchData = useCallback(async (silent = false) => {
    if (!user || user.role !== 'OWNER') return;
    try {
      if (!silent) setIsLoading(true);
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
      if (!silent) setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBusiness();
    fetchData();
  }, [fetchBusiness, fetchData]);

  // Real-time: multi-module live updates on Socket.IO notification without refresh
  const { socket } = useSocket();
  useEffect(() => {
    if (!socket || !user) return;

    const handleNotification = async (notifData) => {
      // 1. Add live notification to toast and notification center
      setNotifications((prev) => [notifData, ...prev]);

      const type = notifData?.type || '';

      // 2. Direct reactive UI updates without page refresh
      if (type.startsWith('Business')) {
        await fetchBusiness(true);
      } else if (type.startsWith('Equipment')) {
        await fetchData(true);
      } else if (type.startsWith('Booking') || type.startsWith('Deposit') || type.startsWith('Rental')) {
        await Promise.all([fetchData(true), fetchBusiness(true)]);
      } else {
        // Fallback for general notifications, payouts, refunds, etc.
        await Promise.all([fetchData(true), fetchBusiness(true)]);
      }
    };

    socket.on('notification', handleNotification);

    // Safety Net: Auto-sync when window or tab regains focus or visibility
    const handleSyncOnFocus = () => {
      if (document.visibilityState === 'visible') {
        fetchBusiness(true);
        fetchData(true);
      }
    };

    window.addEventListener('focus', handleSyncOnFocus);
    document.addEventListener('visibilitychange', handleSyncOnFocus);

    return () => {
      socket.off('notification', handleNotification);
      window.removeEventListener('focus', handleSyncOnFocus);
      document.removeEventListener('visibilitychange', handleSyncOnFocus);
    };
  }, [socket, user, fetchBusiness, fetchData]);

  // Smart Polling Fallback: Check every 15s ONLY while business is pending approval
  useEffect(() => {
    if (!business || business.status !== 'Pending') return;

    const interval = setInterval(() => {
      fetchBusiness(true);
    }, 15000);

    return () => clearInterval(interval);
  }, [business?.status, fetchBusiness]);

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
