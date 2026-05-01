import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const titles = {
  '/':               'Dashboard',
  '/workouts':       'Workouts',
  '/health':         'Health Metrics',
  '/goals':          'Goals',
  '/ai-suggestions': 'AI Insights',
  '/profile':        'Profile',
};

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content — pushed right on desktop via inline style + responsive CSS */}
      <div className="layout-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar
          title={titles[location.pathname] || 'VitalFlow'}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main style={{ flex: 1, padding: '24px' }}>
          <Outlet />
        </main>
      </div>

      {/* Responsive margin for the main content area */}
      <style>{`
        @media (min-width: 1024px) {
          .layout-main {
            margin-left: 256px;
          }
        }
      `}</style>
    </div>
  );
}
