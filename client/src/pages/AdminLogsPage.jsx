import { useState, useEffect, useCallback } from 'react';
import { ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';
import SkeletonCard from '../components/SkeletonCard.jsx';
import ComingSoonPanel from '../components/ComingSoonPanel.jsx';
import adminService from '../services/admin.service';

const ACTION_FILTERS = ['', 'REGISTER', 'LOGIN', 'LOGOUT'];

export default function AdminLogsPage() {
  const [logs, setLogs] = useState([]);
  const [actionFilter, setActionFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await adminService.listActivityLogs({ action: actionFilter });
      setLogs(result.logs);
    } catch (_err) {
      toast.error('Could not load activity logs.');
    } finally {
      setIsLoading(false);
    }
  }, [actionFilter]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Activity Logs</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Audit trail of key account events across the platform.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {ACTION_FILTERS.map((action) => (
          <button
            key={action || 'all'}
            onClick={() => setActionFilter(action)}
            className={
              actionFilter === action
                ? 'rounded-full bg-brand-500 px-3.5 py-1.5 text-xs font-semibold text-white'
                : 'rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }
          >
            {action || 'All'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <ComingSoonPanel
          icon={ClipboardList}
          title="No activity yet"
          description="Account events like registrations and logins will appear here."
        />
      ) : (
        <div className="glass-card divide-y divide-slate-100 dark:divide-slate-800">
          {logs.map((log) => (
            <div key={log.id} className="flex items-center justify-between gap-3 px-5 py-3">
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                  {log.action}
                  <span className="ml-2 text-xs font-normal text-slate-400">
                    {log.user?.name || 'Unknown user'} ({log.user?.email || 'n/a'})
                  </span>
                </p>
                {log.description && (
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {log.description}
                  </p>
                )}
              </div>
              <span className="shrink-0 text-xs text-slate-400">
                {new Date(log.createdAt).toLocaleString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
