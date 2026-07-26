import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import Topbar from '../components/Topbar.jsx';

const PAGE_TITLES = [
  { match: '/dashboard/generate', title: 'Generate' },
  { match: '/dashboard/business-profile', title: 'Business Profile' },
  { match: '/dashboard/templates', title: 'Templates' },
  { match: '/dashboard/history', title: 'History' },
  { match: '/dashboard/favorites', title: 'Favorites' },
  { match: '/dashboard/settings', title: 'Settings' },
  { match: '/dashboard/admin/users', title: 'User Management' },
  { match: '/dashboard/admin/logs', title: 'Activity Logs' },
  { match: '/dashboard/admin', title: 'Admin Dashboard' },
  { match: '/dashboard', title: 'Generators', exact: true },
];

function resolveTitle(pathname) {
  const found = PAGE_TITLES.find(({ match, exact }) =>
    exact ? pathname === match : pathname.startsWith(match)
  );
  return found?.title || 'Dashboard';
}

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const title = resolveTitle(location.pathname);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-surface-dark">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} title={title} />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
