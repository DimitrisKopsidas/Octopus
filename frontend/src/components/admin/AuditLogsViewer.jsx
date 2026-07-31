import { useState } from 'react'
import { useAuditLogs } from '../../hooks/queries'
import Skeleton from '../ui/Skeleton'
import ErrorState from '../ui/ErrorState'

const ACTION_OPTIONS = [
  { value: '', label: 'Όλες οι ενέργειες' },
  { value: 'USER_LOGIN_SUCCESS', label: 'USER_LOGIN_SUCCESS' },
  { value: 'USER_LOGIN_FAILED', label: 'USER_LOGIN_FAILED' },
  { value: 'USER_LOGOUT', label: 'USER_LOGOUT' },
  { value: 'USER_REGISTERED', label: 'USER_REGISTERED' },
  { value: 'USER_DEACTIVATED', label: 'USER_DEACTIVATED' },
  { value: 'TOKEN_REFRESHED', label: 'TOKEN_REFRESHED' },
  { value: 'COURSE_UPDATED', label: 'COURSE_UPDATED' },
  { value: 'QUESTION_CREATED', label: 'QUESTION_CREATED' },
  { value: 'QUESTION_UPDATED', label: 'QUESTION_UPDATED' },
  { value: 'QUESTION_DEACTIVATED', label: 'QUESTION_DEACTIVATED' },
  { value: 'QUESTION_IMAGE_UPLOADED', label: 'QUESTION_IMAGE_UPLOADED' },
  { value: 'QUESTION_IMAGE_DELETED', label: 'QUESTION_IMAGE_DELETED' },
  { value: 'BUNDLE_CREATED', label: 'BUNDLE_CREATED' },
  { value: 'CLIENT_AUDIT_EVENT', label: 'CLIENT_AUDIT_EVENT' },
]

const STATUS_OPTIONS = [
  { value: '', label: 'Όλα τα Status' },
  { value: 'SUCCESS', label: 'SUCCESS (Επιτυχίες)' },
  { value: 'FAILURE', label: 'FAILURE (Αποτυχίες)' },
]

const DATE_RANGE_OPTIONS = [
  { value: '', label: 'Όλες οι ημερομηνίες' },
  { value: 'TODAY', label: 'Σήμερα (Τελευταίες 24h)' },
  { value: 'WEEK', label: 'Τελευταία Εβδομάδα (7 ημέρες)' },
  { value: 'MONTH', label: 'Τελευταίος Μήνας (30 ημέρες)' },
  { value: 'YEAR', label: 'Τελευταίο Έτος (365 ημέρες)' },
]

const SIZE_OPTIONS = [10, 15, 25, 50]

