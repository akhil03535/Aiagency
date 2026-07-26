import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardHomePage from './pages/DashboardHomePage.jsx';
import BusinessProfilePage from './pages/BusinessProfilePage.jsx';
import GeneratorPage from './pages/GeneratorPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import FavoritesPage from './pages/FavoritesPage.jsx';
import TemplatesPage from './pages/TemplatesPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import AdminUsersPage from './pages/AdminUsersPage.jsx';
import AdminLogsPage from './pages/AdminLogsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';

/**
 * Phase 5 adds real History/Favorites (replacing the Phase 4 placeholders),
 * a Templates browser, and an Admin section gated by <AdminRoute /> (which
 * itself sits inside <ProtectedRoute /> so authentication is already
 * guaranteed before the role check runs).
 */
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHomePage />} />
            <Route path="generate/:slug" element={<GeneratorPage />} />
            <Route path="business-profile" element={<BusinessProfilePage />} />
            <Route path="templates" element={<TemplatesPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="settings" element={<SettingsPage />} />

            <Route path="admin" element={<AdminRoute />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="logs" element={<AdminLogsPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'text-sm font-medium',
          duration: 3500,
        }}
      />
    </>
  );
}

export default App;
