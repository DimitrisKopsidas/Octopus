// Error card with retry (+ compact banner variant). Used across pages.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, AlertTriangle, RotateCw } from 'lucide-react'

function ErrorState({
  message,
  onRetry,
  retryLabel = 'Δοκίμασε ξανά',
  title = 'Κάτι πήγε στραβά',
  variant = 'page',
}) {
  const [retrying, setRetrying] = useState(false)

  async function handleRetry() {
    if (!onRetry || retrying) return
    setRetrying(true)
    try {
      await onRetry()
    } finally {
      setRetrying(false)
    }
  }

  if (variant === 'banner') {
    return (
      <div className="rounded-xl bg-rose-50/90 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 p-4 flex items-center justify-between gap-3 flex-wrap shadow-sm">
        <div className="flex items-center gap-3 text-rose-700 dark:text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
          <span className="font-medium">{message}</span>
        </div>
        {onRetry && (
          <RetryButton onClick={handleRetry} retrying={retrying} label={retryLabel} small />
        )}
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl rounded-3xl p-8 text-center animate-fade-up">
        {/* Glowing Error Aura */}
        <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

        {/* Icon */}
        <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 mb-5 shadow-sm">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          {onRetry && (
            <RetryButton onClick={handleRetry} retrying={retrying} label={retryLabel} />
          )}
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-all"
          >
            Αρχική Σελίδα
          </Link>
        </div>
      </div>
    </div>
  )
}

function RetryButton({ onClick, retrying, label, small }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={retrying}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold shadow-md shadow-brand-600/20 transition-all ${
        small ? 'px-3.5 py-1.5 text-xs' : 'px-5 py-2.5 text-sm'
      }`}
    >
      <RotateCw className={`w-4 h-4 ${retrying ? 'animate-spin' : ''}`} />
      <span>{retrying ? 'Προσπάθεια…' : label}</span>
    </button>
  )
}

export default ErrorState
