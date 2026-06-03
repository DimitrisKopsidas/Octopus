import { useState } from 'react'

// Friendly error state with an optional retry action.
// variant: 'page' (centered card, default) or 'banner' (compact inline row).
function ErrorState({
  message,
  onRetry,
  retryLabel = 'Δοκίμασε ξανά',
  title = 'Κάτι πήγε στραβά',
  icon = '📡',
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
      <div className="rounded-md bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 p-4 flex items-center justify-between gap-3 flex-wrap">
        <p className="text-rose-700 dark:text-rose-300 text-sm">{message}</p>
        {onRetry && (
          <RetryButton onClick={handleRetry} retrying={retrying} label={retryLabel} small />
        )}
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-10 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-3xl mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">{message}</p>
      {onRetry && (
        <RetryButton onClick={handleRetry} retrying={retrying} label={retryLabel} />
      )}
    </div>
  )
}

function RetryButton({ onClick, retrying, label, small }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={retrying}
      className={`inline-flex items-center gap-2 rounded-md bg-brand-600 hover:bg-brand-700 disabled:bg-brand-600/60 disabled:cursor-not-allowed text-white font-medium shadow-sm transition-colors ${
        small ? 'px-3 py-1.5 text-sm' : 'px-5 py-2.5'
      }`}
    >
      <span aria-hidden="true" className={retrying ? 'inline-block animate-spin' : ''}>↻</span>
      {retrying ? 'Προσπάθεια…' : label}
    </button>
  )
}

export default ErrorState
