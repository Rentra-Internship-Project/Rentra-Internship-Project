import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { equipmentService, bookingService, authService, notificationService } from '../services/api';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [equipmentList, setEquipmentList] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [globalSearch, setGlobalSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Build profile from user object
  useEffect(() => {
    if (user) {
      setProfile({
        id: user._id || user.id,
        name: user.name,
        role: user.role,
        email: user.email,
        phone: user.phone || '',
        avatar: user.avatar,
        cover: user.cover,
        companyName: user.companyName || '',
        businessType: user.businessType || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zip: user.zip || '',
        stats: { totalBookings: 0, activeRentals: 0, wishlistItems: 0, totalSpent: '₹0' },
      });
      // Load wishlist IDs from user document (MongoDB source of truth)
      if (user.wishlist && Array.isArray(user.wishlist)) {
        setWishlistIds(user.wishlist.map((w) => (typeof w === 'object' ? w._id || w.id : w)));
      }
    } else {
      setProfile(null);
      setWishlistIds([]);
    }
  }, [user]);

  // Fetch public marketplace equipment (only Approved+Available — server filters)
  const fetchEquipment = useCallback(async () => {
    try {
      const res = await equipmentService.getAll();
      setEquipmentList(res.data || []);
    } catch (err) {
      console.error('Failed to fetch equipment:', err);
    }
  }, []);

  // Fetch customer's own bookings
  const fetchBookings = useCallback(async () => {
    if (!user) return;
    try {
      const res = await bookingService.getMyBookings();
      const mapped = (res.data || []).map((b) => ({
        ...b,
        id: b._id || b.id,
        startDate: new Date(b.startDate).toLocaleDateString('en-IN'),
        endDate: new Date(b.endDate).toLocaleDateString('en-IN'),
        image: b.equipmentId?.image || 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=800',
        category: b.equipmentId?.category || 'Heavy Machinery',
        locationAddress: b.equipmentId?.locationAddress || '',
        ownerName: b.ownerId?.name || 'Unknown Owner',
        ownerPhone: b.ownerId?.phone || '',
        ownerEmail: b.ownerId?.email || '',
      }));
      setBookings(mapped);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    }
  }, [user]);

  // Fetch notifications from DB
  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const res = await notificationService.getAll();
      setNotifications(res.data?.notifications || []);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, [user]);

  // Initial data load
  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(true);
      await Promise.all([fetchEquipment(), fetchBookings(), fetchNotifications()]);
      setIsLoading(false);
    };
    loadAll();
  }, [fetchEquipment, fetchBookings, fetchNotifications]);

  // Real-time: refresh bookings on Socket.IO notification
  const { socket } = useSocket();
  useEffect(() => {
    if (!socket || !user) return;
    const handleNotification = (notifData) => {
      setNotifications((prev) => [notifData, ...prev]);
      fetchBookings();
    };
    socket.on('notification', handleNotification);
    return () => socket.off('notification', handleNotification);
  }, [socket, user, fetchBookings]);

  // ─── Wishlist ───────────────────────────────────────────────────────────────
  const toggleWishlist = async (equipmentId) => {
    const id = typeof equipmentId === 'object' ? equipmentId._id || equipmentId.id : equipmentId;
    // Optimistic update
    setWishlistIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    if (user) {
      try {
        await authService.toggleWishlist(id);
      } catch (err) {
        // Revert on failure
        console.error('Failed to sync wishlist:', err);
        setWishlistIds((prev) =>
          prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
      }
    }
  };

  const isInWishlist = (equipmentId) => {
    const id = typeof equipmentId === 'object' ? equipmentId._id || equipmentId.id : equipmentId;
    return wishlistIds.includes(id);
  };

  const wishlistEquipment = equipmentList.filter((item) => item && isInWishlist(item.id || item._id));

  // ─── Booking Actions ────────────────────────────────────────────────────────
  // Create a booking immediately (no more fake prepareBookingSummary)
  const createBooking = async (bookingData) => {
    try {
      const res = await bookingService.create(bookingData);
      const newBooking = res.data.booking || res.data;
      const mapped = {
        ...newBooking,
        id: newBooking._id || newBooking.id,
        startDate: new Date(newBooking.startDate).toLocaleDateString('en-IN'),
        endDate: new Date(newBooking.endDate).toLocaleDateString('en-IN'),
      };
      setBookings((prev) => [mapped, ...prev]);
      return { success: true, booking: mapped };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Failed to create booking',
      };
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      await bookingService.updateStatus(bookingId, 'Cancelled');
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled' } : b))
      );
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to cancel' };
    }
  };

  const requestReturn = async (bookingId) => {
    try {
      await bookingService.updateStatus(bookingId, 'Return Requested');
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'Return Requested' } : b))
      );
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to request return' };
    }
  };

  const rateBooking = async (bookingId, rating, review = '') => {
    try {
      await bookingService.rateBooking(bookingId, rating, review);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, rating, review } : b))
      );
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to submit rating' };
    }
  };

  // ─── Profile Updates ────────────────────────────────────────────────────────
  const updateProfile = async (updatedData) => {
    try {
      const res = await authService.updateProfile(updatedData);
      const updatedUser = res.data.user;
      setProfile((prev) => ({ ...prev, ...updatedData, ...updatedUser }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Update failed' };
    }
  };

  // ─── Notification Actions ───────────────────────────────────────────────────
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

  const deleteNotification = (notifId) => {
    setNotifications((prev) =>
      prev.filter((n) => n.id !== notifId && n._id !== notifId)
    );
  };

  // Derived values
  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  // Stats from real booking data
  const customerStats = {
    totalBookings: bookings.length,
    activeRentals: bookings.filter((b) => b.status === 'Rental Active').length,
    wishlistItems: wishlistIds.length,
    totalSpent: '₹' + bookings
      .filter((b) => ['Completed', 'Rental Active', 'Deposit Paid'].includes(b.status))
      .reduce((sum, b) => sum + (b.totalValue || 0), 0)
      .toLocaleString('en-IN'),
  };

  return (
    <CustomerContext.Provider
      value={{
        profile: profile || { name: 'Guest', stats: { activeRentals: 0, wishlistItems: 0 } },
        updateProfile,
        equipmentList,
        wishlistIds,
        wishlistEquipment,
        toggleWishlist,
        isInWishlist,
        bookings,
        createBooking,
        cancelBooking,
        requestReturn,
        rateBooking,
        fetchBookings,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        unreadNotifCount,
        customerStats,
        globalSearch,
        setGlobalSearch,
        isLoading,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
};
