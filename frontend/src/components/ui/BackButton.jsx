// Back navigation link button. Used across pages.
import { Link } from 'react-router-dom'

function BackButton({ to, label = 'Πίσω' }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1 text-sm text-brand-700 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 font-medium"
    >
      <span aria-hidden="true">←</span>
      <span>{label}</span>
    </Link>
  )
}

export default BackButton
