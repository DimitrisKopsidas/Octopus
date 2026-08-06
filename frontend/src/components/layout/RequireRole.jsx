// Route guard for content-management pages. Wraps restricted routes in main.jsx.
import { useMe } from '../../hooks/queries'
import { ROLE } from '../../lib/roles'
import Skeleton from '../ui/Skeleton'
import NoAccessAdmin from './NoAccessAdmin'
import NoAccessHelper from './NoAccessHelper'

function RequireRole({ children, allowedRoles = [ROLE.HELPER, ROLE.ADMIN] }) {
  const { user, isLoading } = useMe()

  if (isLoading) {
    return (
      <div role="status" aria-label="Έλεγχος πρόσβασης" className="max-w-2xl mx-auto py-12 space-y-4">
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-4 w-96 mx-auto" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    )
  }

  const hasRole = user != null && allowedRoles.includes(user.role)

  if (!hasRole) {
    const isAdminOnly = allowedRoles.length === 1 && allowedRoles.includes(ROLE.ADMIN)
    if (isAdminOnly) {
      return <NoAccessAdmin loggedIn={user != null} currentUser={user} />
    }
    return <NoAccessHelper loggedIn={user != null} currentUser={user} />
  }

  return children
}

export default RequireRole
