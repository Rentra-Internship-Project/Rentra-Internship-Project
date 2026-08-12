import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminNavbar from '../components/admin/AdminNavbar';
import { AdminProvider } from '../context/AdminContext';

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AdminProvider>
      <div className="min-h-screen bg-[#F8FAFC] flex">
        {/* Sidebar Navigation */}
        <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col md:pl-64 min-w-0 transition-all">
          {/* Top Navbar */}
          <AdminNavbar setMobileOpen={setMobileOpen} />

          <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </AdminProvider>
  );
};

export default AdminLayout;
