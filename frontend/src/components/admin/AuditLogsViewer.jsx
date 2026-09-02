import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { ScrollText, RotateCw, ChevronDown, X, ExternalLink } from 'lucide-react'
import { useAuditLogs } from '../../hooks/queries'
import useBodyScrollLock from '../../hooks/useBodyScrollLock'
import {
  AUDIT_ACTIONS,
  auditActionLabel,
  auditActionClass,
  resourceLabel,
  resourceHref,
} from '../../lib/auditActions'
import Skeleton from '../ui/Skeleton'
import ErrorState from '../ui/ErrorState'
import t from '../../content/auditLogs.json'

// The browser draws the open <option> list itself and lets it inherit the
// closed select's colours. Pinning each option to a plain surface stops that.
const OPTION_CLASS = 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium'

// Χτίζεται από το κοινό AUDIT_ACTIONS: πριν ήταν χειρόγραφη λίστα που είχε
// ήδη ξεμείνει από το enum του backend (έλειπε το USER_UPDATED).
const ACTION_OPTIONS = [
  { value: '', label: 'Όλες οι ενέργειες' },
  ...AUDIT_ACTIONS.map((action) => ({ value: action.value, label: action.label })),
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

  // Το κλείδωμα του scroll ζει πλέον σε κοινό hook, ώστε ο πίνακας από πίσω να
  // μένει ακίνητος με τον ίδιο τρόπο σε κάθε modal της διαχείρισης.
  useBodyScrollLock(Boolean(selectedLog))

  useEffect(() => {
    if (!selectedLog) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedLog(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
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


  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl rounded-2xl p-6 mb-8 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-900/60 text-brand-600 dark:text-brand-400 flex items-center justify-center text-sm shadow-sm">
              <ScrollText className="w-4 h-4" />
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
          <RotateCw className={`w-3.5 h-3.5 mr-1.5 ${isFetching ? 'animate-spin' : ''}`} />
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
              <ChevronDown className="w-3.5 h-3.5" />
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
              <ChevronDown className="w-3.5 h-3.5" />
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
              <ChevronDown className="w-3.5 h-3.5" />
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
              <ChevronDown className="w-3.5 h-3.5" />
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
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${auditActionClass(log.action, log.status)}`}
                        title={log.action}
                      >
                        {auditActionLabel(log.action)}
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

      {/* Modal λεπτομερειών. Μπαίνει στο document.body: μέσα στο δέντρο της
          σελίδας, οποιοσδήποτε πρόγονος με transform ή filter κάνει το `fixed`
          να μετράει ως προς εκείνον αντί για το viewport, και το modal
          ταξίδευε μαζί με το scroll. */}
      {selectedLog && createPortal(
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedLog(null)
          }}
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto bg-slate-950/70 backdrop-blur-md animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-labelledby="audit-detail-title"
        >
          <div className="relative w-full max-w-2xl my-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-h-[calc(100vh-4rem)] flex flex-col animate-reveal overflow-hidden">
            <header className="flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <div className="min-w-0">
                <h3 id="audit-detail-title" className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {auditActionLabel(selectedLog.action)}
                </h3>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-mono">{selectedLog.action}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{formatTimestamp(selectedLog.timestamp)}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                aria-label={t.modal.close}
                className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto scrollbar-custom px-6 py-5 space-y-5">
              {/* Τι έγινε -- η μία γραμμή που απαντά στην ερώτηση χωρίς σκρολάρισμα */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {t.modal.whatHappened}
                </p>
                <p className="mt-1.5 text-sm text-slate-800 dark:text-slate-200 leading-relaxed break-words">
                  {selectedLog.details || t.modal.noDetails}
                </p>
              </div>

              <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                <DetailField label={t.modal.fields.actor}>
                  <span className="font-semibold">@{selectedLog.actorUsername || 'system'}</span>
                  {selectedLog.actorId && (
                    <span className="block font-mono text-[10px] text-slate-400 dark:text-slate-500 break-all mt-0.5">
                      {selectedLog.actorId}
                    </span>
                  )}
                </DetailField>

                <DetailField label={t.modal.fields.resource}>
                  <ResourceValue
                    resourceType={selectedLog.resourceType}
                    resourceId={selectedLog.resourceId}
                    onNavigate={() => setSelectedLog(null)}
                  />
                </DetailField>

                <DetailField label={t.modal.fields.status}>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedLog.status === 'SUCCESS'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {selectedLog.status}
                  </span>
                </DetailField>

                <DetailField label={t.modal.fields.ip}>
                  <span className="font-mono">{selectedLog.ipAddress || '—'}</span>
                </DetailField>
              </dl>

              <DetailField label={t.modal.fields.userAgent}>
                <span className="font-mono text-[11px] block break-all p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  {selectedLog.userAgent || '—'}
                </span>
              </DetailField>

              <DetailField label={t.modal.fields.id}>
                <span className="font-mono text-[10px] break-all text-slate-400 dark:text-slate-500">
                  {selectedLog.id}
                </span>
              </DetailField>
            </div>

            <footer className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 text-right shrink-0">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 text-xs font-semibold bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors shadow-md shadow-brand-600/20"
              >
                {t.modal.close}
              </button>
            </footer>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

/** Μία σειρά ετικέτα/τιμή στο modal λεπτομερειών. */
function DetailField({ label, children }) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </dt>
      <dd className="mt-1 text-xs text-slate-700 dark:text-slate-300 break-words">{children}</dd>
    </div>
  )
}

/**
 * Ο πόρος στον οποίο αναφέρεται το log. Γίνεται σύνδεσμος μόνο όταν υπάρχει
 * σελίδα να δείξει -- ένα link που βγάζει 404 είναι χειρότερο από απλό κείμενο.
 */
function ResourceValue({ resourceType, resourceId, onNavigate }) {
  if (!resourceType && !resourceId) return <span>—</span>

  const label = resourceLabel(resourceType)
  const href = resourceHref(resourceType, resourceId)
  const text = resourceId ? `${label} #${resourceId}` : label

  if (!href) {
    return <span className="font-semibold">{text}</span>
  }

  return (
    <Link
      to={href}
      onClick={onNavigate}
      className="inline-flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-400 hover:underline"
    >
      {text}
      <ExternalLink className="w-3 h-3" />
    </Link>
  )
}
