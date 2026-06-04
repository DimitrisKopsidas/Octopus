// Flashcard study mode: reveal correct answer(s) per question. Used by CourseStart (step 1).
import { useEffect, useState, useCallback } from 'react'
import { questionsApi, extractErrorMessage } from '../../lib/api'
import { isMultiAnswer } from '../../lib/scoring'
import QuestionImage from '../question/QuestionImage'
import ErrorState from '../ui/ErrorState'
import t from '../../content/courseStart.json'

// Flashcard-style study mode: one question per card, reveal the correct
// answer(s) on demand, step through the whole course material.
function StudyMaterialPanel({ courseId }) {
  const [questions, setQuestions] = useState(null)
  const [error, setError] = useState(null)
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [done, setDone] = useState(false)

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
  const current = questions?.[index]
  const isMulti = current ? isMultiAnswer(current) : false

  const goPrev = useCallback(() => {
    setRevealed(false)
    setIndex((i) => Math.max(0, i - 1))
  }, [])

  const goNext = useCallback(() => {
    setRevealed(false)
    setIndex((i) => {
      if (i >= total - 1) { setDone(true); return i }
      return i + 1
    })
  }, [total])

  const restart = useCallback(() => {
    setDone(false)
    setRevealed(false)
    setIndex(0)
  }, [])

  // Keyboard: ← / → navigate, Space / Enter toggle reveal.
  useEffect(() => {
    if (!current || done) return
    function onKey(e) {
      const tag = e.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === 'ArrowRight') goNext()
      else if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        setRevealed((r) => !r)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [current, done, goNext, goPrev])

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

  if (done) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-900 shadow-sm p-10 text-center">
        <p className="text-lg font-semibold text-slate-900 dark:text-white mb-1">{t.study.doneTitle}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{t.study.doneHint}</p>
        <button
          type="button"
          onClick={restart}
          className="px-5 py-2.5 rounded-md bg-brand-600 hover:bg-brand-700 text-white font-medium shadow-sm transition-colors cursor-pointer"
        >
          {t.study.restart}
        </button>
      </div>
    )
  }

  const progress = Math.round(((index + 1) / total) * 100)

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <header className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold text-slate-900 dark:text-white text-sm">{t.study.title}</h2>
          <div className="flex items-center gap-3">
            {revealed && (
              <button
                type="button"
                onClick={() => setRevealed(false)}
                className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span aria-hidden="true">×</span> {t.study.clear}
              </button>
            )}
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums">
              {t.study.progressTemplate.replace('{current}', index + 1).replace('{total}', total)}
            </span>
          </div>
        </div>
        <div className="mt-3 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div className="h-full bg-brand-600 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <div key={current.id} className="px-6 py-6 min-h-[18rem] flex flex-col animate-fadeIn">
        {isMulti && (
          <p className="mb-3 text-xs font-medium text-brand-700 dark:text-brand-400 inline-flex items-center gap-1.5">
            <span aria-hidden="true">☑</span> {t.study.multiHint}
          </p>
        )}

        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white leading-snug mb-4">
          {current.title}
        </h3>

        {current.imageUrl && (
          <div className="mb-5 flex justify-center">
            <QuestionImage src={current.imageUrl} alt={current.title} className="max-h-56" />
          </div>
        )}

        <ul className="space-y-2">
          {current.answers.map((a) => {
            const showCorrect = revealed && a.isCorrect
            const tone = showCorrect
              ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800'
              : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
            return (
              <li key={a.id} className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors ${tone} ${showCorrect ? 'animate-reveal' : ''}`}>
                <span className="text-base shrink-0">{showCorrect ? '✓' : '·'}</span>
                <span className="flex-1">{a.title}</span>
                {showCorrect && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded shrink-0">
                    {t.study.correctTag}
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      </div>

      <footer className="flex items-center justify-between gap-2 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
        <button
          type="button"
          onClick={goPrev}
          disabled={index === 0}
          className="px-4 py-2 rounded-md text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-600 font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {t.study.prev}
        </button>

        <button
          type="button"
          onClick={revealed ? goNext : () => setRevealed(true)}
          className="px-4 py-2 rounded-md bg-brand-600 hover:bg-brand-700 text-white font-medium shadow-sm transition-colors cursor-pointer"
        >
          {revealed ? t.study.next : t.study.reveal}
        </button>
      </footer>
    </div>
  )
}

export default StudyMaterialPanel
