import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCoursesStore } from '../store/coursesStore'
import Modal from '../components/Modal'
import ContentBadge from '../components/ContentBadge'
import Skeleton from '../components/Skeleton'
import t from '../content/courses.json'

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

function Courses() {
  const courses = useCoursesStore((s) => s.courses)
  const withContentIds = useCoursesStore((s) => s.withContentIds)
  const error = useCoursesStore((s) => s.error)
  const loadCourses = useCoursesStore((s) => s.loadCourses)
  const loadWithContent = useCoursesStore((s) => s.loadWithContent)

  const loading = courses == null
  const withContentLoaded = withContentIds != null
  const safeWithContentIds = withContentIds ?? new Set()

  const [query, setQuery] = useState('')

  // Applied filters (used by the listing)
  const [semester, setSemester] = useState('all')
  const [onlyWithContent, setOnlyWithContent] = useState(false)

  // Draft filters (modal state — applied only on submit)
  const [filterOpen, setFilterOpen] = useState(false)
  const [draftSemester, setDraftSemester] = useState('all')
  const [draftOnlyWithContent, setDraftOnlyWithContent] = useState(false)

  // Pagination (UX Show More)
  const [visibleCount, setVisibleCount] = useState(6)

  useEffect(() => {
    setVisibleCount(6)
  }, [query, semester, onlyWithContent])

  useEffect(() => { loadCourses().catch(() => {}) }, [loadCourses])
  useEffect(() => { loadWithContent() }, [loadWithContent])

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

  const activeFilterCount =
    (semester !== 'all' ? 1 : 0) + (onlyWithContent ? 1 : 0)
  const draftActiveCount =
    (draftSemester !== 'all' ? 1 : 0) + (draftOnlyWithContent ? 1 : 0)

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
        <p className="text-slate-600 dark:text-slate-400">
          {t.subtitle}
        </p>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="flex-1 max-w-md px-4 py-2 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button
          type="button"
          onClick={openFilters}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:border-brand-400 dark:hover:border-brand-600 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
        >
          <span aria-hidden="true">⚙</span>
          <span className="hidden sm:inline">{t.filtersButton}</span>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-brand-600 text-white text-xs font-semibold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {loading && (
        <div
          role="status"
          aria-label={t.loading}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="rounded-md bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 p-4 text-rose-700 dark:text-rose-300">
          {t.errorPrefix} {error}
        </div>
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
            <CourseCard
              key={course.id}
              course={course}
              hasContent={hasContent}
              disabled={disabled}
            />
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
            <span aria-hidden="true" className="text-xs transition-transform group-hover:translate-y-0.5">▼</span>
          </button>
        </div>
      )}

      <Modal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        title={t.filterModal.title}
        size="md"
      >
        <div className="px-6 py-5 space-y-6">
          <section>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              {t.filterModal.semesterTitle}
            </h3>
            <div className="grid grid-cols-5 gap-2">
              <SemesterButton
                label={t.filterModal.allLabel}
                active={draftSemester === 'all'}
                onClick={() => setDraftSemester('all')}
              />
              {SEMESTERS.map(s => (
                <SemesterButton
                  key={s}
                  label={String(s)}
                  active={draftSemester === s}
                  onClick={() => setDraftSemester(s)}
                />
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              {t.filterModal.contentTitle}
            </h3>
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-md border border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-600 transition-colors">
              <input
                type="checkbox"
                checked={draftOnlyWithContent}
                onChange={e => setDraftOnlyWithContent(e.target.checked)}
                className="sr-only peer"
              />
              <span
                className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500 peer-focus-visible:ring-offset-2 ${
                  draftOnlyWithContent
                    ? 'bg-brand-600 border-brand-600'
                    : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-600'
                }`}
              >
                {draftOnlyWithContent && (
                  <svg
                    viewBox="0 0 16 16"
                    className="w-3.5 h-3.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="3 8 7 12 13 4" />
                  </svg>
                )}
              </span>
              <span className="text-sm text-slate-900 dark:text-slate-100">
                {t.filterModal.onlyWithContent}
              </span>
            </label>
          </section>
        </div>

        <footer className="flex items-center justify-between gap-2 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 rounded-b-xl">
          <button
            type="button"
            onClick={resetDraft}
            disabled={draftActiveCount === 0}
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {t.filterModal.reset}
          </button>
          <button
            type="button"
            onClick={applyFilters}
            className="px-4 py-2 rounded-md bg-brand-600 hover:bg-brand-700 text-white font-medium shadow-sm transition-colors"
          >
            {t.filterModal.apply}
          </button>
        </footer>
      </Modal>
    </div>
  )
}

function SemesterButton({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? 'bg-brand-600 text-white shadow-sm'
          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-600 hover:text-brand-700 dark:hover:text-brand-300'
      }`}
    >
      {label}
    </button>
  )
}

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

function CourseCardSkeleton() {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <div className="mt-auto pt-4 flex justify-end">
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  )
}

export default Courses
