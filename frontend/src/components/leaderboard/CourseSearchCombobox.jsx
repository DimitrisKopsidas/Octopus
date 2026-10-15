import { useState, useMemo, useEffect, useRef } from 'react'
import { BookOpen, Search, ChevronDown, Check, X } from 'lucide-react'
import t from '../../content/leaderboard.json'

function CourseSearchCombobox({
  courses,
  selectedCourseId,
  onSelectCourse,
  coursesWithQuizzesSet,
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filterWithDataOnly, setFilterWithDataOnly] = useState(false)
  const containerRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedCourse = useMemo(() => {
    return courses.find((c) => String(c.id) === String(selectedCourseId)) || null
  }, [courses, selectedCourseId])

  const filteredCourses = useMemo(() => {
    const q = search.trim().toLowerCase()
    return courses.filter((c) => {
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        String(c.semester).includes(q) ||
        `${c.semester}ο`.includes(q)

      const matchData = !filterWithDataOnly || coursesWithQuizzesSet.has(c.name)
      return matchSearch && matchData
    })
  }, [courses, search, filterWithDataOnly, coursesWithQuizzesSet])

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger Button with clean well-spaced Chevron Arrow */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 text-left rounded-2xl bg-slate-50/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-brand-500/60 dark:hover:border-brand-500/60 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all cursor-pointer group"
      >
        <div className="flex items-center gap-3 min-w-0 pr-3">
          <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
              {selectedCourse ? selectedCourse.name : t.courseSelect.placeholder}
            </p>
            {selectedCourse && (
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                <span>{selectedCourse.semester}ο εξάμηνο</span>
                {coursesWithQuizzesSet.has(selectedCourse.name) && (
                  <span className="text-amber-500 dark:text-amber-400 font-semibold text-[11px]">
                    ★ Έχει δεδομένα
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Dedicated arrow container with generous spacing and rotation */}
        <div className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 shrink-0 transition-colors ml-2">
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-200 ${
              open ? 'rotate-180 text-brand-600 dark:text-brand-400' : ''
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu Panel with search input */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 z-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-fade-up">
          {/* Search Header */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Αναζήτηση μαθήματος ή εξαμήνου (π.χ. Φυσική, 1ο)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Filter Pills */}
            <div className="flex items-center gap-1.5 pt-0.5">
              <button
                type="button"
                onClick={() => setFilterWithDataOnly(false)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  !filterWithDataOnly
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Όλα ({courses.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterWithDataOnly(true)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  filterWithDataOnly
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <span>★ Μόνο με δεδομένα</span>
                <span>({coursesWithQuizzesSet.size})</span>
              </button>
            </div>
          </div>

          {/* Courses List with dark scrollbar */}
          <ul className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-1">
            {filteredCourses.length === 0 ? (
              <li className="py-8 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Δεν βρέθηκε μάθημα που να ταιριάζει στην αναζήτηση.
              </li>
            ) : (
              filteredCourses.map((c) => {
                const isSelected = String(c.id) === String(selectedCourseId)
                const hasQuizzes = coursesWithQuizzesSet.has(c.name)

                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectCourse(String(c.id))
                        setOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-brand-50/80 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-semibold'
                          : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/50 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="min-w-0 pr-3">
                        <p className="text-sm leading-tight truncate">{c.name}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                          {c.semester}ο εξάμηνο
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {hasQuizzes && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60">
                            ★ Δεδομένα
                          </span>
                        )}
                        {isSelected && <Check className="w-4 h-4 text-brand-600 dark:text-brand-400" />}
                      </div>
                    </button>
                  </li>
                )
              })
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default CourseSearchCombobox
