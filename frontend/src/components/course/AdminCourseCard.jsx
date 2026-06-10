// Course card with add-questions action. Used by Admin page.
import { Link } from 'react-router-dom'
import ContentBadge from './ContentBadge'
import t from '../../content/admin.json'

function AdminCourseCard({ course, hasContent }) {
  return (
    <Link
      to={`/admin/courses/${course.id}`}
      className="group flex flex-col h-full bg-white dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-brand-400 dark:hover:border-brand-600 transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-slate-200 leading-snug group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
            {course.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.courseCard.codePrefix} {course.id}
          </p>
        </div>
        <span className="text-brand-600 dark:text-brand-400 text-xl shrink-0">→</span>
      </div>
      <div className="mt-auto pt-4 flex justify-end">
        <ContentBadge hasContent={hasContent} />
      </div>
    </Link>
  )
}

export default AdminCourseCard
