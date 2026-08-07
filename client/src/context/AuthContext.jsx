import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const credentials = {
  owner: {
    name: 'Alicia Reyes',
    email: 'owner@rentra.com',
    password: 'owner123',
    role: 'owner',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=300',
    businessName: 'Titan Heavy Rentals Inc.'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = ({ email, password }) => {
    const account = credentials.owner;

    if (account.email !== email || account.password !== password) {
      return { success: false, message: 'Invalid credentials. Use owner@rentra.com / owner123' };
    }

    setUser({
      name: account.name,
      email: account.email,
      role: account.role,
      avatar: account.avatar,
      businessName: account.businessName
    });
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
