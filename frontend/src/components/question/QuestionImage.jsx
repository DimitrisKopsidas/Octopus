// Renders a question image (resolves backend/blob URLs) if present. Used by Test, Results, StudyMaterialPanel, QuestionCard.
import { useState } from 'react'
import { resolveImageUrl } from '../../lib/api'

// Renders a question image if one exists, otherwise nothing.
// `src` is the backend imageUrl (resolved to an absolute URL) or a local
// objectURL/blob (preview), which resolveImageUrl passes through untouched.
// If the image fails to load (404 / wrong host), it degrades to a subtle
// placeholder instead of the browser's broken-image icon.
function QuestionImage({ src, alt = '', className = '' }) {
  // Track the src that failed so a new src is retried automatically (no effect needed).
  const [failedSrc, setFailedSrc] = useState(null)

  if (!src) return null

  if (failedSrc === src) {
    return (
      <div
        className={`rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-500 text-xs inline-flex items-center justify-center gap-1.5 px-4 py-3 ${className}`}
      >
        <span aria-hidden="true">🖼</span> Η εικόνα δεν είναι διαθέσιμη
      </div>
    )
  }

  return (
    <img
      src={resolveImageUrl(src)}
      alt={alt}
      loading="lazy"
      onError={() => setFailedSrc(src)}
      className={`rounded-lg border border-slate-200 dark:border-slate-800 max-h-72 w-auto object-contain bg-slate-50 dark:bg-slate-950 ${className}`}
    />
  )
}

export default QuestionImage
