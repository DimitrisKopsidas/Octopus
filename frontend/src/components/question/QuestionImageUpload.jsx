// Image picker with live preview + validation. Used by QuestionForm.
import { useEffect, useState } from 'react'
import { resolveImageUrl } from '../../lib/api'

const MAX_MB = 1
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

// Image picker with live preview. The actual file lives in the parent (QuestionForm).
// Preview uses a local objectURL so the helper sees the image instantly, before any upload.
function QuestionImageUpload({ file, existingUrl, onFileChange, onRemove }) {
  const [localError, setLocalError] = useState(null)
  const [objectUrl, setObjectUrl] = useState(null)

  // Build (and revoke) a local preview URL when a File is selected
  useEffect(() => {
    if (!file) {
      setObjectUrl(null)
      return
    }
    const url = URL.createObjectURL(file)
    setObjectUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  // objectUrl is a local blob (new pick); existingUrl is a backend URL (edit mode)
  const preview = objectUrl || (existingUrl ? resolveImageUrl(existingUrl) : null)

  function handleSelect(e) {
    const selected = e.target.files?.[0]
    e.target.value = '' // allow re-selecting the same file
    if (!selected) return
    if (!ACCEPTED.includes(selected.type)) {
      setLocalError('Δεκτές μόνο εικόνες (JPG, PNG, WebP, GIF).')
      return
    }
    if (selected.size > MAX_MB * 1024 * 1024) {
      setLocalError(`Η εικόνα δεν πρέπει να ξεπερνά τα ${MAX_MB}MB.`)
      return
    }
    setLocalError(null)
    onFileChange(selected)
  }

  return (
    <section>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        Εικόνα <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">(προαιρετικό)</span>
      </label>

      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Προεπισκόπηση εικόνας ερώτησης"
            className="rounded-lg border border-slate-200 dark:border-slate-700 max-h-56 w-auto object-contain bg-slate-50 dark:bg-slate-950"
          />
          <button
            type="button"
            onClick={onRemove}
            aria-label="Αφαίρεση εικόνας"
            className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-md flex items-center justify-center transition-colors"
          >
            <span className="text-lg leading-none">×</span>
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center gap-1 px-4 py-6 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-600 cursor-pointer transition-colors bg-slate-50 dark:bg-slate-950">
          <span className="text-2xl" aria-hidden="true">🖼</span>
          <span className="text-sm font-medium text-brand-700 dark:text-brand-400">
            Επίλεξε εικόνα
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            JPG, PNG, WebP, GIF · έως {MAX_MB}MB
          </span>
          <input type="file" accept={ACCEPTED.join(',')} onChange={handleSelect} className="hidden" />
        </label>
      )}

      {localError && (
        <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5">{localError}</p>
      )}
    </section>
  )
}

export default QuestionImageUpload
