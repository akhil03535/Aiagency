import { Sparkles, ArrowRight, Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext.jsx';

/**
 * Phase 1 landing page: proves the design system (glass cards, dark mode,
 * type scale, brand palette) is wired end-to-end. Full marketing page
 * with feature grid, pricing, and generator previews arrives in Phase 3.
 */
export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50 dark:from-surface-dark dark:via-slate-900 dark:to-surface-dark">
      <nav className="flex items-center justify-between px-6 py-5 md:px-12">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
            <Sparkles size={18} />
          </div>
          <span className="text-lg font-bold tracking-tight">AI Agency</span>
        </div>
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </nav>

      <main className="mx-auto flex max-w-5xl flex-col items-center px-6 pt-16 text-center md:pt-24">
        <span className="mb-4 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:border-brand-800 dark:bg-brand-900/30 dark:text-brand-300">
          Phase 1 — Project foundation live
        </span>
        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
          Every piece of marketing content your business needs,{' '}
          <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
            written in seconds
          </span>
        </h1>
        <p className="mt-5 max-w-xl text-base text-slate-600 dark:text-slate-400 md:text-lg">
          Instagram captions, SEO copy, blog posts, ad campaigns, and 20+ more content types —
          generated from one saved business profile.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/register" className="btn-primary px-6 py-3 text-base">
            Get started free <ArrowRight size={16} />
          </Link>
          <Link to="/login" className="btn-secondary px-6 py-3 text-base">
            Log in
          </Link>
        </div>

        <div className="glass-card mt-16 w-full max-w-2xl p-6 text-left animate-slideUp">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Sample output — Instagram
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            🌸 New season, new you. Our festive collection just dropped — handcrafted pieces
            that carry tradition in every thread. Step into the season with something that
            feels like home. 🪔
          </p>
          <p className="mt-3 text-xs text-brand-600 dark:text-brand-400">
            #FestiveWear #HandcraftedWithLove #NewCollection #ShopLocal
          </p>
        </div>
      </main>

      <footer className="mt-24 pb-8 text-center text-xs text-slate-400">
        Built with React, Express, PostgreSQL &amp; Groq — AI Agency © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
