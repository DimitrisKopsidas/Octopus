// Admin dashboard: lists courses with an add-questions action. Route: /admin
import { useEffect, useMemo, useState } from 'react'
import { useCoursesStore } from '../store/coursesStore'
import AdminCourseCard from '../components/course/AdminCourseCard'
import AdminCourseCardSkeleton from '../components/course/AdminCourseCardSkeleton'
import Skeleton from '../components/ui/Skeleton'
import ErrorState from '../components/ui/ErrorState'
import t from '../content/admin.json'

function Admin() {
  const courses = useCoursesStore((s) => s.courses)
  const withContentIds = useCoursesStore((s) => s.withContentIds)
  const error = useCoursesStore((s) => s.error)
  const loadCourses = useCoursesStore((s) => s.loadCourses)
  const retryCourses = useCoursesStore((s) => s.retryCourses)
  const loadWithContent = useCoursesStore((s) => s.loadWithContent)

  const loading = courses == null && !error
  const safeWithContentIds = withContentIds ?? new Set()

  const [query, setQuery] = useState('')

  useEffect(() => { loadCourses().catch(() => {}) }, [loadCourses])
  useEffect(() => { loadWithContent() }, [loadWithContent])

  function retry() {
    loadWithContent()
    return retryCourses().catch(() => {})
  }

  const grouped = useMemo(() => {
    if (!courses) return []
    const q = query.trim().toLowerCase()
    const filtered = q
      ? courses.filter(c => c.name.toLowerCase().includes(q) || String(c.id).includes(q))
      : courses
    const bySemester = new Map()
    for (const course of filtered) {
      if (!bySemester.has(course.semester)) bySemester.set(course.semester, [])
      bySemester.get(course.semester).push(course)
    }
    return [...bySemester.entries()]
      .sort(([a], [b]) => a - b)
      .map(([semester, list]) => [semester, [...list].sort((a, b) => a.name.localeCompare(b.name, 'el'))])
  }, [courses, query])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-200 mb-2">{t.title}</h1>
        <p className="text-slate-600 dark:text-slate-400">{t.subtitle}</p>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full max-w-md px-4 py-2 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {loading && (
        <div role="status" aria-label={t.loading} className="space-y-10">
          {[1, 2].map((s) => (
            <section key={s}>
              <Skeleton className="h-3 w-24 mb-3" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => <AdminCourseCardSkeleton key={i} />)}
              </div>
            </section>
          ))}
        </div>
      )}

      {error && !loading && (
        <ErrorState message={error} onRetry={retry} retryLabel={t.retry} />
      )}

      {!loading && !error && grouped.length === 0 && (
        <p className="text-slate-500 dark:text-slate-400">{t.empty}</p>
      )}

      <div className="space-y-10">
        {grouped.map(([semester, list]) => (
          <section key={semester}>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              {t.semesterPrefix} {semester}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {list.map(course => (
                <AdminCourseCard
                  key={course.id}
                  course={course}
                  hasContent={safeWithContentIds.has(course.id)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

export default Admin
