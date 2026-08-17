// Course card in the Courses grid matching custom design system. Used by Courses page.
import { Link } from 'react-router-dom'
import { useMe } from '../../hooks/queries'
import t from '../../content/courses.json'

function formatLastUpdated(dateVal) {
  if (!dateVal) return 'Ποτέ'
  try {
    const d = new Date(dateVal)
    if (isNaN(d.getTime())) return String(dateVal)

    const diffMs = Date.now() - d.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 5) return 'Πριν λίγο'
    if (diffMins < 60) return `Πριν ${diffMins} λ`
    if (diffHours < 24) return `Πριν ${diffHours} ώρες`
    if (diffDays === 1) return 'Εχθές'
    if (diffDays < 30) return `Πριν ${diffDays} μέρες`
    return d.toLocaleDateString('el-GR')
  } catch {
    return 'Ποτέ'
  }
}

function CourseCard({ course, hasContent, disabled, progress = 0 }) {
  const { user } = useMe()
  const questionCount = course.questionCount ?? 0
  const lastUpdatedText = formatLastUpdated(course.lastUpdated)

  const inner = (
    <div className="relative z-10 flex flex-col h-full space-y-4">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold tracking-wide  text-slate-500 dark:text-slate-400">
          {course.semester}ο Εξάμηνο
        </span>
        {disabled && (
          <span className="shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t.courseCard.noContent}
          </span>
        )}
        {!disabled && (
          <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 group-hover:border-brand-500/40 transition-all shrink-0">
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </div>
        )}
      </div>

      {/* Course Title */}
      <div className="space-y-1 flex-1">
        <h3 className={`text-xl font-bold leading-tight tracking-tight transition-colors ${
          disabled
            ? 'text-slate-500 dark:text-slate-500'
            : 'text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400'
        }`}>
          {course.name}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {course.description || `Κωδικός μαθήματος: ${course.id}`}
        </p>
      </div>

      {/* Progress Section (Only visible for logged-in users) */}
      {user != null && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-600 dark:text-slate-400 font-semibold">Πρόοδος</span>
            <span className="text-slate-900 dark:text-slate-100 font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 via-teal-400 to-amber-400 transition-all duration-500 shadow-sm"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer Info Row */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        {/* The question count is the one number that decides whether a course is
            worth opening, so it carries the brand colour rather than blending
            into the metadata row. */}
        <div
          className={`flex items-center gap-1.5 rounded-lg px-2 py-1 font-bold ${
            disabled
              ? 'text-slate-400 dark:text-slate-500'
              : 'bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300'
          }`}
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="tabular-nums">{questionCount}</span>
          <span className="font-medium">{t.courseCard.questions}</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium">
          <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{lastUpdatedText}</span>
        </div>
      </div>
    </div>
  )

  if (disabled) {
    return (
      <div
        title={t.emptyDisabledTooltip}
        aria-disabled="true"
        className="relative overflow-hidden bg-slate-50/60 dark:bg-slate-900/40 rounded-2xl p-6 border border-dashed border-slate-300 dark:border-slate-700 opacity-70 cursor-not-allowed select-none"
      >
        {inner}
      </div>
    )
  }

  return (
    <Link
      to={`/courses/${course.id}/start`}
      className="group relative overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6 pt-7 border border-slate-200/80 dark:border-slate-800 shadow-lg hover:shadow-2xl hover:border-brand-500/50 hover:-translate-y-1 transition-all duration-300"
    >
      {/* Accent bar along the top edge: the fastest way to tell a playable
          course from an empty one while scanning the grid. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-500 to-teal-400"
      />
      {/* Ambient gradient top-right glow */}
      <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-brand-500/10 dark:bg-brand-500/15 blur-2xl pointer-events-none group-hover:bg-brand-500/25 transition-all" />
      {inner}
    </Link>
  )
}

export default CourseCard
