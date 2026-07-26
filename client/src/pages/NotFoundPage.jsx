import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 text-center dark:bg-surface-dark">
      <p className="text-6xl font-bold text-brand-500">404</p>
      <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        This page doesn&apos;t exist
      </h1>
      <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
        The page you&apos;re looking for was moved, deleted, or never existed.
      </p>
      <Link to="/" className="btn-primary mt-2 px-5 py-2.5">
        Back to home
      </Link>
    </div>
  );
}
