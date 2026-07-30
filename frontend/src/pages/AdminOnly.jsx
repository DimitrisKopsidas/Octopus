// Mock Admin-Only page. Route: /admin-only
// Restricted exclusively to users with role === 'ADMIN'.
import { useMe } from '../hooks/queries'

function AdminOnly() {
  const { user } = useMe()

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-3xl mb-4">
          👑
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Admin Page
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
          Αυτή είναι η δοκιμαστική σελίδα διαχειριστή. Έχεις πρόσβαση επειδή ο λογαριασμός σου (<span className="font-semibold">@{user?.username}</span>) έχει ρόλο <span className="font-bold text-amber-600 dark:text-amber-400">ADMIN</span>.
        </p>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-left text-xs font-mono">
          <div className="text-slate-400 font-sans text-xs uppercase font-medium mb-2">RBAC State Check</div>
          <div>User ID: {user?.id}</div>
          <div>Role: {user?.role}</div>
          <div>Active: {String(user?.active)}</div>
        </div>
      </div>
    </div>
  )
}

export default AdminOnly
