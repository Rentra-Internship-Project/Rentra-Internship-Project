import React, { createContext, useContext, useState } from 'react';
import {
  customerProfile as initialProfile,
  mockEquipment as initialEquipment,
  mockBookings as initialBookings,
  mockNotifications as initialNotifications,
} from '../data/customerMockData';

const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const [profile, setProfile] = useState(initialProfile);
  const [equipmentList, setEquipmentList] = useState(initialEquipment);
  const [wishlistIds, setWishlistIds] = useState(['EQ-1001', 'EQ-1003', 'EQ-1005']);
  const [bookings, setBookings] = useState(initialBookings);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [globalSearch, setGlobalSearch] = useState('');

  // Wishlist actions
  const toggleWishlist = (equipmentId) => {
    setWishlistIds((prev) => {
      if (prev.includes(equipmentId)) {
        return prev.filter((id) => id !== equipmentId);
      } else {
        return [...prev, equipmentId];
      }
    });
  };

  const removeFromWishlist = (equipmentId) => {
    setWishlistIds((prev) => prev.filter((id) => id !== equipmentId));
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

  // Pay Deposit action
  const confirmDepositPayment = (bookingId, paymentMethod) => {
    const targetBooking = draftBooking || bookings.find((b) => b.id === bookingId);
    if (!targetBooking) return null;

    const createdBooking = {
      ...targetBooking,
      id: bookingId,
      status: 'Pending Owner Approval',
      depositStatus: 'Deposit Paid',
      refundStatus: 'Held in Escrow',
      paymentMethod: paymentMethod || 'UPI (alex@okaxis)',
      timeline: [
        { step: 'Deposit Paid', date: 'Just now', completed: true },
        { step: 'Booking Request Sent', date: 'Just now', completed: true },
        { step: 'Owner Approved', date: 'In Review', completed: false },
        { step: 'Remaining Payment Paid', date: 'Pending Approval', completed: false },
        { step: 'Rental Started', date: `Scheduled ${targetBooking.startDate}`, completed: false },
        { step: 'Rental Completed', date: `Scheduled ${targetBooking.endDate}`, completed: false },
        { step: 'Deposit Refunded', date: 'Pending Completion', completed: false },
      ],
    };

    setBookings((prev) => [createdBooking, ...prev.filter((b) => b.id !== bookingId)]);
    setDraftBooking(null);

    // Notification
    const notif = {
      id: `NOTIF-${Date.now()}`,
      title: 'Deposit Paid - Request Sent',
      message: `Security deposit of ₹${targetBooking.deposit.toLocaleString()} paid for ${targetBooking.equipmentName}. Request sent to owner.`,
      time: 'Just now',
      type: 'Payment Successful',
      read: false,
      link: `/customer/bookings/${bookingId}`,
    };
    setNotifications((prev) => [notif, ...prev]);
    return createdBooking;
  };

  // Pay Remaining Balance action
  const payRemainingBalance = (bookingId, paymentMethod) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          const updatedTimeline = b.timeline.map((item) => {
            if (item.step === 'Remaining Payment Paid' || item.step === 'Rental Started') {
              return { ...item, completed: true, date: 'Just now' };
            }
            return item;
          });
          return {
            ...b,
            status: 'Rental Active',
            remainingBalance: 0,
            amountPaidNow: b.totalValue,
            timeline: updatedTimeline,
          };
        }
        return b;
      })
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
  };

  const cancelBooking = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled', refundStatus: 'Deposit Refunded' } : b))
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

  const updateProfile = (updatedData) => {
    setProfile((prev) => ({
      ...prev,
      ...updatedData,
    }));
  };

  const unreadNotifCount = notifications.filter((n) => !n.read).length;
  const wishlistEquipment = equipmentList.filter((item) => wishlistIds.includes(item.id));

  return (
    <CustomerContext.Provider
      value={{
        profile,
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
