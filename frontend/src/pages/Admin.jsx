// Admin dashboard: lists courses with an add-questions action. Route: /admin
import { useMemo, useState } from 'react'
import { useCourses, useCoursesWithContent } from '../hooks/queries'
import AdminCourseCard from '../components/course/AdminCourseCard'
import AdminCourseCardSkeleton from '../components/course/AdminCourseCardSkeleton'
import Skeleton from '../components/ui/Skeleton'
import ErrorState from '../components/ui/ErrorState'
import t from '../content/admin.json'

function Admin() {
  const { data: courses, error, isPending, refetch: refetchCourses } = useCourses(t.errorLoad)
  const { data: withContentIds, refetch: refetchWithContent } = useCoursesWithContent()

  const loading = isPending && !error
  const safeWithContentIds = withContentIds ?? new Set()

  const [query, setQuery] = useState('')

  function retry() {
    refetchWithContent()
    return refetchCourses()
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

      {/* 3 Helper Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 animate-fade-up">
        {/* Card 1: Question Management */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl rounded-2xl p-6 flex flex-col items-start transition-all hover:border-brand-500/40 hover:-translate-y-1">
          <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-900/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4 shadow-sm">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5">
            {t.features[0].title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {t.features[0].description}
          </p>
        </div>

        {/* Card 2: Reports & Feedback */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl rounded-2xl p-6 flex flex-col items-start transition-all hover:border-amber-500/40 hover:-translate-y-1">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/60 text-amber-500 flex items-center justify-center mb-4 shadow-sm">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5">
            {t.features[1].title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {t.features[1].description}
          </p>
        </div>

        {/* Card 3: Overview */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl rounded-2xl p-6 flex flex-col items-start transition-all hover:border-purple-500/40 hover:-translate-y-1">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-900/60 text-purple-500 flex items-center justify-center mb-4 shadow-sm">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5">
            {t.features[2].title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {t.features[2].description}
          </p>
        </div>
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
