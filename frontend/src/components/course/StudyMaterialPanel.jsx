// Paginated study list: every course question with its correct answer(s) shown. Used by CourseStart (step 1).
import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { questionsApi, extractErrorMessage } from '../../lib/api'
import StudyQuestionCard from '../question/StudyQuestionCard'
import Pagination from '../ui/Pagination'
import ErrorState from '../ui/ErrorState'
import t from '../../content/courseStart.json'

const PER_PAGE = 10

function StudyMaterialPanel({ courseId, setSize }) {
  const PER_PAGE = setSize || 10
  const [questions, setQuestions] = useState(null)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1) // 1-indexed
  const topRef = useRef(null)

  const load = useCallback(() => {
    setError(null)
    setQuestions(null)
    questionsApi
      .listByCourse(courseId)
      .then((data) => setQuestions(data))
      .catch((err) => setError(extractErrorMessage(err, t.study.error)))
  }, [courseId])

  useEffect(() => { load() }, [load])

  const total = questions?.length ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * PER_PAGE

  const pageQuestions = useMemo(
    () => (questions ? questions.slice(start, start + PER_PAGE) : []),
    [questions, start, PER_PAGE]
  )

  const goToPage = useCallback((p) => {
    setPage(p)
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  // Keyboard: ← / → switch pages.
  useEffect(() => {
    if (total === 0) return
    function onKey(e) {
      const tag = e.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === 'ArrowRight' && safePage < totalPages) goToPage(safePage + 1)
      else if (e.key === 'ArrowLeft' && safePage > 1) goToPage(safePage - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [total, safePage, totalPages, goToPage])

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <ErrorState message={error} onRetry={load} />
      </div>
    )
  }

  if (questions == null) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-12 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">{t.study.loading}</p>
      </div>
    )
  }

  if (total === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center">
        <p className="text-slate-600 dark:text-slate-400">{t.study.empty}</p>
      </div>
    )
  }

  return (
    <div ref={topRef} className="scroll-mt-20">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="font-semibold text-slate-900 dark:text-slate-200">{t.study.title}</h2>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums">
          {t.study.countTemplate.replace('{total}', total)}
        </span>
      </div>

      <ul className="space-y-4">
        {pageQuestions.map((q, i) => (
          <StudyQuestionCard key={q.id} number={start + i + 1} question={q} />
        ))}
      </ul>

      <Pagination
        page={safePage}
        totalPages={totalPages}
        onChange={goToPage}
        prevLabel={t.study.prev}
        nextLabel={t.study.next}
        pageTemplate={t.study.pageTemplate}
      />
    </div>
  )
}

export default StudyMaterialPanel