export default function AuditLogsViewer() {
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(15)
  const [selectedAction, setSelectedAction] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedDateRange, setSelectedDateRange] = useState('')
  const [selectedLog, setSelectedLog] = useState(null)

  const queryParams = {
    page,
    size: pageSize,
    sort: 'timestamp,desc',
    ...(selectedAction ? { action: selectedAction } : {}),
    ...(selectedStatus ? { status: selectedStatus } : {}),
    ...(selectedDateRange ? { dateRange: selectedDateRange } : {}),
  }

  const { logs, page: currentPage, totalPages, totalElements, isPending, isFetching, error, refetch } = useAuditLogs(queryParams)

  const formatTimestamp = (ts) => {
    if (!ts) return '-'
    return new Date(ts).toLocaleString('el-GR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const getActionBadgeColor = (action, status) => {
    if (status === 'FAILURE' || action?.includes('DEACTIVATED') || action?.includes('FAILED')) {
      return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
    }
    if (action?.includes('LOGIN') || action?.includes('REGISTERED')) {
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    }
    if (action?.includes('UPDATED') || action?.includes('UPLOADED')) {
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    }
    return 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20'
  }

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl rounded-2xl p-6 mb-8 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-900/60 text-brand-600 dark:text-brand-400 flex items-center justify-center text-sm shadow-sm">
              📜
            </span>
            Audit Logs System Trail
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Πλήρες αρχείο ενεργειών, συνδέσεων και μεταβολών στο σύστημα ({totalElements} εγγραφές)
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          <svg className={`w-3.5 h-3.5 mr-1.5 ${isFetching ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Ανανέωση
        </button>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            Τύπος Ενέργειας (Action)
          </label>
          <select
            value={selectedAction}
            onChange={(e) => {
              setSelectedAction(e.target.value)
              setPage(0)
            }}
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {ACTION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            Κατάσταση (Status)
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value)
              setPage(0)
            }}
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            Χρονικό Διάστημα (Date Range)
          </label>
          <select
            value={selectedDateRange}
            onChange={(e) => {
              setSelectedDateRange(e.target.value)
              setPage(0)
            }}
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {DATE_RANGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            Εγγραφές ανά σελίδα
          </label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setPage(0)
            }}
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {SIZE_OPTIONS.map((sz) => (
              <option key={sz} value={sz}>
                {sz} ανά σελίδα
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading state */}
      {isPending && (
        <div className="space-y-3 py-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-xl" />
          ))}
        </div>
      )}

      {/* Error state */}
      {error && !isPending && (
        <ErrorState message={error} onRetry={() => refetch()} retryLabel="Δοκίμασε ξανά" />
      )}

      {/* Empty state */}
      {!isPending && !error && logs.length === 0 && (
        <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Δεν βρέθηκαν audit logs για τα επιλεγμένα φίλτρα.
          </p>
        </div>
      )}

      {/* Table */}
      {!isPending && !error && logs.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Ημερομηνία</th>
                <th className="py-3 px-4">Ενέργεια</th>
                <th className="py-3 px-4">Χρήστης (Actor)</th>
                <th className="py-3 px-4">Πόρος (Resource)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4 text-right">Λεπτομέρειες</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {formatTimestamp(log.timestamp)}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getActionBadgeColor(log.action, log.status)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                    {log.actorUsername || (log.actorId ? log.actorId.substring(0, 8) + '…' : '—')}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                    {log.resourceType ? `${log.resourceType} ${log.resourceId ? `#${log.resourceId}` : ''}` : '—'}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${log.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {log.ipAddress || '—'}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="text-brand-600 dark:text-brand-400 hover:underline font-medium"
                    >
                      Προβολή
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {!isPending && !error && totalPages > 1 && (
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            Σελίδα {currentPage + 1} από {totalPages} (Σύνολο {totalElements} εγγραφές)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0 || isFetching}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Προηγούμενο
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1 || isFetching}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Επόμενο
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Λεπτομέρειες Audit Log
              </h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div><strong className="text-slate-900 dark:text-slate-100">ID:</strong> {selectedLog.id}</div>
              <div><strong className="text-slate-900 dark:text-slate-100">Ημερομηνία:</strong> {formatTimestamp(selectedLog.timestamp)}</div>
              <div><strong className="text-slate-900 dark:text-slate-100">Ενέργεια:</strong> {selectedLog.action}</div>
              <div><strong className="text-slate-900 dark:text-slate-100">Actor Username:</strong> {selectedLog.actorUsername || '—'}</div>
              <div><strong className="text-slate-900 dark:text-slate-100">Actor ID:</strong> {selectedLog.actorId || '—'}</div>
              <div><strong className="text-slate-900 dark:text-slate-100">Resource:</strong> {selectedLog.resourceType} #{selectedLog.resourceId}</div>
              <div><strong className="text-slate-900 dark:text-slate-100">Status:</strong> {selectedLog.status}</div>
              <div><strong className="text-slate-900 dark:text-slate-100">IP:</strong> {selectedLog.ipAddress || '—'}</div>
              <div><strong className="text-slate-900 dark:text-slate-100">User Agent:</strong> <span className="font-mono text-[11px] block break-all mt-0.5 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">{selectedLog.userAgent || '—'}</span></div>
              <div>
                <strong className="text-slate-900 dark:text-slate-100">Details:</strong>
                <pre className="font-mono text-[11px] whitespace-pre-wrap break-all mt-1 p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-800 dark:text-slate-200 max-h-40 overflow-y-auto">
                  {selectedLog.details || 'Δεν υπάρχουν επιπλέον λεπτομέρειες'}
                </pre>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 text-xs font-semibold bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors"
              >
                Κλείσιμο
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
