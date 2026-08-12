import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminService, equipmentService } from '../services/api';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [stats, setStats] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [users, setUsers] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all live admin data
  const fetchAdminData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, bizRes, usersRes, eqRes, bkRes] = await Promise.all([
        adminService.getStats(),
        adminService.getBusinesses(),
        adminService.getUsers(),
        equipmentService.getAll(),
        adminService.getBookings()
      ]);
      setStats(statsRes.data);
      
      // Map Businesses
      const mappedBiz = bizRes.data.map(b => ({
        id: b._id,
        businessName: b.businessName || 'Unknown Business',
        ownerName: b.ownerName || b.ownerId?.name || 'Unknown Owner',
        email: b.ownerId?.email || 'N/A',
        phone: b.contactPhone || b.ownerId?.phone || 'N/A',
        taxId: b.taxId || 'Pending',
        registrationNumber: b.registrationNumber || 'Pending',
        documents: b.documents?.map((d, i) => ({ name: `Document_${i+1}.pdf`, size: '2MB', url: d })) || [],
        businessType: b.businessType || 'Equipment Owner',
        status: b.status || 'Pending',
        submittedDate: new Date(b.createdAt).toLocaleDateString()
      }));
      setBusinesses(mappedBiz);
      
      // Map Users
      const mappedUsers = usersRes.data.map(u => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        phone: u.phone || 'N/A',
        status: u.status || 'Active',
        joinedDate: new Date(u.createdAt).toLocaleDateString(),
        avatar: u.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150'
      }));
      setUsers(mappedUsers);

      // Set Equipment
      setEquipmentList(eqRes.data || []);

      // Map Bookings
      const mappedBookings = bkRes.data.map(b => ({
        id: b._id,
        customer: b.customerId?.name || 'Unknown Customer',
        equipment: b.equipmentId?.name || 'Unknown Equipment',
        startDate: new Date(b.startDate).toLocaleDateString(),
        endDate: new Date(b.endDate).toLocaleDateString(),
        totalValue: `₹${b.totalPrice?.toLocaleString() || b.totalValue?.toLocaleString() || '0'}`,
        status: b.status || 'Pending'
      }));
      setBookings(mappedBookings);

    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <AdminContext.Provider value={{ 
      stats, 
      businesses, setBusinesses, 
      users, setUsers, 
      equipmentList, setEquipmentList, 
      bookings, setBookings,
      isLoading,
      refreshData: fetchAdminData 
    }}>
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
