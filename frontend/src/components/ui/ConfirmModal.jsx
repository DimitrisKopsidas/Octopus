// Confirmation dialog (danger/default variants). Used by AdminCourse, Test.
import Modal from './Modal'

const VARIANT_STYLES = {
  default: 'bg-brand-600 hover:bg-brand-700',
  danger: 'bg-rose-600 hover:bg-rose-700',
}

function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Επιβεβαίωση',
  cancelLabel = 'Ακύρωση',
  variant = 'default',
  confirming = false,
}) {
  const confirmClasses = VARIANT_STYLES[variant] || VARIANT_STYLES.default
  const handleClose = confirming ? () => {} : onClose

  return (
    <Modal open={open} onClose={handleClose} title={title} size="sm">
      <div className="px-6 py-5">
        {typeof message === 'string' ? (
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {message}
          </p>
        ) : (
          message
        )}
      </div>
      <footer className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 rounded-b-xl">
        <button
          type="button"
          onClick={onClose}
          disabled={confirming}
          className="px-4 py-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 font-medium transition-colors disabled:opacity-50"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={confirming}
          className={`px-4 py-2 rounded-md text-white font-medium shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${confirmClasses}`}
        >
          {confirming ? 'Παρακαλώ περίμενε…' : confirmLabel}
        </button>
      </footer>
    </Modal>
  )
}

export default ConfirmModal
