import { useState } from 'react'
import { Users, ChevronDown, Search, RotateCw, Loader2 } from 'lucide-react'
import { useUsersList, useUpdateUserRole, useToggleUserStatus } from '../../hooks/queries'
import { toast } from '../../store/toastStore'
import { formatEnrollmentYear } from '../../lib/years'
import t from '../../content/usersManagement.json'

// The browser draws the open <option> list itself and lets it inherit the
// closed select's colours. Pinning each option to a plain surface stops that.
const OPTION_CLASS = 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium'

export default function UserManagementViewer() {
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)

  const size = 15
  const params = {
    page,
    size,
    ...(roleFilter ? { role: roleFilter } : {}),
    ...(statusFilter !== '' ? { active: statusFilter === 'active' } : {}),
    ...(query.trim() ? { query: query.trim() } : {}),
  }

  const { users, totalPages, totalElements, isPending, isFetching, error, refetch } = useUsersList(params)
  const updateRoleMutation = useUpdateUserRole()
  const toggleStatusMutation = useToggleUserStatus()

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateRoleMutation.mutateAsync({ userId, role: newRole })
      toast.success(t.toast.roleUpdated)
    } catch (err) {
      toast.error(err?.response?.data?.message || t.toast.roleUpdateFailed)
    }
  }

  const handleStatusToggle = async (userId, currentActive) => {
    try {
      await toggleStatusMutation.mutateAsync({ userId, active: !currentActive })
      toast.success(t.toast.statusUpdated)
    } catch (err) {
      toast.error(err?.response?.data?.message || t.toast.statusUpdateFailed)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Users className="w-6 h-6 text-blue-500" /> {t.title}
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
              <ChevronDown className="w-4 h-4" />
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
              <ChevronDown className="w-4 h-4" />
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
              <Search className="w-4 h-4" />
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
            <RotateCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {isPending ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-brand-600" />
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
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="px-5 py-3.5">Χρήστης</th>
                  <th className="px-5 py-3.5">Email</th>
                  <th className="px-5 py-3.5">Ρόλος</th>
                  <th className="px-5 py-3.5">Έτος</th>
                  <th className="px-5 py-3.5">Κατάσταση</th>
                  <th className="px-5 py-3.5 text-right">Ενέργειες</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 font-bold text-xs flex items-center justify-center shrink-0">
                          {u.username.slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">{u.displayName || u.username}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">@{u.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-400 text-xs">
                      {u.email || '-'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="relative inline-block">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          disabled={updateRoleMutation.isPending}
                          className={`appearance-none pl-2.5 pr-7 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
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
                          <ChevronDown className="w-3 h-3" />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-400 text-xs whitespace-nowrap font-medium">
                      {formatEnrollmentYear(u.year) ?? '-'}
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
                        onClick={() => handleStatusToggle(u.id, u.active)}
                        disabled={toggleStatusMutation.isPending}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-40 cursor-pointer ${
                          u.active
                            ? 'bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                            : 'bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                        }`}
                      >
                        {u.active ? '🚫 Απενεργοποίηση' : '✅ Ενεργοποίηση'}
                      </button>
                    </td>
                  </tr>
                ))}
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
