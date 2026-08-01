import { useState, useEffect } from 'react'
import { useCrashLogs, useResolveCrashLog } from '../../hooks/queries'
import Skeleton from '../ui/Skeleton'
import ErrorState from '../ui/ErrorState'
import t from '../../content/crashLogs.json'

const DATE_RANGE_OPTIONS = [
  { value: '', label: 'Όλες οι ημερομηνίες' },
  { value: 'TODAY', label: 'Σήμερα (Τελευταίες 24h)' },
  { value: 'WEEK', label: 'Τελευταία Εβδομάδα (7 ημέρες)' },
  { value: 'MONTH', label: 'Τελευταίος Μήνας (30 ημέρες)' },
]

const RESOLVED_OPTIONS = [
  { value: '', label: 'Όλη η κατάσταση' },
  { value: 'false', label: '⚠️ Εκκρεμή (Unresolved)' },
  { value: 'true', label: '✓ Επιλυμένα (Resolved)' },
]

const SIZE_OPTIONS = [10, 15, 25, 50]

export default function CrashLogsViewer() {
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(15)
  const [exceptionQuery, setExceptionQuery] = useState('')
  const [selectedResolved, setSelectedResolved] = useState('')
  const [selectedDateRange, setSelectedDateRange] = useState('')
  const [selectedLog, setSelectedLog] = useState(null)

  const resolveMutation = useResolveCrashLog()

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
    ...(exceptionQuery.trim() ? { exceptionClass: exceptionQuery.trim() } : {}),
    ...(selectedResolved !== '' ? { resolved: selectedResolved === 'true' } : {}),
    ...(selectedDateRange ? { dateRange: selectedDateRange } : {}),
  }

  const { logs, page: currentPage, totalPages, totalElements, isPending, isFetching, error, refetch } = useCrashLogs(queryParams)

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

  const handleToggleResolve = async (log, e) => {
    if (e) e.stopPropagation()
    const newStatus = !log.resolved
    await resolveMutation.mutateAsync({ id: log.id, resolved: newStatus })
    if (selectedLog && selectedLog.id === log.id) {
      setSelectedLog({ ...selectedLog, resolved: newStatus })
    }
  }

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl rounded-2xl p-6 mb-8 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center text-sm shadow-sm">
              💥
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
            Αναζήτηση Exception
          </label>
          <input
            type="text"
            value={exceptionQuery}
            onChange={(e) => {
              setExceptionQuery(e.target.value)
              setPage(0)
            }}
            placeholder="π.χ. NullPointerException..."
            className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            Κατάσταση Επίλυσης
          </label>
          <div className="relative">
            <select
              value={selectedResolved}
              onChange={(e) => {
                setSelectedResolved(e.target.value)
                setPage(0)
              }}
              className="w-full appearance-none pl-3.5 pr-9 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
            >
              {RESOLVED_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
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
              className="w-full appearance-none pl-3.5 pr-9 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
            >
              {DATE_RANGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
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
              className="w-full appearance-none pl-3.5 pr-9 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
            >
              {SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
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
                <th className="px-4 py-3">{t.table.headers.exception}</th>
                <th className="px-4 py-3">{t.table.headers.request}</th>
                <th className="px-4 py-3">{t.table.headers.status}</th>
                <th className="px-4 py-3">{t.table.headers.resolved}</th>
                <th className="px-4 py-3 text-right">{t.table.headers.actions}</th>
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
                    <td className="px-4 py-3 max-w-xs truncate">
                      <div className="font-bold text-rose-600 dark:text-rose-400 truncate">
                        {log.exceptionClass?.split('.').pop()}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {log.message || '—'}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px]">
                      <span className="font-bold text-slate-900 dark:text-slate-200 mr-1.5">{log.httpMethod}</span>
                      <span className="text-slate-500 dark:text-slate-400">{log.requestUri}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        {log.statusCode || 500}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={(e) => handleToggleResolve(log, e)}
                        disabled={resolveMutation.isPending}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                          log.resolved
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                        }`}
                      >
                        {log.resolved ? '✓ Επιλύθηκε' : '⚠️ Εκκρεμεί'}
                      </button>
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

      {/* Detail Modal with Stack Trace Code View & Resolve Toggle */}
      {selectedLog && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedLog(null)
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] flex flex-col animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 shrink-0">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>💥</span>
                <span>{t.modal.title}</span>
              </h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg leading-none p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 overflow-y-auto pr-1">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div>
                  <div className="font-bold text-rose-600 dark:text-rose-400 text-sm">{selectedLog.exceptionClass}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{selectedLog.message}</div>
                </div>
                <button
                  onClick={(e) => handleToggleResolve(selectedLog, e)}
                  disabled={resolveMutation.isPending}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedLog.resolved
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'
                      : 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700'
                  }`}
                >
                  {selectedLog.resolved ? t.modal.markUnresolved : t.modal.markResolved}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div><strong className="text-slate-900 dark:text-slate-100">ID:</strong> {selectedLog.id}</div>
                <div><strong className="text-slate-900 dark:text-slate-100">Ημερομηνία:</strong> {formatTimestamp(selectedLog.timestamp)}</div>
                <div><strong className="text-slate-900 dark:text-slate-100">Request:</strong> {selectedLog.httpMethod} {selectedLog.requestUri}</div>
                <div><strong className="text-slate-900 dark:text-slate-100">Status Code:</strong> {selectedLog.statusCode || 500}</div>
                <div><strong className="text-slate-900 dark:text-slate-100">Actor Username:</strong> {selectedLog.actorUsername || '—'}</div>
                <div><strong className="text-slate-900 dark:text-slate-100">IP Address:</strong> {selectedLog.ipAddress || '—'}</div>
              </div>

              <div>
                <strong className="text-slate-900 dark:text-slate-100">User Agent:</strong>
                <div className="font-mono text-[11px] break-all mt-0.5 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  {selectedLog.userAgent || '—'}
                </div>
              </div>

              <div>
                <strong className="text-slate-900 dark:text-slate-100">Stack Trace:</strong>
                <pre className="font-mono text-[11px] whitespace-pre-wrap break-all mt-1 p-3 bg-slate-950 text-rose-300 rounded-xl max-h-60 overflow-y-auto shadow-inner border border-slate-800">
                  {selectedLog.stackTrace || 'Δεν υπάρχει διαθέσιμο stack trace.'}
                </pre>
              </div>
            </div>

            <div className="pt-2 text-right shrink-0">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {t.modal.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
