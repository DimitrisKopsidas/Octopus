// Mistakes quiz: questions answered wrongly and not yet fixed, plus its explanation bubble. Used by CourseStart (step 4).
import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Info } from 'lucide-react'
import TimerPicker from './TimerPicker'
import t from '../../content/courseStart.json'

function UnsolvedQuizPanel({
  isLoggedIn,
  loading,
  error,
  remaining,
  durationSeconds,
  setDurationSeconds,
  timerOptions,
  starting,
  onStart,
  onRetry,
  onGoToQuizzes,
}) {
  const empty = isLoggedIn && !loading && !error && remaining === 0

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <header className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 rounded-t-xl flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-200 text-sm">{t.unsolved.title}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.unsolved.subtitle}</p>
        </div>
        <ExplanationBubble />
      </header>

      <div className="px-6 py-6">
        {!isLoggedIn && !loading && (
          <EmptyState
            emoji="🔒"
            title={t.unsolved.loginTitle}
            body={t.unsolved.loginHint}
            action={
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-sm transition-colors"
              >
                {t.unsolved.loginButton}
              </Link>
            }
          />
        )}

        {loading && (
          <div className="space-y-3" aria-busy="true">
            <div className="h-10 w-24 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="h-10 w-full rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
          </div>
        )}

        {isLoggedIn && !loading && error && (
          <div className="text-center">
            <p className="text-sm text-rose-600 dark:text-rose-400 mb-4">{t.unsolved.error}</p>
            <button
              type="button"
              onClick={() => onRetry()}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-colors cursor-pointer bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200"
            >
              {t.unsolved.retry}
            </button>
          </div>
        )}

        {empty && (
          <EmptyState
            emoji="🎉"
            title={t.unsolved.emptyTitle}
            body={t.unsolved.emptyBody}
            action={
              <button
                type="button"
                onClick={onGoToQuizzes}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-sm transition-colors cursor-pointer"
              >
                {t.unsolved.emptyCta}
              </button>
            }
          />
        )}

        {isLoggedIn && !loading && !error && !empty && (
          <div className="space-y-5">
            <div>
              <p className="text-4xl font-bold text-rose-600 dark:text-rose-400 tabular-nums leading-none">{remaining}</p>
              <p className="text-sm text-slate-700 dark:text-slate-300 mt-2">{t.unsolved.remainingLabel}</p>
            </div>
            <TimerPicker
              durationSeconds={durationSeconds}
              setDurationSeconds={setDurationSeconds}
              timerOptions={timerOptions}
            />
            <button
              type="button"
              onClick={onStart}
              disabled={starting}
              className="w-full py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed bg-brand-600 hover:bg-brand-700 text-white"
            >
              {starting ? t.unsolved.loading : t.unsolved.start}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState({ emoji, title, body, action }) {
  return (
    <div className="text-center py-4">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-900/60 flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm">
        {emoji}
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto mb-5">{body}</p>
      {action}
    </div>
  )
}

// Info button that toggles a speech bubble. Closes on outside click and Escape.
function ExplanationBubble() {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)
  const bubbleId = useId()

  useEffect(() => {
    if (!open) return
    function onPointerDown(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false)
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={wrapperRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t.unsolved.infoLabel}
        aria-expanded={open}
        aria-controls={bubbleId}
        title={t.unsolved.infoLabel}
        className={`p-1 rounded-full transition-colors cursor-pointer ${
          open
            ? 'text-brand-700 dark:text-brand-300 bg-brand-100 dark:bg-brand-900/60'
            : 'text-brand-500 hover:text-brand-700 dark:hover:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-900/60'
        }`}
      >
        <Info className="w-5 h-5" />
      </button>

      {open && (
        <div
          id={bubbleId}
          role="tooltip"
          className="absolute right-0 top-full mt-2 z-20 w-80 max-w-[calc(100vw-3rem)] rounded-lg border border-brand-200 dark:border-brand-800 bg-white dark:bg-slate-900 shadow-xl p-4 animate-fade-up"
        >
          {/* Arrow pointing back at the button */}
          <span
            aria-hidden="true"
            className="absolute -top-1.5 right-3 w-3 h-3 rotate-45 bg-white dark:bg-slate-900 border-l border-t border-brand-200 dark:border-brand-800"
          />
          <h5 className="font-semibold text-brand-900 dark:text-brand-300 text-sm mb-2">
            {t.unsolved.bubbleTitle}
          </h5>
          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-4">
            {t.unsolved.bubblePoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default UnsolvedQuizPanel
