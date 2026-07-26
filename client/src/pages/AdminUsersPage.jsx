import { useState, useEffect, useCallback } from 'react';
import { Search, Shield, ShieldOff, UserX, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import SkeletonCard from '../components/SkeletonCard.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import adminService from '../services/admin.service';

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await adminService.listUsers({ search });
      setUsers(result.users);
      setMeta(result.meta);
    } catch (_err) {
      toast.error('Could not load users.');
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleToggleActive = async (targetUser) => {
    const nextActive = !targetUser.isActive;
    if (
      targetUser.id === currentUser.id &&
      !nextActive &&
      !window.confirm('Deactivate your own account? You will be logged out immediately.')
    ) {
      return;
    }
    try {
      await adminService.setUserActiveStatus(targetUser.id, nextActive);
      toast.success(nextActive ? 'User activated' : 'User deactivated');
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update user.');
    }
  };

  const handleToggleRole = async (targetUser) => {
    const nextRole = targetUser.role === 'ADMIN' ? 'USER' : 'ADMIN';
    if (
      targetUser.id === currentUser.id &&
      nextRole === 'USER' &&
      !window.confirm('Remove your own admin access?')
    ) {
      return;
    }
    try {
      await adminService.setUserRole(targetUser.id, nextRole);
      toast.success(`Role changed to ${nextRole}`);
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update role.');
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {meta?.total ?? 0} registered users.
          </p>
        </div>
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email..."
            className="input-field w-full pl-10 sm:w-72"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="hidden px-5 py-3 font-medium sm:table-cell">Email</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="hidden px-5 py-3 font-medium md:table-cell">Generations</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-100">
                    {u.name}
                    {u.id === currentUser.id && (
                      <span className="ml-1.5 text-xs font-normal text-slate-400">(you)</span>
                    )}
                  </td>
                  <td className="hidden px-5 py-3 text-slate-500 dark:text-slate-400 sm:table-cell">
                    {u.email}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={
                        u.role === 'ADMIN'
                          ? 'rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                          : 'rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="hidden px-5 py-3 text-slate-500 dark:text-slate-400 md:table-cell">
                    {u._count?.generations ?? 0}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={
                        u.isActive
                          ? 'rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                          : 'rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-300'
                      }
                    >
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleRole(u)}
                        title={u.role === 'ADMIN' ? 'Remove admin' : 'Make admin'}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        {u.role === 'ADMIN' ? <ShieldOff size={15} /> : <Shield size={15} />}
                      </button>
                      <button
                        onClick={() => handleToggleActive(u)}
                        title={u.isActive ? 'Deactivate' : 'Activate'}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        {u.isActive ? <UserX size={15} /> : <UserCheck size={15} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
