import React, { createContext, useContext, useState, useEffect } from 'react';
import { equipmentService, bookingService } from '../services/api';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const { user } = useAuth();
  
  // Use auth user data if available
  const initialProfile = user ? {
    id: user.id,
    name: user.name,
    role: user.role,
    email: user.email,
    phone: user.phone || '+1 (555) 234-5678',
    companyName: user.company || 'Apex Infrastructures LLC',
    avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    cover: user.cover || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&q=80&w=1200',
    stats: { totalBookings: 0, activeRentals: 0, wishlistItems: 0, totalSpent: '₹0' },
    security: { twoFactorEnabled: false, emailNotifications: true, smsAlerts: false },
    activityLog: [],
  } : null;

  const [profile, setProfile] = useState(initialProfile);
  const [equipmentList, setEquipmentList] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(() => {
    const saved = localStorage.getItem('rentra_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('rentra_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [globalSearch, setGlobalSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Live Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // We only fetch equipment if we have an auth session, or we could fetch it anyway
        // Wait, equipment might be public, but let's fetch both concurrently
        const [eqRes, bkRes] = await Promise.all([
          equipmentService.getAll(),
          user ? bookingService.getAll() : { data: [] }
        ]);
        setEquipmentList(eqRes.data || []);
        // Filter bookings to only show customer's bookings if they are logged in
        if (user && bkRes.data) {
          const myBookings = bkRes.data
            .filter(b => (b.customerId?._id || b.customerId?.id || b.customerId) === user.id)
            .map(b => {
              const eq = (eqRes.data || []).find(e => e.id === b.equipmentId);
              return {
                ...b,
                id: b._id || b.id,
                startDate: new Date(b.startDate).toLocaleDateString(),
                endDate: new Date(b.endDate).toLocaleDateString(),
                image: eq ? eq.image : 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=800',
                category: eq ? eq.category : 'Heavy Machinery',
                ownerName: eq ? eq.owner.name : 'Unknown Owner'
              };
            });
          setBookings(myBookings);
        }
      } catch (err) {
        console.error('Failed to fetch customer data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  // Realtime updates listener
  const { socket } = useSocket();
  useEffect(() => {
    if (!socket || !user || !equipmentList.length) return;

    const handleNotification = async () => {
      // Whenever a socket notification arrives (e.g. Booking Updated), refresh bookings
      try {
        const bkRes = await bookingService.getAll();
        const myBookings = bkRes.data
          .filter(b => (b.customerId?._id || b.customerId?.id || b.customerId) === user.id)
          .map(b => {
            const eq = equipmentList.find(e => e.id === b.equipmentId);
            return {
              ...b,
              id: b._id || b.id,
              startDate: new Date(b.startDate).toLocaleDateString(),
              endDate: new Date(b.endDate).toLocaleDateString(),
              image: eq ? eq.image : 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=800',
              category: eq ? eq.category : 'Heavy Machinery',
              ownerName: eq ? eq.owner.name : 'Unknown Owner'
            };
          });
        setBookings(myBookings);
      } catch (err) {
        console.error('Failed to realtime sync bookings', err);
      }
    };

    socket.on('notification', handleNotification);
    return () => socket.off('notification', handleNotification);
  }, [socket, user, equipmentList]);

  // Update wishlist state when user logs in and profile loads
  useEffect(() => {
    if (user && user.wishlist) {
      setWishlistIds(user.wishlist);
    }
  }, [user]);

  // Wishlist actions
  const toggleWishlist = async (equipmentId) => {
    // Optimistic UI update
    setWishlistIds((prev) => {
      if (prev.includes(equipmentId)) {
        return prev.filter((id) => id !== equipmentId);
      } else {
        return [...prev, equipmentId];
      }
    });

    // Sync with backend if logged in
    if (user) {
      try {
        import('../services/api').then(({ authService }) => {
           authService.toggleWishlist(equipmentId);
        });
      } catch (err) {
        console.error('Failed to sync wishlist with database', err);
      }
    }
  };

  const removeFromWishlist = async (equipmentId) => {
    setWishlistIds((prev) => prev.filter((id) => id !== equipmentId));
    if (user) {
      try {
        import('../services/api').then(({ authService }) => {
           authService.toggleWishlist(equipmentId); // The backend toggles it, so calling it removes it
        });
      } catch (err) {}
    }
  };

  const isInWishlist = (equipmentId) => wishlistIds.includes(equipmentId);

  // Draft booking held in session/memory before deposit payment
  const [draftBooking, setDraftBooking] = useState(null);

  const prepareBookingSummary = (bookingData) => {
    const bookingId = `BK-${Math.floor(10000 + Math.random() * 90000)}`;
    const summary = {
      id: bookingId,
      bookingDate: new Date().toISOString().split('T')[0],
      status: 'Pending Deposit',
      depositStatus: 'Pending Deposit',
      refundStatus: 'Pending Completion',
      ...bookingData,
    };
    setDraftBooking(summary);
    return summary;
  };

  // Pay Deposit action - Now makes real API call
  const confirmDepositPayment = async (bookingId, paymentMethod) => {
    const targetBooking = draftBooking || bookings.find((b) => b.id === bookingId);
    if (!targetBooking) return null;

    try {
      // Actually create the booking on the backend
      const res = await bookingService.create({
        ...targetBooking,
        paymentMethod: paymentMethod || 'UPI (alex@okaxis)',
        status: 'Pending Owner Approval',
        depositStatus: 'Deposit Paid',
      });
      
      const createdBooking = res.data;
      const eq = equipmentList.find(e => e.id === createdBooking.equipmentId);
      const mappedBooking = {
        ...createdBooking,
        id: createdBooking._id || createdBooking.id,
        startDate: new Date(createdBooking.startDate).toLocaleDateString(),
        endDate: new Date(createdBooking.endDate).toLocaleDateString(),
        image: eq ? eq.image : 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=800',
        category: eq ? eq.category : 'Heavy Machinery',
        ownerName: eq ? eq.owner.name : 'Unknown Owner'
      };

      setBookings((prev) => [mappedBooking, ...prev.filter((b) => b.id !== bookingId && b.id !== createdBooking.id)]);
      setDraftBooking(null);

      // Notification
      const notif = {
        id: `NOTIF-${Date.now()}`,
        title: 'Deposit Paid - Request Sent',
        message: `Security deposit of ₹${targetBooking.deposit.toLocaleString()} paid for ${targetBooking.equipmentName}. Request sent to owner.`,
        time: 'Just now',
        type: 'Payment Successful',
        read: false,
        link: `/customer/bookings/${createdBooking.id}`,
      };
      setNotifications((prev) => [notif, ...prev]);
      return createdBooking;
    } catch (err) {
      console.error('Failed to create booking', err);
      alert('Booking creation failed: ' + err.message);
      return null;
    }
  };

  // Pay Remaining Balance action
  const payRemainingBalance = async (bookingId, paymentMethod) => {
    try {
      const res = await bookingService.updateStatus(bookingId, 'ACTIVE');
      const updated = res.data;
      
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, ...updated, remainingBalance: 0 } : b))
      );

      const notif = {
        id: `NOTIF-${Date.now()}`,
        title: 'Remaining Balance Paid',
        message: `Remaining payment completed for Booking #${bookingId}. Rental is now ACTIVE!`,
        time: 'Just now',
        type: 'Payment Successful',
        read: false,
        link: `/customer/bookings/${bookingId}`,
      };
      setNotifications((prev) => [notif, ...prev]);
    } catch (err) {
       console.error('Failed to update booking status', err);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      const res = await bookingService.updateStatus(bookingId, 'CANCELLED');
      const updated = res.data;

      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, ...updated } : b))
      );
      
      const notif = {
        id: `NOTIF-${Date.now()}`,
        title: 'Booking Cancelled',
        message: `Booking #${bookingId} was successfully cancelled. Deposit refunded.`,
        time: 'Just now',
        type: 'Booking Cancelled',
        read: false,
        link: `/customer/bookings/${bookingId}`,
      };
      setNotifications((prev) => [notif, ...prev]);
    } catch (err) {
       console.error('Failed to cancel booking', err);
    }
  };

  const markNotificationRead = (notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (notifId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notifId));
  };

  const updateProfile = async (updatedData) => {
    setProfile((prev) => ({
      ...prev,
      ...updatedData,
    }));
    if (user) {
      try {
        import('../services/api').then(({ authService }) => {
           authService.updateProfile(updatedData);
        });
      } catch (err) {
        console.error('Failed to sync profile to database', err);
      }
    }
  };

  const unreadNotifCount = notifications.filter((n) => !n.read).length;
  const wishlistEquipment = equipmentList.filter((item) => wishlistIds.includes(item.id));

  return (
    <CustomerContext.Provider
      value={{
        profile: profile || { name: 'Guest', stats: { activeRentals: 0, wishlistItems: 0 } },
        updateProfile,
        equipmentList,
        wishlistIds,
        wishlistEquipment,
        toggleWishlist,
        removeFromWishlist,
        isInWishlist,
        bookings,
        draftBooking,
        prepareBookingSummary,
        confirmDepositPayment,
        payRemainingBalance,
        cancelBooking,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        unreadNotifCount,
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
