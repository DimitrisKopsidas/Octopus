// Inline clickable name that opens the user preview modal.
// Without a username (unknown/inactive author) it renders plain text.
import { openUserPreview } from '../../store/userPreviewStore'

function UserLink({ username, children, className = '' }) {
  if (!username) return <span className={className}>{children}</span>

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        openUserPreview(username)
      }}
      className={`font-semibold underline decoration-dotted underline-offset-2 hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer ${className}`}
    >
      {children}
    </button>
  )
}

export default UserLink
