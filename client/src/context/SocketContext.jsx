import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Only connect if the user is logged in
    if (user?._id) {
      // Connect to the backend Socket.IO server
      // Determine the base server URL by removing '/api' from the VITE_API_BASE_URL if present
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
      const serverUrl = apiBase.replace('/api', '');
      const newSocket = io(serverUrl);
      setSocket(newSocket);

      // Join personal user room
      newSocket.emit('join_room', user._id);

      // Listen for notifications
      newSocket.on('notification', (data) => {
        setNotifications((prev) => [data, ...prev]);
        
        // Auto-remove notification from UI state after 5 seconds
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.timestamp !== data.timestamp));
        }, 5000);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, notifications, setNotifications }}>
      {children}
    </SocketContext.Provider>
  );
};
