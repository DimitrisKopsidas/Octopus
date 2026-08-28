import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Plus, ChevronDown, Search, RotateCw, Loader2, KeyRound } from 'lucide-react'
import { useInviteCodes, useGenerateInviteCode, useDeleteInviteCode } from '../../hooks/queries'
import { toast } from '../../store/toastStore'
import t from '../../content/inviteCodes.json'

// The browser draws the open <option> list itself and lets it inherit the
// closed select's colours. Pinning each option to a plain surface stops that.
const OPTION_CLASS = 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium'

function formatDateTime(isoString) {
  if (!isoString) return '-'
  const d = new Date(isoString)
  return d.toLocaleString('el-GR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function InviteCodesViewer() {
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)

  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [modalRole, setModalRole] = useState('HELPER')
  const [modalExpiresInHours, setModalExpiresInHours] = useState('72')
  const [modalMaxUses, setModalMaxUses] = useState('1')
  const [copiedId, setCopiedId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const size = 15
  const { codes, totalPages, totalElements, isPending, isFetching, error, refetch } = useInviteCodes({
    role: roleFilter || undefined,
    status: statusFilter || undefined,
    query: query.trim() || undefined,
    page,
    size,
  })

  const generateMutation = useGenerateInviteCode()
  const deleteMutation = useDeleteInviteCode()

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showGenerateModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [showGenerateModal])

  // Listen to ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showGenerateModal) {
        setShowGenerateModal(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showGenerateModal])

  const handleGenerate = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        role: modalRole,
        expiresInHours: modalExpiresInHours ? parseInt(modalExpiresInHours, 10) : undefined,
        maxUses: modalMaxUses ? parseInt(modalMaxUses, 10) : 1,
      }
      await generateMutation.mutateAsync(payload)
      toast.success(t.toast.generated)
      setShowGenerateModal(false)
      setModalExpiresInHours('72')
      setModalMaxUses('1')
    } catch (err) {
      toast.error(err.message || t.toast.generateFailed)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteMutation.mutateAsync(deleteTarget.id)
      toast.success(t.toast.deleted)
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err.message || t.toast.deleteFailed)
    }
  }

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success(t.toast.copied)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <KeyRound className="w-6 h-6 text-emerald-500" /> {t.title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.subtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowGenerateModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm shadow-md shadow-brand-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          {t.actions.generate}
        </button>
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
              <option value="available" className={OPTION_CLASS}>🟢 {t.actions.available}</option>
              <option value="used" className={OPTION_CLASS}>🔴 {t.actions.used}</option>
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
            Φόρτωση κωδικών...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-600 dark:text-rose-400">{error}</div>
        ) : codes.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            <div className="text-4xl mb-2">🔑</div>
            <p className="font-medium text-base text-slate-700 dark:text-slate-300">{t.table.empty}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="px-5 py-3.5">{t.table.code}</th>
                  <th className="px-5 py-3.5">{t.table.role}</th>
                  <th className="px-5 py-3.5">{t.table.status}</th>
                  <th className="px-5 py-3.5">{t.table.usedBy}</th>
                  <th className="px-5 py-3.5">{t.table.usedAt}</th>
                  <th className="px-5 py-3.5">{t.table.created}</th>
                  <th className="px-5 py-3.5 text-right">{t.table.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {codes.map((item) => {
                  const isUsed = item.usedAt !== null
                  return (
                    <tr key={`${item.targetRole}-${item.id}`} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-slate-900 dark:text-slate-100 tracking-wide">
                        {item.code}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                          item.targetRole === 'ADMIN'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900'
                            : 'bg-brand-100 text-brand-800 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-900'
                        }`}>
                          {item.targetRole === 'ADMIN' ? '👑 ADMIN' : '🛠 HELPER'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          isUsed
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isUsed ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                          {isUsed ? 'Εξαργυρώθηκε' : 'Διαθέσιμος'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-700 dark:text-slate-300">
                        {item.usedByUsername ? (
                          <span className="font-semibold text-brand-600 dark:text-brand-400">@{item.usedByUsername}</span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500">-</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-500 dark:text-slate-400 text-xs">
                        {formatDateTime(item.usedAt)}
                      </td>
                      <td className="px-5 py-4 text-slate-500 dark:text-slate-400 text-xs">
                        {formatDateTime(item.created)}
                      </td>
                      <td className="px-5 py-4 text-right space-x-1 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleCopy(item.code)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                          title="Αντιγραφή κωδικού"
                        >
                          📋 Αντιγραφή
                        </button>
                        {!isUsed && (
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 transition-colors"
                            title="Διαγραφή κωδικού"
                          >
                            🗑 Διαγραφή
                          </button>
                        )}
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

      {/* Generate Code Modal. Rendered into document.body so `fixed` resolves
          against the viewport rather than any transformed ancestor. */}
      {showGenerateModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowGenerateModal(false)}
          />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl max-w-md w-full max-h-[85vh] overflow-y-auto z-10 space-y-4 animate-reveal">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>🔑</span> {t.modal.title}
              </h3>
              <button
                type="button"
                onClick={() => setShowGenerateModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2">
                  {t.modal.roleLabel}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setModalRole('HELPER')}
                    className={`py-2.5 px-3 rounded-xl border-2 font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                      modalRole === 'HELPER'
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    🛠 HELPER
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalRole('ADMIN')}
                    className={`py-2.5 px-3 rounded-xl border-2 font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                      modalRole === 'ADMIN'
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    👑 ADMIN
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  {t.modal.customCodeLabel}
                </label>
                <input
                  type="text"
                  value={modalCustomCode}
                  onChange={(e) => setModalCustomCode(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))}
                  placeholder={modalRole === 'ADMIN' ? 'π.χ. ADM-CUSTOM1' : 'π.χ. HLP-CUSTOM1'}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all uppercase"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                  {t.modal.customCodeHint}
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {t.modal.cancel}
                </button>
                <button
                  type="submit"
                  disabled={generateMutation.isPending}
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-600/20 transition-all disabled:opacity-50"
                >
                  {generateMutation.isPending ? t.modal.submitting : t.modal.submit}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
