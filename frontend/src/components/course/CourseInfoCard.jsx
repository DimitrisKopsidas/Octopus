// Sidebar info card (questions count, code, semester, progress status). Used by CourseStart.
import { Heart, CheckCircle2 } from 'lucide-react'
import InfoRow from './InfoRow'
// import SoonBadge from '../ui/SoonBadge'
import { formatLastUpdated } from '../../lib/dates'
import t from '../../content/courseStart.json'

function CourseInfoCard({ course, questionCount, isFavorite = false, isPassed = false }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <header className="px-5 py-3 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-2">
          {t.info.title}
        </h2>
      </header>
      <dl className="px-5 py-4 space-y-3 text-sm">
        <InfoRow label={t.info.availableQuestions}>
          <span className="font-semibold text-slate-900 dark:text-slate-200 tabular-nums">
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
        {(isFavorite || isPassed) && (
          <InfoRow label="Κατάσταση">
            <div className="flex items-center gap-1.5 flex-wrap">
              {isFavorite && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-900/60">
                  <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                  Αγαπημένο
                </span>
              )}
              {isPassed && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900/60">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Περασμένο
                </span>
              )}
            </div>
          </InfoRow>
        )}
        {/* Parked until we decide how a helper/admin claims a course.
        <InfoRow label={t.info.lastExam} muted><SoonBadge /></InfoRow> */}
        <InfoRow label={t.info.recentAdditions}>
          <span className="text-slate-700 dark:text-slate-300">
            {formatLastUpdated(course?.lastUpdated)}
          </span>
        </InfoRow>
      </dl>
    </div>
  )
}

export default CourseInfoCard
