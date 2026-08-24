import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFirstLogin, setIsFirstLogin] = useState(() => {
    return sessionStorage.getItem('rentra_is_first_login') === 'true';
  });

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
          sessionStorage.removeItem('rentra_is_first_login');
          setIsFirstLogin(false);
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
      sessionStorage.removeItem('rentra_is_first_login');
      setIsFirstLogin(false);
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.error || 'Login failed. Please try again.',
      };
    }
  };

  const loginWithToken = async (token, isNew = false) => {
    try {
      localStorage.setItem('rentra_token', token);
      if (isNew) {
        sessionStorage.setItem('rentra_is_first_login', 'true');
        setIsFirstLogin(true);
      } else {
        sessionStorage.removeItem('rentra_is_first_login');
        setIsFirstLogin(false);
      }
      const response = await authService.getProfile();
      setUser(response.data.user);
      return { success: true, user: response.data.user };
    } catch (err) {
      localStorage.removeItem('rentra_token');
      sessionStorage.removeItem('rentra_is_first_login');
      setIsFirstLogin(false);
      return {
        success: false,
        message: 'Invalid token.',
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      const { user: newUser, token } = response.data;
      localStorage.setItem('rentra_token', token);
      sessionStorage.setItem('rentra_is_first_login', 'true');
      setIsFirstLogin(true);
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
    sessionStorage.removeItem('rentra_is_first_login');
    setIsFirstLogin(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, isAuthenticated: Boolean(user), isFirstLogin, login, loginWithToken, register, logout }}
    >
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
