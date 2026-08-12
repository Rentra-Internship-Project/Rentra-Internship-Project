import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import AppRoutes from './routes/AppRoutes';
import DemoRoleSwitcher from './components/common/DemoRoleSwitcher';
import NotificationToast from './components/common/NotificationToast';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <AppRoutes />
          <NotificationToast />
          <DemoRoleSwitcher />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
