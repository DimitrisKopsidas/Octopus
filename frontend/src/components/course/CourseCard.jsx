// Course card in the Courses grid matching custom design system. Used by Courses page.
import { Link } from 'react-router-dom'
import { GraduationCap, CheckCircle2, BookOpen, History } from 'lucide-react'
import CourseToggleButton from './CourseToggleButton'
import { useMe, useToggleFavoriteCourse, useTogglePassedCourse } from '../../hooks/queries'
import { toast } from '../../store/toastStore'
import { formatLastUpdated } from '../../lib/dates'
import t from '../../content/courses.json'

function CourseCard({
  course,
  disabled,
  isFavorite = false,
  isPassed = false,
  onToggleFavorite,
  onTogglePassed,
  isFavoriteLoading: isFavLoadingProp,
  isPassedLoading: isPassLoadingProp,
}) {
  const { user } = useMe()
  const localToggleFavorite = useToggleFavoriteCourse()
  const localTogglePassed = useTogglePassedCourse()

  const isFavoriteLoading =
    isFavLoadingProp !== undefined
      ? isFavLoadingProp
      : localToggleFavorite.isPending && String(localToggleFavorite.variables) === String(course.id)

  const isPassedLoading =
    isPassLoadingProp !== undefined
      ? isPassLoadingProp
      : localTogglePassed.isPending && String(localTogglePassed.variables) === String(course.id)

  const questionCount = course.questionCount ?? 0
  const lastUpdatedText = formatLastUpdated(course.lastUpdated)

  const handleFavoriteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      toast.info('Συνδέσου για να παρακολουθείς μαθήματα.')
      return
    }
    if (onToggleFavorite) {
      onToggleFavorite(course.id)
    } else {
      localToggleFavorite.mutate(course.id)
    }
  }

  const handlePassedClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      toast.info('Συνδέσου για να σημειώσεις μαθήματα ως περασμένα.')
      return
    }
    if (onTogglePassed) {
      onTogglePassed(course.id)
    } else {
      localTogglePassed.mutate(course.id)
    }
  }

  const inner = (
    <div className="relative z-10 flex flex-col h-full space-y-4">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400">
            {course.semester}ο Εξάμηνο
          </span>
          {isFavorite && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 dark:text-amber-300/90 bg-amber-50/70 dark:bg-amber-950/30 px-2 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-900/40">
              Παρακολουθώ
            </span>
          )}
          {isPassed && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300/90 bg-emerald-50/70 dark:bg-emerald-950/30 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-900/40">
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
          <div className="flex items-center gap-0.5 -mr-1.5 shrink-0">
            <CourseToggleButton
              icon={GraduationCap}
              tone="amber"
              active={isFavorite}
              pending={isFavoriteLoading}
              onClick={handleFavoriteClick}
              label={isFavorite ? 'Αφαίρεση από τα παρακολουθούμενα' : 'Παρακολούθηση μαθήματος'}
            />

            {user && (
              <CourseToggleButton
                icon={CheckCircle2}
                tone="brand"
                active={isPassed}
                pending={isPassedLoading}
                onClick={handlePassedClick}
                label={isPassed ? 'Σήμανση ως μη περασμένο' : 'Σήμανση ως περασμένο'}
              />
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
          ? 'border-emerald-200/70 dark:border-emerald-900/40 hover:border-emerald-300 dark:hover:border-emerald-800/70 opacity-90'
          : isFavorite
          ? 'border-amber-200/70 dark:border-amber-900/40 hover:border-amber-300 dark:hover:border-amber-800/70'
          : 'border-slate-200/80 dark:border-slate-800 hover:border-brand-500/50'
      }`}
    >
      {/* Accent bar along the top edge */}
      <div
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-1 ${
          isPassed
            ? 'bg-emerald-400/50 dark:bg-emerald-500/40'
            : isFavorite
            ? 'bg-amber-400/60 dark:bg-amber-500/40'
            : 'bg-brand-500/30 dark:bg-brand-400/25'
        }`}
      />
      {inner}
    </Link>
  )
}

export default CourseCard
