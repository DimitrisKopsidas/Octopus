// Courses listing page: search + semester filter + Show-More pagination. Route: /courses
import { useEffect, useMemo, useState } from 'react'
import { useCoursesStore } from '../store/coursesStore'
import CourseCard from '../components/course/CourseCard'
import CourseCardSkeleton from '../components/course/CourseCardSkeleton'
import CoursesFilterModal from '../components/course/CoursesFilterModal'
import ErrorState from '../components/ui/ErrorState'
import t from '../content/courses.json'

// Small inline UI glyphs (stroke, currentColor) — keeps the page free of emoji
// and avoids an icon-library dependency.
function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function Courses() {
  const courses = useCoursesStore((s) => s.courses)
  const withContentIds = useCoursesStore((s) => s.withContentIds)
  const error = useCoursesStore((s) => s.error)
  const loadCourses = useCoursesStore((s) => s.loadCourses)
  const retryCourses = useCoursesStore((s) => s.retryCourses)
  const loadWithContent = useCoursesStore((s) => s.loadWithContent)

  const loading = courses == null && !error
  const withContentLoaded = withContentIds != null
  const safeWithContentIds = withContentIds ?? new Set()

  const [query, setQuery] = useState('')

  // Applied filters
  const [semester, setSemester] = useState('all')
  const [onlyWithContent, setOnlyWithContent] = useState(false)

  // Draft filters (modal state)
  const [filterOpen, setFilterOpen] = useState(false)
  const [draftSemester, setDraftSemester] = useState('all')
  const [draftOnlyWithContent, setDraftOnlyWithContent] = useState(false)

  const [visibleCount, setVisibleCount] = useState(6)

  useEffect(() => { setVisibleCount(6) }, [query, semester, onlyWithContent])
  useEffect(() => { loadCourses().catch(() => {}) }, [loadCourses])
  useEffect(() => { loadWithContent() }, [loadWithContent])

  function retry() {
    loadWithContent()
    return retryCourses().catch(() => {})
  }

  const filtered = useMemo(() => {
    if (!courses) return []
    const q = query.trim().toLowerCase()
    return courses
      .filter(c => semester === 'all' || c.semester === semester)
      .filter(c => !onlyWithContent || safeWithContentIds.has(c.id))
      .filter(c => !q || c.name.toLowerCase().includes(q) || String(c.id).includes(q))
      .sort((a, b) => {
        const aHas = safeWithContentIds.has(a.id) ? 1 : 0
        const bHas = safeWithContentIds.has(b.id) ? 1 : 0
        if (aHas !== bHas) return bHas - aHas
        if (a.semester !== b.semester) return a.semester - b.semester
        return a.name.localeCompare(b.name, 'el')
      })
  }, [courses, query, semester, onlyWithContent, safeWithContentIds])

  const activeFilterCount = (semester !== 'all' ? 1 : 0) + (onlyWithContent ? 1 : 0)
  const draftActiveCount = (draftSemester !== 'all' ? 1 : 0) + (draftOnlyWithContent ? 1 : 0)

  function openFilters() {
    setDraftSemester(semester)
    setDraftOnlyWithContent(onlyWithContent)
    setFilterOpen(true)
  }
  function applyFilters() {
    setSemester(draftSemester)
    setOnlyWithContent(draftOnlyWithContent)
    setFilterOpen(false)
  }
  function resetDraft() {
    setDraftSemester('all')
    setDraftOnlyWithContent(false)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{t.title}</h1>
        <p className="text-slate-600 dark:text-slate-400">{t.subtitle}</p>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
            <SearchIcon />
          </span>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <button
          type="button"
          onClick={openFilters}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:border-brand-400 dark:hover:border-brand-600 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
        >
          <FilterIcon />
          <span className="hidden sm:inline">{t.filtersButton}</span>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-brand-600 text-white text-xs font-semibold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {loading && (
        <div role="status" aria-label={t.loading} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <CourseCardSkeleton key={i} />)}
        </div>
      )}

      {error && !loading && (
        <ErrorState message={error} onRetry={retry} retryLabel={t.retry} />
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="rounded-lg bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400">{t.empty}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.slice(0, visibleCount).map(course => {
          const hasContent = safeWithContentIds.has(course.id)
          const disabled = withContentLoaded && !hasContent
          return (
            <CourseCard key={course.id} course={course} hasContent={hasContent} disabled={disabled} />
          )
        })}
      </div>

      {filtered.length > visibleCount && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount(prev => prev + 6)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold hover:border-brand-400 dark:hover:border-brand-600 hover:text-brand-700 dark:hover:text-white shadow-sm transition-all cursor-pointer group"
          >
            <span>{t.showMore}</span>
            <span aria-hidden="true" className="transition-transform group-hover:translate-y-0.5">
              <ChevronDownIcon />
            </span>
          </button>
        </div>
      )}

      <CoursesFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        draftSemester={draftSemester}
        setDraftSemester={setDraftSemester}
        draftOnlyWithContent={draftOnlyWithContent}
        setDraftOnlyWithContent={setDraftOnlyWithContent}
        onApply={applyFilters}
        onReset={resetDraft}
        resetDisabled={draftActiveCount === 0}
      />
    </div>
  )
}

export default Courses
