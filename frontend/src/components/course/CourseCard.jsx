// Course card in the Courses grid matching custom design system. Used by Courses page.
import { Link } from 'react-router-dom'
import { Heart, CheckCircle2, BookOpen, History, Loader2 } from 'lucide-react'
import { useMe, useToggleFavoriteCourse, useTogglePassedCourse } from '../../hooks/queries'
import { toast } from '../../store/toastStore'
import { formatLastUpdated } from '../../lib/dates'
import t from '../../content/courses.json'

function CourseCard({ course, disabled, isFavorite = false, isPassed = false }) {
  const { user } = useMe()
  const toggleFavorite = useToggleFavoriteCourse()
  const togglePassed = useTogglePassedCourse()

  const isFavoriteLoading = toggleFavorite.isPending && String(toggleFavorite.variables) === String(course.id)
  const isPassedLoading = togglePassed.isPending && String(togglePassed.variables) === String(course.id)

  const questionCount = course.questionCount ?? 0
  const lastUpdatedText = formatLastUpdated(course.lastUpdated)

  const handleFavoriteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      toast.info('Συνδέσου για να προσθέσεις μαθήματα στα αγαπημένα.')
      return
    }
    toggleFavorite.mutate(course.id)
  }

  const handlePassedClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      toast.info('Συνδέσου για να σημειώσεις μαθήματα ως περασμένα.')
      return
    }
    togglePassed.mutate(course.id)
  }

  const inner = (
    <div className="relative z-10 flex flex-col h-full space-y-4">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400">
            {course.semester}ο Εξάμηνο
          </span>
          {isPassed && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/70 dark:border-emerald-800/70">
              Περασμένο
            </span>
          )}
        </div>

        {disabled && (
          <span className="shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t.courseCard.noContent}
          </span>
        )}

        {!disabled && (
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleFavoriteClick}
              disabled={isFavoriteLoading}
              title={isFavorite ? 'Αφαίρεση από τα αγαπημένα' : 'Προσθήκη στα αγαπημένα'}
              aria-label={isFavorite ? 'Αφαίρεση από τα αγαπημένα' : 'Προσθήκη στα αγαπημένα'}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150 border cursor-pointer disabled:cursor-wait ${
                isFavorite
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-500 hover:scale-105'
                  : 'bg-slate-100/80 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 text-slate-400 dark:text-slate-500 hover:text-rose-500 hover:border-rose-300 dark:hover:border-rose-800 hover:scale-105'
              }`}
            >
              {isFavoriteLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
              ) : (
                <Heart
                  className={`w-4 h-4 transition-all ${
                    isFavorite ? 'fill-rose-500 text-rose-500' : ''
                  }`}
                />
              )}
            </button>

            {user && (
              <button
                type="button"
                onClick={handlePassedClick}
                disabled={isPassedLoading}
                title={isPassed ? 'Σήμανση ως μη περασμένο' : 'Σήμανση ως περασμένο'}
                aria-label={isPassed ? 'Σήμανση ως μη περασμένο' : 'Σήμανση ως περασμένο'}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150 border cursor-pointer disabled:cursor-wait ${
                  isPassed
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60 text-emerald-500 hover:scale-105'
                    : 'bg-slate-100/80 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 text-slate-400 dark:text-slate-500 hover:text-emerald-500 hover:border-emerald-300 dark:hover:border-emerald-800 hover:scale-105'
                }`}
              >
                {isPassedLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                ) : (
                  <CheckCircle2
                    className={`w-4 h-4 transition-all ${
                      isPassed ? 'text-emerald-500 fill-emerald-100 dark:fill-emerald-950' : ''
                    }`}
                  />
                )}
              </button>
            )}
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
        {course.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {course.description}
          </p>
        )}
      </div>

      {/* Footer Info Row */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div
          className={`flex items-center gap-1.5 rounded-lg px-2 py-1 font-bold ${
            disabled
              ? 'text-slate-400 dark:text-slate-500'
              : 'bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300'
          }`}
        >
          <BookOpen className="w-4 h-4 shrink-0" />
          <span className="tabular-nums">{questionCount}</span>
          <span className="font-medium">{t.courseCard.questions}</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium" title="Τελευταία ενημέρωση">
          <History className="w-3.5 h-3.5 text-slate-400 shrink-0" />
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
        className="relative overflow-hidden bg-slate-50/80 dark:bg-slate-900/50 rounded-2xl p-6 border border-dashed border-slate-300 dark:border-slate-700 opacity-70 cursor-not-allowed select-none"
      >
        {inner}
      </div>
    )
  }

  return (
    <Link
      to={`/courses/${course.id}/start`}
      className={`group relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl p-6 pt-7 border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${
        isPassed
          ? 'border-emerald-300/60 dark:border-emerald-800/50 hover:border-emerald-500/60 opacity-90'
          : isFavorite
          ? 'border-rose-300/60 dark:border-rose-900/50 hover:border-rose-500/60'
          : 'border-slate-200/80 dark:border-slate-800 hover:border-brand-500/50'
      }`}
    >
      {/* Accent bar along the top edge */}
      <div
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-1 ${
          isPassed
            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
            : isFavorite
            ? 'bg-gradient-to-r from-rose-500 to-pink-500'
            : 'bg-gradient-to-r from-brand-500 to-teal-400'
        }`}
      />
      {inner}
    </Link>
  )
}

export default CourseCard
