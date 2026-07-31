import { Link } from 'react-router-dom'
import { useMe, useCourses, useCoursesWithContent } from '../hooks/queries'
import PanelNavigation from '../components/layout/PanelNavigation'
import t from '../content/controlPanel.json'

export default function ControlPanel() {
  const { user } = useMe()
  const { data: courses } = useCourses()
  const { data: withContentIds } = useCoursesWithContent()

  const safeCoursesCount = courses?.length ?? 0
  const activeContentCount = withContentIds?.size ?? 0

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Top Navigation Tabs */}
      <PanelNavigation activeTab="/control-panel" />

      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-brand-500/10 via-indigo-500/10 to-slate-900 border border-brand-500/20 rounded-3xl p-8 sm:p-10 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider mb-3">
              {t.badge}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {t.welcomePrefix}, @{user?.username}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-xl">
              {t.subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/control-panel/courses"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-600/25 transition-all transform hover:-translate-y-0.5"
            >
              <span>📚 Μαθήματα</span>
            </Link>
            <Link
              to="/control-panel/reports"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <span>🚩 Αναφορές</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2 Main Shortcut Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Courses & Questions Shortcut */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-brand-500/30 dark:border-brand-500/20 shadow-xl rounded-2xl p-7 flex flex-col justify-between transition-all hover:border-brand-500/50 hover:-translate-y-1">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-900/60 text-brand-600 dark:text-brand-400 flex items-center justify-center text-2xl shadow-sm">
                📚
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                {activeContentCount} / {safeCoursesCount} {t.cards.courses.badgeSuffix}
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {t.cards.courses.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              {t.cards.courses.description}
            </p>
          </div>

          <Link
            to="/control-panel/courses"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-600/20 transition-all transform hover:-translate-y-0.5"
          >
            <span>{t.cards.courses.button}</span>
          </Link>
        </div>

        {/* Card 2: Reports & Feedback Shortcut */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-amber-500/30 dark:border-amber-500/20 shadow-xl rounded-2xl p-7 flex flex-col justify-between transition-all hover:border-amber-500/50 hover:-translate-y-1">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 text-amber-500 flex items-center justify-center text-2xl shadow-sm">
                🚩
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {t.cards.reports.badgeZero}
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {t.cards.reports.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              {t.cards.reports.description}
            </p>
          </div>

          <Link
            to="/control-panel/reports"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all transform hover:-translate-y-0.5"
          >
            <span>{t.cards.reports.button}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
