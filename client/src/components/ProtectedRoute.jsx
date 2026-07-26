import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';

/**
 * Wraps private routes. While the initial session-restore check is in
 * flight, shows a full-screen spinner rather than flashing the login
 * page then immediately redirecting to the dashboard.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-surface-dark">
        <Loader2 className="animate-spin text-brand-500" size={28} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
