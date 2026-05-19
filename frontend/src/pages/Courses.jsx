import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { coursesApi } from '../lib/api'

function Courses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [semester, setSemester] = useState('all')
  const [query, setQuery] = useState('')

  useEffect(() => {
    let cancelled = false
    coursesApi.list()
      .then(data => { if (!cancelled) setCourses(data) })
      .catch(err => { if (!cancelled) setError(err.message || 'Σφάλμα φόρτωσης') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const availableSemesters = useMemo(
    () => [...new Set(courses.map(c => c.semester))].sort((a, b) => a - b),
    [courses]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return courses
      .filter(c => semester === 'all' || c.semester === semester)
      .filter(c =>
        !q ||
        c.name.toLowerCase().includes(q) ||
        String(c.id).includes(q)
      )
      .sort((a, b) => a.name.localeCompare(b.name, 'el'))
  }, [courses, semester, query])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Μαθήματα</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Διάλεξε μάθημα για να ξεκινήσεις εξάσκηση.
        </p>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <SemesterChip
            label="Όλα"
            active={semester === 'all'}
            onClick={() => setSemester('all')}
          />
          {availableSemesters.map(s => (
            <SemesterChip
              key={s}
              label={`Εξάμηνο ${s}`}
              active={semester === s}
              onClick={() => setSemester(s)}
            />
          ))}
        </div>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Αναζήτηση μαθήματος…"
          className="w-full max-w-md px-4 py-2 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {loading && (
        <p className="text-slate-500 dark:text-slate-400">Φόρτωση μαθημάτων…</p>
      )}

      {error && !loading && (
        <div className="rounded-md bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 p-4 text-rose-700 dark:text-rose-300">
          Αδυναμία φόρτωσης μαθημάτων: {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="rounded-lg bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400">Δεν βρέθηκαν μαθήματα με αυτά τα κριτήρια.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
}

function SemesterChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
        active
          ? 'bg-brand-600 text-white shadow-sm'
          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-600 hover:text-brand-700 dark:hover:text-brand-300'
      }`}
    >
      {label}
    </button>
  )
}

function CourseCard({ course }) {
  return (
    <Link
      to={`/courses/${course.id}/start`}
      className="group block bg-white dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-brand-400 dark:hover:border-brand-600 transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50 px-2 py-0.5 rounded mb-2">
            Εξάμηνο {course.semester}
          </span>
          <h3 className="font-semibold text-slate-900 dark:text-white leading-snug group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
            {course.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Κωδικός: {course.id}
          </p>
        </div>
        <span className="text-brand-600 dark:text-brand-400 text-xl shrink-0">→</span>
      </div>
    </Link>
  )
}

export default Courses
