// 404 fallback page. Route: *
import { Link } from 'react-router-dom'
import t from '../content/notFound.json'

function NotFound() {
  return (
    <div className="max-w-xl mx-auto py-12">
      <div className="relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-2xl rounded-3xl p-8 sm:p-10 text-center animate-fade-up">
        {/* Background Radial Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-brand-500/10 dark:bg-brand-500/20 blur-3xl pointer-events-none" />

        {/* 404 Badge */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <span className="text-6xl font-extrabold bg-gradient-to-r from-brand-600 to-teal-400 bg-clip-text text-transparent tracking-widest">
            404
          </span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-2">
          {t.title}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto mb-8">
          {t.message}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-semibold text-sm shadow-lg shadow-brand-600/25 transition-all transform hover:-translate-y-0.5"
          >
            <span>{t.backLink}</span>
          </Link>
          <Link
            to="/courses"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-all"
          >
            <span>Προβολή Μαθημάτων</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
