import { useState } from 'react'
import { useUsersList, useUpdateUserRole, useToggleUserStatus, useMe } from '../../hooks/queries'
import { toast } from '../../store/toastStore'
import t from '../../content/usersManagement.json'

// The browser draws the open <option> list itself and lets it inherit the
// closed select's colours — which is how the role pill's amber turned the whole
// menu muddy. Pinning each option to a plain surface stops that. The highlight
// on the hovered row belongs to the OS and cannot be restyled.
const OPTION_CLASS = 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium'

export default function UserManagementViewer() {
  const { user: me } = useMe()
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)

  const params = {
    page,
    size: 15,
    ...(roleFilter ? { role: roleFilter } : {}),
    ...(statusFilter !== '' ? { active: statusFilter === 'active' } : {}),
    ...(query.trim() ? { query: query.trim() } : {}),
  }

  const { users, totalPages, totalElements, isPending, isFetching, error, refetch } = useUsersList(params)
  const updateRoleMutation = useUpdateUserRole()
  const toggleStatusMutation = useToggleUserStatus()

  async function handleRoleChange(userId, username, newRole) {
    if (userId === me?.id) {
      if (!window.confirm('Προσοχή: Αλλάζετε τον δικό σας ρόλο! Είστε σίγουροι;')) return
    }
    try {
      await updateRoleMutation.mutateAsync({ userId, role: newRole })
      toast.success(t.toast.roleUpdated)
    } catch (err) {
      toast.error('Σφάλμα ενημέρωσης ρόλου')
    }
  }

  async function handleStatusToggle(userId, username, currentActive) {
    const nextActive = !currentActive
    if (userId === me?.id && !nextActive) {
      toast.error('Δεν μπορείτε να απενεργοποιήσετε τον δικό σας λογαριασμό!')
      return
    }
    const message = nextActive
      ? `Επανενεργοποίηση του λογαριασμού @${username};`
      : `Απενεργοποίηση του λογαριασμού @${username}; Ο χρήστης δεν θα μπορεί να συνδεθεί.`

    if (!window.confirm(message)) return

    try {
      await toggleStatusMutation.mutateAsync({ userId, active: nextActive })
      toast.success(t.toast.statusUpdated)
    } catch (err) {
      toast.error('Σφάλμα ενημέρωσης κατάστασης')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <span>👥</span> {t.title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Role Filter */}
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value)
                setPage(0)
              }}
              className="appearance-none pl-3.5 pr-9 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              <option value="" className={OPTION_CLASS}>{t.actions.filterRole}</option>
              <option value="STUDENT" className={OPTION_CLASS}>🎓 STUDENT</option>
              <option value="HELPER" className={OPTION_CLASS}>🛠 HELPER</option>
              <option value="ADMIN" className={OPTION_CLASS}>👑 ADMIN</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(0)
              }}
              className="appearance-none pl-3.5 pr-9 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              <option value="" className={OPTION_CLASS}>{t.actions.filterStatus}</option>
              <option value="active" className={OPTION_CLASS}>🟢 {t.actions.active}</option>
              <option value="inactive" className={OPTION_CLASS}>🔴 {t.actions.inactive}</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Search Query */}
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(0)
              }}
              placeholder={t.actions.search}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Σύνολο: {totalElements}
          </span>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Aνανέωση"
          >
            <svg className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {isPending ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            <svg className="w-8 h-8 animate-spin mx-auto mb-3 text-brand-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Φόρτωση χρηστών...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-600 dark:text-rose-400">{error}</div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            <div className="text-4xl mb-2">👥</div>
            <p className="font-medium text-base text-slate-700 dark:text-slate-300">{t.table.empty}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="px-5 py-3.5">{t.table.username}</th>
                  <th className="px-5 py-3.5">{t.table.displayName}</th>
                  <th className="px-5 py-3.5">{t.table.role}</th>
                  <th className="px-5 py-3.5">{t.table.year}</th>
                  <th className="px-5 py-3.5">{t.table.status}</th>
                  <th className="px-5 py-3.5 text-right">{t.table.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {users.map((u) => {
                  const isCurrentLoggedUser = u.id === me?.id
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-5 py-4 font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        @{u.username} {isCurrentLoggedUser && <span className="text-xs text-brand-600 dark:text-brand-400 font-normal">(Εσείς)</span>}
                      </td>
                      <td className="px-5 py-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {u.displayName || '-'}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {/* Interactive Role Dropdown */}
                        <div className="relative inline-block">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, u.username, e.target.value)}
                            disabled={updateRoleMutation.isPending}
                            className={`appearance-none w-full min-w-[8.5rem] pl-3 pr-8 py-1.5 rounded-lg text-xs font-bold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all ${
                              u.role === 'ADMIN'
                                ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900'
                                : u.role === 'HELPER'
                                ? 'bg-brand-100 text-brand-900 border-brand-300 dark:bg-brand-950/60 dark:text-brand-300 dark:border-brand-900'
                                : 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                            }`}
                          >
                            <option value="STUDENT" className={OPTION_CLASS}>🎓 STUDENT</option>
                            <option value="HELPER" className={OPTION_CLASS}>🛠 HELPER</option>
                            <option value="ADMIN" className={OPTION_CLASS}>👑 ADMIN</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-500 dark:text-slate-400">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-600 dark:text-slate-400 text-xs whitespace-nowrap font-medium">
                        {u.year ? (u.year === 5 ? '5ο+ Έτος' : `${u.year}ο Έτος`) : '-'}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          u.active
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {u.active ? 'Ενεργός' : 'Απενεργοποιημένος'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleStatusToggle(u.id, u.username, u.active)}
                          disabled={toggleStatusMutation.isPending || isCurrentLoggedUser}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-40 ${
                            u.active
                              ? 'bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                              : 'bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                          }`}
                        >
                          {u.active ? '🚫 Απενεργοποίηση' : '✅ Ενεργοποίηση'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Σελίδα {page + 1} από {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Προηγούμενη
              </button>
              <button
                type="button"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Επόμενη
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
