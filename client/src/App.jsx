import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import DemoRoleSwitcher from './components/common/DemoRoleSwitcher';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <DemoRoleSwitcher />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
