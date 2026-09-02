// Course card in the Courses grid matching custom design system. Used by Courses page.
import { Link } from 'react-router-dom'
import { ArrowUpRight, BookOpen, Clock } from 'lucide-react'
// import { useMe } from '../../hooks/queries' // ξαναβάλε το μαζί με την Πρόοδο
import { formatLastUpdated } from '../../lib/dates'
import t from '../../content/courses.json'

// Το `progress` περνιέται ακόμα από το Courses.jsx και ξαναχρησιμοποιείται
// μόλις ξεσχολιαστεί η μπάρα προόδου παρακάτω.
// eslint-disable-next-line no-unused-vars
function CourseCard({ course, hasContent, disabled, progress = 0 }) {
  // const { user } = useMe() // ξαναβάλε το μαζί με την Πρόοδο
  const questionCount = course.questionCount ?? 0
  // Πότε ήρθε νέα ύλη το λέει η γραμμή «Πριν X μέρες» στο footer της κάρτας.
  // Δεν υπάρχει και badge για το ίδιο πράγμα: δύο σημεία στην ίδια κάρτα να
  // διαβάζουν το ίδιο course.lastUpdated είναι θόρυβος, όχι έμφαση.
  const lastUpdatedText = formatLastUpdated(course.lastUpdated)

  const inner = (
    <div className="relative z-10 flex flex-col h-full space-y-4">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400">
          {course.semester}ο Εξάμηνο
        </span>
        {disabled && (
          <span className="shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t.courseCard.noContent}
          </span>
        )}
        {!disabled && (
          <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 group-hover:border-brand-500/40 transition-all shrink-0">
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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

      {/* Πρόοδος — προσωρινά εκτός: το backend δεν επιστρέφει ακόμα πραγματικό
          ποσοστό, οπότε η μπάρα έδειχνε πάντα 0% και υποσχόταν feature που δεν
          υπάρχει. Ξαναβάλε το μαζί με το ιστορικό (V1.2), μαζί με το useMe
          import και το `const { user } = useMe()` στην κορυφή του αρχείου.

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
      */}

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
        <div className="flex items-center gap-1.5 font-medium">
          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
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
