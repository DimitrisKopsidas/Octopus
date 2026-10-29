// Role pill: "Διαχειριστής", "Helper", "Φοιτητής".
import { roleLabel } from '../../lib/roles'

const ROLE_TONE = {
  ADMIN: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
  HELPER: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
  STUDENT: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800',
}

function RoleBadge({ role, className = '' }) {
  const tone = ROLE_TONE[role] ?? ROLE_TONE.STUDENT

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full border ${tone} ${className}`}>
      {roleLabel({ role })}
    </span>
  )
}

export default RoleBadge
