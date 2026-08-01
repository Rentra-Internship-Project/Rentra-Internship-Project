import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import AppRoutes from './routes/AppRoutes';
import NotificationToast from './components/common/NotificationToast';
import ScrollToTop from './components/common/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <SocketProvider>
          <AppRoutes />
          <NotificationToast />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
