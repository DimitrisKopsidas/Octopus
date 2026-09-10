import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useCourses, useCoursesWithContent } from '../hooks/queries'
import AdminCourseCard from '../components/course/AdminCourseCard'
import AdminCourseCardSkeleton from '../components/course/AdminCourseCardSkeleton'
import CoursesFilterModal from '../components/course/CoursesFilterModal'
import PanelNavigation from '../components/layout/PanelNavigation'
import Skeleton from '../components/ui/Skeleton'
import ErrorState from '../components/ui/ErrorState'
import t from '../content/controlPanel.json'

const EMPTY_SET = new Set()

export default function ControlPanelCoursesPage() {
  const { data: courses, error, isPending, refetch: refetchCourses } = useCourses(t.coursesPage.errorLoad)
  const { data: withContentIds, refetch: refetchWithContent } = useCoursesWithContent()

  const loading = isPending && !error

  const [query, setQuery] = useState('')

  // Applied filters
  const [semesters, setSemesters] = useState([])   // empty = all
  const [onlyWithContent, setOnlyWithContent] = useState(false)

  // Draft filters (modal state)
  const [filterOpen, setFilterOpen] = useState(false)
  const [draftSemesters, setDraftSemesters] = useState([])
  const [draftOnlyWithContent, setDraftOnlyWithContent] = useState(false)

  const activeFilterCount = (semesters.length > 0 ? 1 : 0) + (onlyWithContent ? 1 : 0)
  const draftActiveCount = (draftSemesters.length > 0 ? 1 : 0) + (draftOnlyWithContent ? 1 : 0)

  function retry() {
    refetchWithContent()
    return refetchCourses()
  }

  function openFilters() {
    setDraftSemesters(semesters)
    setDraftOnlyWithContent(onlyWithContent)
    setFilterOpen(true)
  }

  function applyFilters() {
    setSemesters(draftSemesters)
    setOnlyWithContent(draftOnlyWithContent)
    setFilterOpen(false)
  }

  function resetDraft() {
    setDraftSemesters([])
    setDraftOnlyWithContent(false)
  }

  const grouped = useMemo(() => {
    if (!courses) return []
    const safeWithContentIds = withContentIds ?? EMPTY_SET
    const q = query.trim().toLowerCase()
    const filtered = courses
      .filter(c => semesters.length === 0 || semesters.includes(c.semester))
      .filter(c => !onlyWithContent || safeWithContentIds.has(c.id))
      .filter(c => !q || c.name.toLowerCase().includes(q) || String(c.id).includes(q))

    const bySemester = new Map()
    for (const course of filtered) {
      if (!bySemester.has(course.semester)) bySemester.set(course.semester, [])
      bySemester.get(course.semester).push(course)
    }
    return [...bySemester.entries()]
      .sort(([a], [b]) => a - b)
      .map(([semester, list]) => [semester, [...list].sort((a, b) => a.name.localeCompare(b.name, 'el'))])
  }, [courses, query, semesters, onlyWithContent, withContentIds])

  return (
    <div className="space-y-6">
      {/* Top Navigation Tabs */}
      <PanelNavigation activeTab="/control-panel/courses" />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-200 mb-2">{t.coursesPage.title}</h1>
        <p className="text-slate-600 dark:text-slate-400">{t.coursesPage.subtitle}</p>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t.coursesPage.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <button
          type="button"
          onClick={openFilters}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:border-brand-400 dark:hover:border-brand-600 hover:text-brand-700 dark:hover:text-brand-300 transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Φίλτρα</span>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-brand-600 text-white text-xs font-semibold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {loading && (
        <div role="status" aria-label={t.coursesPage.loading} className="space-y-10">
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
        <ErrorState message={error} onRetry={retry} retryLabel={t.coursesPage.retry} />
      )}

      {!loading && !error && grouped.length === 0 && (
        <p className="text-slate-500 dark:text-slate-400">{t.coursesPage.empty}</p>
      )}

      <div className="space-y-10">
        {grouped.map(([semester, list]) => (
          <section key={semester}>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              {t.coursesPage.semesterPrefix} {semester}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {list.map(course => (
                <AdminCourseCard
                  key={course.id}
                  course={course}
                  hasContent={withContentIds?.has(course.id) ?? false}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <CoursesFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        draftSemesters={draftSemesters}
        setDraftSemesters={setDraftSemesters}
        draftOnlyWithContent={draftOnlyWithContent}
        setDraftOnlyWithContent={setDraftOnlyWithContent}
        showContentFilter={true}
        onApply={applyFilters}
        onReset={resetDraft}
        resetDisabled={draftActiveCount === 0}
      />
    </div>
  )
}
