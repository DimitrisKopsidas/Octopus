// JSON bulk import for one course. Used by the AdminCourse modal.
import { useState } from 'react'
import {
  Check,
  CheckCircle2,
  Loader2,
  AlertCircle,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react'
import { useImportQuestions } from '../../hooks/queries'
import { extractErrorMessage } from '../../lib/api'
import { toast } from '../../store/toastStore'
import t from '../../content/adminCourse.json'

// The request is usually faster than the eye. Holding the progress state for a
// beat stops it flashing past as a glitch, and gives the result something to
// arrive from.
const MIN_VISIBLE_MS = 900

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// One shape covers both kinds of question. There is no "type" to declare: a
// true/false question is simply one with two answers titled Σωστό and Λάθος,
// which is exactly how the editor stores them.
const SAMPLE = `[
  {
    "title": "Τι σημαίνει το ακρωνύμιο JVM;",
    "answers": [
      { "title": "Java Virtual Machine", "isCorrect": true },
      { "title": "Java Version Manager", "isCorrect": false },
      { "title": "Just In Time Virtual Memory", "isCorrect": false }
    ]
  },
  {
    "title": "Η Java είναι interpreted γλώσσα.",
    "answers": [
      { "title": "Σωστό", "isCorrect": false },
      { "title": "Λάθος", "isCorrect": true }
    ]
  }
]`

// Accepts either a bare array or { "questions": [...] }, since both are things
// people reasonably write by hand.
function parseQuestions(raw) {
  const parsed = JSON.parse(raw)
  const list = Array.isArray(parsed) ? parsed : parsed?.questions

  if (!Array.isArray(list)) {
    throw new Error(t.import.errors.notAnArray)
  }
  if (list.length === 0) {
    throw new Error(t.import.errors.empty)
  }
  return list
}

function QuestionImportForm({ courseId, onImported, onCancel }) {
  const [raw, setRaw] = useState('')
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState(null)
  const [showSample, setShowSample] = useState(false)
  // 'idle' -> 'loading' -> 'done'. Kept separately from the mutation so the
  // progress state can outlive the request by MIN_VISIBLE_MS.
  const [phase, setPhase] = useState('idle')
  const [result, setResult] = useState(null)

  const importMutation = useImportQuestions(courseId)

  // Parsed eagerly so the button can show the count before anything is sent.
  let parsed = null
  let parseError = null
  if (raw.trim()) {
    try {
      parsed = parseQuestions(raw)
    } catch (err) {
      parseError = err instanceof SyntaxError ? t.import.errors.invalidJson : err.message
    }
  }

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setError(null)
    setRaw(await file.text())
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!parsed) return

    setError(null)
    setPhase('loading')

    // Racing the request against a fixed floor is simpler than measuring
    // elapsed time, and allSettled keeps the floor on the failure path too.
    const [outcome] = await Promise.allSettled([
      importMutation.mutateAsync({ questions: parsed }),
      sleep(MIN_VISIBLE_MS),
    ])

    if (outcome.status === 'fulfilled') {
      setResult(outcome.value)
      setPhase('done')
      return
    }

    setPhase('idle')
    setError(extractErrorMessage(outcome.reason, t.import.errors.failed))
  }

  function importAnother() {
    setResult(null)
    setPhase('idle')
    setRaw('')
    setFileName('')
    setError(null)
  }

  function finish() {
    toast.success(
      t.import.toast.done
        .replace('{imported}', result?.imported ?? 0)
        .replace('{skipped}', result?.skippedAsDuplicate ?? 0),
    )
    onImported?.(result)
  }

  if (phase === 'loading') {
    return (
      <div className="px-6 py-12 flex flex-col items-center text-center animate-fadeIn">
        <span className="relative flex items-center justify-center w-14 h-14 mb-4">
          <span className="absolute inset-0 rounded-2xl bg-brand-500/15 animate-ping" />
          <span className="absolute inset-0 rounded-2xl bg-brand-500/10 border border-brand-500/20" />
          <Loader2 className="w-7 h-7 text-brand-600 dark:text-brand-400 animate-spin" />
        </span>

        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {t.import.progress.title.replace('{count}', parsed ? parsed.length : 0)}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {t.import.progress.hint}
        </p>

        {/* Indeterminate sweep bar */}
        <div className="mt-5 w-52 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div className="h-full w-1/3 rounded-full bg-brand-600 dark:bg-brand-500 animate-sweep" />
        </div>
      </div>
    )
  }

  // ----------------------------------------------------
  // RESULTS SCREEN (DONE STATE)
  // ----------------------------------------------------
  if (phase === 'done') {
    const importedCount = result?.imported ?? 0
    const skippedCount = result?.skippedAsDuplicate ?? 0
    const skippedTitles = result?.skipped ?? []
    const isFullSuccess = importedCount > 0 && skippedCount === 0

    return (
      <div className="flex flex-col animate-fadeIn">
        {/* Results Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-b from-slate-50/70 to-transparent dark:from-slate-800/20">
          <div className="flex items-center gap-3.5">
            <div
              className={`shrink-0 flex items-center justify-center w-11 h-11 rounded-xl shadow-sm ${
                isFullSuccess
                  ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30'
                  : importedCount > 0
                    ? 'bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 ring-1 ring-brand-500/30'
                    : 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/30'
              }`}
            >
              {isFullSuccess ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : importedCount > 0 ? (
                <Check className="w-6 h-6" strokeWidth={2.5} />
              ) : (
                <AlertTriangle className="w-6 h-6" />
              )}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {isFullSuccess
                  ? t.import.done.title
                  : importedCount > 0
                    ? 'Η εισαγωγή ολοκληρώθηκε με παραλείψεις'
                    : 'Όλες οι ερωτήσεις υπήρχαν ήδη'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isFullSuccess
                  ? t.import.done.subtitle || 'Όλες οι ερωτήσεις καταχωρήθηκαν με επιτυχία στο μάθημα.'
                  : importedCount > 0
                    ? `Καταχωρήθηκαν ${importedCount} νέες ερωτήσεις, ενώ ${skippedCount} παραλείφθηκαν.`
                    : 'Δεν προστέθηκε καμία νέα ερώτηση καθώς όλες έχουν ήδη καταχωρηθεί.'}
              </p>
            </div>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Imported Card */}
            <div className="p-4 rounded-xl border border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800/80 dark:text-emerald-300/80">
                  {t.import.done.imported}
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.import.done.importedDesc || 'Νέες ερωτήσεις στο μάθημα'}
                </p>
              </div>
              <span className="text-2xl font-extrabold tabular-nums text-emerald-700 dark:text-emerald-400">
                {importedCount}
              </span>
            </div>

            {/* Skipped Card */}
            <div
              className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                skippedCount > 0
                  ? 'border-amber-200/80 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20'
                  : 'border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30'
              }`}
            >
              <div className="space-y-0.5">
                <span
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    skippedCount > 0
                      ? 'text-amber-800/80 dark:text-amber-300/80'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {t.import.done.skipped}
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.import.done.skippedDesc || 'Διπλότυπες ερωτήσεις'}
                </p>
              </div>
              <span
                className={`text-2xl font-extrabold tabular-nums ${
                  skippedCount > 0
                    ? 'text-amber-700 dark:text-amber-400'
                    : 'text-slate-400 dark:text-slate-600'
                }`}
              >
                {skippedCount}
              </span>
            </div>
          </div>

          {/* Skipped Duplicates List */}
          {skippedTitles.length > 0 && (
            <div className="rounded-xl border border-amber-200/90 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/15 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-amber-200/70 dark:border-amber-900/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                    {t.import.done.skippedListTitle} ({skippedTitles.length})
                  </span>
                </div>
                <span className="text-[11px] text-amber-700/80 dark:text-amber-300/80 font-medium">
                  Αποφυγή διπλοτύπων
                </span>
              </div>
              <div className="p-3">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                  {t.import.done.skippedListDesc || 'Οι παρακάτω ερωτήσεις υπήρχαν ήδη καταχωρημένες:'}
                </p>
                <div className="max-h-36 overflow-y-auto scrollbar-custom rounded-lg border border-amber-200/60 dark:border-amber-900/40 bg-white/80 dark:bg-slate-900/80 divide-y divide-slate-100 dark:divide-slate-800">
                  {skippedTitles.map((title, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-2 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2"
                    >
                      <span className="text-amber-500 font-mono text-[10px] shrink-0 mt-0.5 font-bold">
                        #{idx + 1}
                      </span>
                      <span className="leading-snug break-words">{title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Footer */}
        <footer className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 rounded-b-2xl">
          <button
            type="button"
            onClick={importAnother}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {t.import.done.again}
          </button>
          <button
            type="button"
            onClick={finish}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-500/20 transition-all hover:shadow"
          >
            <Check className="w-4 h-4" />
            {t.import.done.close}
          </button>
        </footer>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="px-6 py-5 space-y-5">
        <p className="text-sm text-slate-600 dark:text-slate-400">{t.import.intro}</p>

        <div>
          <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer transition-colors">
            <input type="file" accept="application/json,.json" onChange={handleFile} className="sr-only" />
            {t.import.chooseFile}
          </label>
          {fileName && (
            <span className="ml-3 text-xs text-slate-500 dark:text-slate-400">{fileName}</span>
          )}
        </div>

        <div>
          <label htmlFor="import-json" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {t.import.pasteLabel}
          </label>
          <textarea
            id="import-json"
            value={raw}
            onChange={(e) => { setRaw(e.target.value); setFileName(''); setError(null) }}
            rows={10}
            spellCheck={false}
            placeholder={t.import.placeholder}
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-y"
          />
          {parseError && (
            <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5">{parseError}</p>
          )}
          {parsed && (
            <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1.5">
              {t.import.readyCount.replace('{count}', parsed.length)}
            </p>
          )}
        </div>

        {/* The showcase: the exact shape the endpoint accepts, with one
            multiple-choice and one true/false entry. */}
        <section className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowSample((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-900 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span>{t.import.sampleTitle}</span>
            <span aria-hidden="true">{showSample ? '−' : '+'}</span>
          </button>
          {showSample && (
            <div className="px-4 py-3 space-y-3 bg-white dark:bg-slate-950">
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                {t.import.rules.map((rule) => <li key={rule}>{rule}</li>)}
              </ul>
              <pre className="text-[11px] leading-relaxed font-mono text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 rounded-md p-3 overflow-x-auto">
{SAMPLE}
              </pre>
              <button
                type="button"
                onClick={() => { setRaw(SAMPLE); setFileName(''); setError(null) }}
                className="text-xs font-medium text-brand-700 dark:text-brand-400 hover:underline"
              >
                {t.import.useSample}
              </button>
            </div>
          )}
        </section>

        {error && (
          <div className="rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 px-4 py-3">
            <p className="text-sm text-rose-800 dark:text-rose-300 whitespace-pre-line">{error}</p>
          </div>
        )}
      </div>

      <footer className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 font-medium transition-colors"
        >
          {t.import.cancel}
        </button>
        <button
          type="submit"
          disabled={!parsed || importMutation.isPending}
          className="px-5 py-2 rounded-md bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.import.submit.replace('{count}', parsed ? parsed.length : 0)}
        </button>
      </footer>
    </form>
  )
}

export default QuestionImportForm
