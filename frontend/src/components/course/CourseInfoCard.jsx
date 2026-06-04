// Sidebar info card (questions count, code, semester). Used by CourseStart.
import InfoRow from './InfoRow'
import SoonBadge from '../ui/SoonBadge'
import t from '../../content/courseStart.json'

function CourseInfoCard({ course, questionCount, coverage }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <header className="px-5 py-3 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          {t.info.title}
        </h2>
      </header>
      <dl className="px-5 py-4 space-y-3 text-sm">
        <InfoRow label={t.info.availableQuestions}>
          <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
            {questionCount}
          </span>
        </InfoRow>
        {/* <InfoRow label={t.info.coverage}>
          <span className="font-semibold text-brand-600 dark:text-brand-400 tabular-nums">
            {coverage}%
          </span>
        </InfoRow> */}
        {course && (
          <>
            <InfoRow label={t.info.code}>
              <span className="text-slate-700 dark:text-slate-300 tabular-nums">{course.id}</span>
            </InfoRow>
            <InfoRow label={t.info.semester}>
              <span className="text-slate-700 dark:text-slate-300">{course.semester}</span>
            </InfoRow>
          </>
        )}
        <InfoRow label={t.info.lastExam} muted><SoonBadge /></InfoRow>
        <InfoRow label={t.info.recentAdditions} muted><SoonBadge /></InfoRow>
      </dl>
    </div>
  )
}

export default CourseInfoCard
