import React, { createContext, useContext, useState } from 'react';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [adminState, setAdminState] = useState({});

  return (
    <AdminContext.Provider value={{ adminState, setAdminState }}>
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
