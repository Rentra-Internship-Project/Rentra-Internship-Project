import React, { createContext, useContext, useState, useEffect } from 'react';
import { equipmentService, bookingService } from '../services/api';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

const OwnerContext = createContext();

export const OwnerProvider = ({ children }) => {
  const { user } = useAuth();
  
  const [equipmentList, setEquipmentList] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const businessStatus = {
    status: user?.company ? 'Approved' : 'Pending',
    businessName: user?.company || 'My Fleet Co.',
    businessType: 'Heavy Machinery Fleet Provider',
  };

  const fetchData = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const [eqRes, bkRes] = await Promise.all([
        equipmentService.getAll(),
        bookingService.getAll()
      ]);
      
      // Only get equipment owned by this user
      const myEq = (eqRes.data || []).filter(e => e.owner?.id === user.id || e.ownerId?._id === user.id || e.ownerId === user.id);
      setEquipmentList(myEq);
      
      // For bookings, in a real app backend would filter by owner's equipment.
      // Here we'll map equipment IDs.
      const myEqIds = myEq.map(e => e.id);
      const myBookings = (bkRes.data || [])
        .filter(b => myEqIds.includes(b.equipmentId))
        .map(b => {
          const eq = myEq.find(e => e.id === b.equipmentId);
          return {
            ...b,
            id: b._id || b.id,
            amount: b.amount ?? b.totalValue ?? b.totalAmount ?? b.rentalCost ?? 0,
            startDate: new Date(b.startDate).toLocaleDateString(),
            endDate: new Date(b.endDate).toLocaleDateString(),
            image: eq ? eq.image : 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=800',
            category: eq ? eq.category : 'Heavy Machinery',
            ownerName: eq ? eq.owner.name : 'Unknown Owner',
            customerName: b.customerId?.name || b.customerName || 'Anonymous Customer',
            customerEmail: b.customerId?.email || b.customerEmail || 'No email provided',
            customerAvatar: b.customerId?.avatar || b.customerAvatar || null
          };
        });
      setBookings(myBookings);
      
    } catch (err) {
      console.error('Failed to fetch owner data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const { socket } = useSocket();
  useEffect(() => {
    if (!socket || !user || !equipmentList.length) return;

    const handleNotification = async () => {
      try {
        const bkRes = await bookingService.getAll();
        const myEqIds = equipmentList.map(e => e.id);
        const myBookings = (bkRes.data || [])
          .filter(b => myEqIds.includes(b.equipmentId))
          .map(b => {
            const eq = equipmentList.find(e => e.id === b.equipmentId);
            return {
              ...b,
              id: b._id || b.id,
              amount: b.amount ?? b.totalValue ?? b.totalAmount ?? b.rentalCost ?? 0,
              startDate: new Date(b.startDate).toLocaleDateString(),
              endDate: new Date(b.endDate).toLocaleDateString(),
              image: eq ? eq.image : 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=800',
              category: eq ? eq.category : 'Heavy Machinery',
              ownerName: eq ? eq.owner.name : 'Unknown Owner',
              customerName: b.customerId?.name || b.customerName || 'Anonymous Customer',
              customerEmail: b.customerId?.email || b.customerEmail || 'No email provided',
              customerAvatar: b.customerId?.avatar || b.customerAvatar || null
            };
          });
        setBookings(myBookings);
      } catch (err) {
        console.error('Failed to realtime sync owner bookings', err);
      }
    };

    socket.on('notification', handleNotification);
    return () => socket.off('notification', handleNotification);
  }, [socket, user, equipmentList]);

  const ownerStats = {
    totalEquipment: equipmentList.length,
    activeBookings: bookings.filter(b => b.status === 'ACTIVE' || b.status === 'Rental Active').length,
    pendingRequests: bookings.filter(b => b.status === 'Pending Owner Approval').length,
    monthlyEarnings: '₹' + bookings.reduce((sum, b) => sum + (b.rentalCost || 0), 0).toLocaleString(),
  };

  return (
    <OwnerContext.Provider
      value={{
        equipmentList,
        bookings,
        isLoading,
        ownerStats,
        businessStatus,
        refreshData: fetchData
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
