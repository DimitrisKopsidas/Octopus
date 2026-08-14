import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useAuditLogs } from '../../hooks/queries'
import Skeleton from '../ui/Skeleton'
import ErrorState from '../ui/ErrorState'
import t from '../../content/auditLogs.json'

// The browser draws the open <option> list itself and lets it inherit the
// closed select's colours. Pinning each option to a plain surface stops that.
const OPTION_CLASS = 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium'

const ACTION_OPTIONS = [
  { value: '', label: 'Όλες οι ενέργειες' },
  { value: 'USER_LOGIN_SUCCESS', label: 'USER_LOGIN_SUCCESS' },
  { value: 'USER_LOGIN_FAILED', label: 'USER_LOGIN_FAILED' },
  { value: 'USER_LOGOUT', label: 'USER_LOGOUT' },
  { value: 'USER_REGISTERED', label: 'USER_REGISTERED' },
  { value: 'USER_REGISTER_FAILED', label: 'USER_REGISTER_FAILED' },
  { value: 'USER_ROLE_CHANGED', label: 'USER_ROLE_CHANGED' },
  { value: 'USER_DEACTIVATED', label: 'USER_DEACTIVATED' },
  { value: 'INVITE_CODE_GENERATED', label: 'INVITE_CODE_GENERATED' },
  { value: 'INVITE_CODE_DELETED', label: 'INVITE_CODE_DELETED' },
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

  // Body scroll lock & ESC key handling for detail modal
  useEffect(() => {
    if (selectedLog) {
      document.body.classList.add('overflow-hidden')
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setSelectedLog(null)
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        document.body.classList.remove('overflow-hidden')
        window.removeEventListener('keydown', handleKeyDown)
      }
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  }, [selectedLog])

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
            {t.title}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {t.subtitle} ({totalElements} εγγραφές)
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
          {t.refresh}
        </button>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            Τύπος Ενέργειας (Action)
          </label>
          <div className="relative">
            <select
              value={selectedAction}
              onChange={(e) => {
                setSelectedAction(e.target.value)
                setPage(0)
              }}
              className="w-full appearance-none pl-3.5 pr-9 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              {ACTION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className={OPTION_CLASS}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            Status
          </label>
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value)
                setPage(0)
              }}
              className="w-full appearance-none pl-3.5 pr-9 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className={OPTION_CLASS}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            Χρονικό Εύρος
          </label>
          <div className="relative">
            <select
              value={selectedDateRange}
              onChange={(e) => {
                setSelectedDateRange(e.target.value)
                setPage(0)
              }}
              className="w-full appearance-none pl-3.5 pr-9 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              {DATE_RANGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className={OPTION_CLASS}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            Εγγραφές ανά σελίδα
          </label>
          <div className="relative">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setPage(0)
              }}
              className="w-full appearance-none pl-3.5 pr-9 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              {SIZE_OPTIONS.map((size) => (
                <option key={size} value={size} className={OPTION_CLASS}>
                  {size} εγγραφές
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && <ErrorState message={error} onRetry={refetch} retryLabel={t.refresh} />}

      {/* Loading state */}
      {isPending && (
        <div className="space-y-3 py-4">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      )}

      {/* Logs Table */}
      {!isPending && !error && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase text-[10px] tracking-wider text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">{t.table.headers.timestamp}</th>
                <th className="px-4 py-3">{t.table.headers.action}</th>
                <th className="px-4 py-3">{t.table.headers.actor}</th>
                <th className="px-4 py-3">{t.table.headers.status}</th>
                <th className="px-4 py-3">{t.table.headers.ip}</th>
                <th className="px-4 py-3 text-right">{t.table.headers.details}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                    {t.table.empty}
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getActionBadgeColor(log.action, log.status)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-semibold text-slate-900 dark:text-slate-100">
                      @{log.actorUsername || 'system'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${log.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600'}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      {log.ipAddress || '—'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[11px] transition-colors"
                      >
                        {t.table.viewDetails}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      {!isPending && !error && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 text-xs text-slate-500 dark:text-slate-400">
          <span>
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

      {/* Detail Modal with Backdrop Lock & Esc Dismiss.
          Rendered into document.body: inside the page tree any ancestor with a
          transform or filter would make `fixed` resolve against that ancestor
          instead of the viewport, and the modal drifted with the scroll. */}
      {selectedLog && createPortal(
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedLog(null)
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 animate-reveal">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>📜</span>
                <span>{t.modal.title}</span>
              </h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg leading-none p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
                className="px-4 py-2 text-xs font-semibold bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors shadow-md shadow-brand-600/20"
              >
                {t.modal.close}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
