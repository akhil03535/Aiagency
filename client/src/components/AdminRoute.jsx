import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

/**
 * Wraps admin-only routes. Assumes it's nested inside <ProtectedRoute />
 * so authentication is already guaranteed — this only checks the role.
 * Non-admins are redirected to the regular dashboard rather than shown
 * an error page, since they didn't do anything wrong by landing here.
 */
export default function AdminRoute() {
  const { user } = useAuth();

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
