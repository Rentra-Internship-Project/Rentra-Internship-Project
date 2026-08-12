import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('rentra_token');
      if (token) {
        try {
          const response = await authService.getProfile();
          setUser(response.data.user);
        } catch (err) {
          // Token invalid or expired — clear it
          localStorage.removeItem('rentra_token');
        }
      }
      setLoading(false);
    };
    restoreSession();
  }, []);

  const login = async ({ email, password }) => {
    try {
      const response = await authService.login({ email, password });
      const { user: userData, token } = response.data;
      localStorage.setItem('rentra_token', token);
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.error || 'Login failed. Please try again.',
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      const { user: newUser, token } = response.data;
      localStorage.setItem('rentra_token', token);
      setUser(newUser);
      return { success: true, user: newUser };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.error || 'Registration failed. Please try again.',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('rentra_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: Boolean(user), login, logout, register }}>
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
