"use client";

/**
 * DashboardLayout Component
 * Main layout for authenticated dashboard pages with sidebar and header
 */

import React, { useState } from 'react';
import Header from '../organisms/Header';
import Sidebar from '../organisms/Sidebar';
import Footer from '../organisms/Footer';

const DashboardLayout = ({ children, user }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col md:pl-64">
        {/* Header */}
        <Header user={user} onMenuClick={toggleSidebar} />

        {/* Page content */}
        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
