import { useEffect } from 'react'
import { useToastStore } from '../../store/toastStore'

const VARIANT = {
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/90',
    border: 'border-emerald-200 dark:border-emerald-900',
    text: 'text-emerald-900 dark:text-emerald-100',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    icon: '✓',
  },
  error: {
    bg: 'bg-rose-50 dark:bg-rose-950/90',
    border: 'border-rose-200 dark:border-rose-900',
    text: 'text-rose-900 dark:text-rose-100',
    iconColor: 'text-rose-600 dark:text-rose-400',
    icon: '✕',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-950/90',
    border: 'border-amber-200 dark:border-amber-900',
    text: 'text-amber-900 dark:text-amber-100',
    iconColor: 'text-amber-600 dark:text-amber-400',
    icon: '⚠',
  },
  info: {
    bg: 'bg-white dark:bg-slate-900',
    border: 'border-slate-200 dark:border-slate-700',
    text: 'text-slate-900 dark:text-slate-100',
    iconColor: 'text-brand-600 dark:text-brand-400',
    icon: 'ℹ',
  },
}

function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)
  const remove = useToastStore((s) => s.remove)

  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed top-4 right-4 left-4 sm:left-auto z-[100] flex flex-col gap-2 sm:w-96 pointer-events-none"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => remove(toast.id)} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onClose }) {
  useEffect(() => {
    if (!toast.duration) return
    const timer = setTimeout(onClose, toast.duration)
    return () => clearTimeout(timer)
  }, [toast.duration, onClose])

  const v = VARIANT[toast.type] || VARIANT.info

  return (
    <div
      role={toast.type === 'error' ? 'alert' : 'status'}
      className={`pointer-events-auto flex items-start gap-3 p-3.5 pr-2 rounded-lg shadow-lg border backdrop-blur ${v.bg} ${v.border} animate-slideInRight`}
    >
      <span aria-hidden="true" className={`text-lg leading-none mt-0.5 shrink-0 ${v.iconColor}`}>
        {v.icon}
      </span>
      <div className={`flex-1 min-w-0 ${v.text}`}>
        {toast.title && (
          <p className="text-sm font-semibold leading-tight">{toast.title}</p>
        )}
        <p className={`text-sm leading-snug ${toast.title ? 'mt-0.5 opacity-80' : ''}`}>
          {toast.message}
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Κλείσιμο"
        className={`shrink-0 w-7 h-7 inline-flex items-center justify-center rounded-md text-lg leading-none opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-opacity ${v.text}`}
      >
        ×
      </button>
    </div>
  )
}

export default ToastContainer
