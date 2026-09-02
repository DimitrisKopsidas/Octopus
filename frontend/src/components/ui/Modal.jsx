// Base modal (ESC, backdrop, scroll lock). Used by AdminCourse and ConfirmModal.
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import useBodyScrollLock from '../../hooks/useBodyScrollLock'

function Modal({ open, onClose, title, children, size = 'lg' }) {
  useBodyScrollLock(open)

  useEffect(() => {
    if (!open) return
    function handleKey(e) {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  const sizeClass = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }[size] || 'max-w-2xl'

  // Μέσα στο δέντρο της σελίδας, οποιοσδήποτε πρόγονος με transform ή filter
  // κάνει το `fixed` να μετράει ως προς εκείνον αντί για το viewport -- και το
  // modal ταξιδεύει με το scroll. Το createPortal ήταν ήδη imported εδώ αλλά
  // δεν χρησιμοποιούνταν· τώρα το overlay βγαίνει πράγματι στο document.body,
  // όπως ήδη κάνουν τα modals της διαχείρισης.
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Glassmorphic Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        className={`relative w-full ${sizeClass} my-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col max-h-[calc(100vh-4rem)] animate-reveal overflow-hidden`}
        onClick={e => e.stopPropagation()}
      >
        {title && (
          <header className="flex items-center justify-between px-6 py-4.5 border-b border-slate-200/80 dark:border-slate-800 shrink-0">
            <h2 id="modal-title" className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Κλείσιμο"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </header>
        )}
        <div className="flex-1 overflow-y-auto scrollbar-custom">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default Modal
