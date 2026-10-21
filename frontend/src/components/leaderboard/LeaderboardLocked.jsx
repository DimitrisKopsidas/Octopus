// Locked state for /leaderboard while LEADERBOARD_ENABLED is false.
// A blurred fake podium sits behind a floating lock.
// Everything is SVG/Tailwind; the bars and rows are decoration, not data.
import { Link } from 'react-router-dom'
import { Lock, Users, BookOpen } from 'lucide-react'
import t from '../../content/leaderboard.json'

const FAKE_PODIUM = [
  { height: 'h-28', tone: 'from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700' },
  { height: 'h-40', tone: 'from-amber-300 to-amber-500 dark:from-amber-500 dark:to-amber-700' },
  { height: 'h-20', tone: 'from-orange-300 to-orange-500 dark:from-orange-600 dark:to-orange-800' },
]

function LeaderboardLocked() {
  const copy = t.locked

  return (
    <div className="max-w-5xl mx-auto py-8 sm:py-10 px-4 sm:px-6 space-y-8 animate-fade-up">
      <div className="text-center sm:text-left space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {t.title}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">{t.subtitle}</p>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xl">
        {/* Decorative board, blurred so it reads as "something is here" */}
        <div className="absolute inset-0 px-6 pt-10 select-none pointer-events-none blur-[3px] opacity-60 dark:opacity-40" aria-hidden="true">
          <div className="flex items-end justify-center gap-4 sm:gap-8">
            {FAKE_PODIUM.map((bar, i) => (
              <div key={i} className="flex flex-col items-center gap-2 w-20 sm:w-28">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700" />
                <div className="h-2.5 w-14 rounded bg-slate-200 dark:bg-slate-700" />
                <div className={`relative overflow-hidden w-full ${bar.height} rounded-t-2xl bg-gradient-to-b ${bar.tone}`}>
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-3 max-w-xl mx-auto">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="relative overflow-hidden h-11 rounded-xl bg-slate-100 dark:bg-slate-800">
                <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent" style={{ animationDelay: `${i * 0.2}s` }} />
              </div>
            ))}
          </div>
        </div>

        {/* Foreground */}
        <div className="relative flex flex-col items-center text-center px-6 py-14 sm:py-16 bg-gradient-to-b from-white/30 via-white/70 to-white/95 dark:from-slate-900/30 dark:via-slate-900/70 dark:to-slate-900/95">
          <div className="relative flex items-end justify-center gap-2 mb-6">
            <div className="animate-float">
              <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-600/30 ring-4 ring-white/70 dark:ring-slate-900/70">
                <Lock className="w-8 h-8" />
              </div>
            </div>
          </div>

          <span className="inline-flex items-center px-3 py-1 mb-3 text-[11px] font-bold uppercase tracking-wider rounded-full bg-brand-50 text-brand-700 border border-brand-200 dark:bg-brand-950/60 dark:text-brand-300 dark:border-brand-800">
            {copy.badge}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">{copy.title}</h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md leading-relaxed mb-8">{copy.subtitle}</p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              to="/community"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-lg shadow-brand-600/25 transition-all hover:-translate-y-0.5"
            >
              <Users className="w-4 h-4" />
              {copy.ctaCommunity}
            </Link>
            <Link
              to="/courses"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 font-semibold text-sm transition-all hover:-translate-y-0.5"
            >
              <BookOpen className="w-4 h-4" />
              {copy.ctaCourses}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeaderboardLocked
