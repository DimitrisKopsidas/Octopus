// Course card in the Courses grid. Used by Courses page.
import { Link } from 'react-router-dom'
import ContentBadge from './ContentBadge'
import t from '../../content/courses.json'

function CourseCard({ course, hasContent, disabled }) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50 px-2 py-0.5 rounded mb-2">
            {t.courseCard.semesterPrefix} {course.semester}
          </span>
          <h3
            className={`font-semibold leading-snug transition-colors ${
              disabled
                ? 'text-slate-600 dark:text-slate-400'
                : 'text-slate-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-300'
            }`}
          >
            {course.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.courseCard.codePrefix} {course.id}
          </p>
        </div>
        {!disabled && (
          <span className="text-brand-600 dark:text-brand-400 text-xl shrink-0">→</span>
        )}
      </div>
      <div className="mt-auto pt-4 flex justify-end">
        <ContentBadge hasContent={hasContent} />
      </div>
    </>
  )

  if (disabled) {
    return (
      <div
        title={t.emptyDisabledTooltip}
        aria-disabled="true"
        className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800 shadow-sm opacity-60 cursor-not-allowed select-none"
      >
        {inner}
      </div>
    )
  }

  return (
    <Link
      to={`/courses/${course.id}/start`}
      className="group flex flex-col h-full bg-white dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-brand-400 dark:hover:border-brand-600 transition-all"
    >
      {inner}
    </Link>
  )
}

export default CourseCard
