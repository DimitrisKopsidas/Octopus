// Renders a question image (resolves backend/blob URLs) if present. Used by Test, Results, StudyMaterialPanel, QuestionCard.
import { resolveImageUrl } from '../../lib/api'

// Renders a question image if one exists, otherwise nothing.
// `src` is the backend imageUrl (resolved to an absolute URL) or a local
// objectURL/blob (preview), which resolveImageUrl passes through untouched.
function QuestionImage({ src, alt = '', className = '' }) {
  if (!src) return null
  return (
    <img
      src={resolveImageUrl(src)}
      alt={alt}
      loading="lazy"
      className={`rounded-lg border border-slate-200 dark:border-slate-800 max-h-72 w-auto object-contain bg-slate-50 dark:bg-slate-950 ${className}`}
    />
  )
}

export default QuestionImage
