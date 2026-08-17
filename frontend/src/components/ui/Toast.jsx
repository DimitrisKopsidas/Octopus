// Toast container + toast items. Mounted once in Layout.
import { useEffect } from 'react'
import { Check, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'
import { useToastStore } from '../../store/toastStore'

const VARIANT = {
  success: {
    bg: 'bg-white/95 dark:bg-slate-900/95',
    border: 'border-emerald-500/30 dark:border-emerald-500/40',
    glow: 'shadow-[0_8px_30px_rgb(16,185,129,0.15)] dark:shadow-[0_8px_30px_rgb(16,185,129,0.2)]',
    text: 'text-slate-900 dark:text-slate-100',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400',
    barBg: 'bg-emerald-500',
    icon: <Check className="w-5 h-5" strokeWidth={2.5} />,
  },
  error: {
    bg: 'bg-white/95 dark:bg-slate-900/95',
    border: 'border-rose-500/30 dark:border-rose-500/40',
    glow: 'shadow-[0_8px_30px_rgb(244,63,94,0.15)] dark:shadow-[0_8px_30px_rgb(244,63,94,0.2)]',
    text: 'text-slate-900 dark:text-slate-100',
    badgeBg: 'bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400',
    barBg: 'bg-rose-500',
    icon: <AlertCircle className="w-5 h-5" strokeWidth={2.5} />,
  },
  warning: {
    bg: 'bg-white/95 dark:bg-slate-900/95',
    border: 'border-amber-500/30 dark:border-amber-500/40',
    glow: 'shadow-[0_8px_30px_rgb(245,158,11,0.15)] dark:shadow-[0_8px_30px_rgb(245,158,11,0.2)]',
    text: 'text-slate-900 dark:text-slate-100',
    badgeBg: 'bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400',
    barBg: 'bg-amber-500',
    icon: <AlertTriangle className="w-5 h-5" strokeWidth={2.5} />,
  },
  info: {
    bg: 'bg-white/95 dark:bg-slate-900/95',
    border: 'border-brand-500/30 dark:border-brand-500/40',
    glow: 'shadow-[0_8px_30px_rgb(20,184,166,0.15)] dark:shadow-[0_8px_30px_rgb(20,184,166,0.2)]',
    text: 'text-slate-900 dark:text-slate-100',
    badgeBg: 'bg-brand-100 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400',
    barBg: 'bg-brand-500',
    icon: <Info className="w-5 h-5" strokeWidth={2.5} />,
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
      className="fixed top-5 right-5 left-5 sm:left-auto z-[100] flex flex-col gap-3 sm:w-96 pointer-events-none"
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
  }, [toast.duration, toast.seq, onClose])

  const v = VARIANT[toast.type] || VARIANT.info

  return (
    <div
      role={toast.type === 'error' ? 'alert' : 'status'}
      className={`pointer-events-auto relative overflow-hidden flex items-center gap-3.5 px-4 py-3.5 rounded-xl border backdrop-blur-md transition-all duration-300 ${v.bg} ${v.border} ${v.glow} animate-slideInRight`}
    >
      {/* Accent side bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${v.barBg}`} />

      {/* Icon badge */}
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${v.badgeBg}`}>
        {v.icon}
      </div>

      {/* Content */}
      <div className={`flex-1 min-w-0 ${v.text}`}>
        {toast.title && (
          <p className="text-sm font-bold tracking-tight mb-0.5">{toast.title}</p>
        )}
        <p className={`text-xs font-medium leading-relaxed ${toast.title ? 'opacity-85' : 'text-sm font-semibold'}`}>
          {toast.message}
        </p>
      </div>

      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Κλείσιμο"
        className="shrink-0 w-7 h-7 inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export default ToastContainer
