import { useState, useEffect } from 'react';
import { Users, Sparkles, CalendarClock, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import StatCard from '../components/StatCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import adminService from '../services/admin.service';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    adminService
      .getDashboard()
      .then((data) => !cancelled && setStats(data))
      .catch(() => toast.error('Could not load admin dashboard.'))
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const maxCount = Math.max(...stats.topContentTypes.map((c) => c.count), 1);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Platform-wide activity at a glance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Users" value={stats.totalUsers} icon={Users} accent="brand" />
        <StatCard
          label="Total Generations"
          value={stats.totalGenerations}
          icon={Sparkles}
          accent="green"
        />
        <StatCard
          label="Generated Today"
          value={stats.generationsToday}
          icon={CalendarClock}
          accent="amber"
        />
        <StatCard
          label="Failed Generations"
          value={stats.failedGenerations}
          icon={AlertTriangle}
          accent="red"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="glass-card p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Top Content Types
          </h3>
          {stats.topContentTypes.length === 0 ? (
            <p className="text-sm text-slate-400">No generations yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.topContentTypes.map((row) => (
                <div key={row.contentType}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-600 dark:text-slate-300">
                      {row.contentType}
                    </span>
                    <span className="text-slate-400">{row.count}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-brand-500"
                      style={{ width: `${(row.count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Recent Activity
          </h3>
          {stats.recentActivity.length === 0 ? (
            <p className="text-sm text-slate-400">No activity yet.</p>
          ) : (
            <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
              {stats.recentActivity.map((log) => (
                <div key={log.id} className="flex items-start justify-between gap-3 text-xs">
                  <div>
                    <p className="font-medium text-slate-700 dark:text-slate-200">
                      {log.action}
                    </p>
                    <p className="text-slate-400">
                      {log.user?.name || 'Unknown user'} &middot; {log.description}
                    </p>
                  </div>
                  <span className="shrink-0 text-slate-400">
                    {new Date(log.createdAt).toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
