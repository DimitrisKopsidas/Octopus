// JSON bulk import for one course. Used by the AdminCourse modal.
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useImportQuestions } from '../../hooks/queries'
import { extractErrorMessage } from '../../lib/api'
import { toast } from '../../store/toastStore'
import t from '../../content/adminCourse.json'

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
    try {
      const result = await importMutation.mutateAsync({ questions: parsed })
      toast.success(
        t.import.toast.done
          .replace('{imported}', result.imported)
          .replace('{skipped}', result.skippedAsDuplicate),
      )
      onImported?.(result)
    } catch (err) {
      setError(extractErrorMessage(err, t.import.errors.failed))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      {importMutation.isPending ? (
        <div className="px-6 py-14 flex flex-col items-center text-center animate-fadeIn">
          <span className="relative flex items-center justify-center w-16 h-16 mb-5">
            <span className="absolute inset-0 rounded-full bg-brand-500/15 animate-ping" />
            <span className="absolute inset-0 rounded-full bg-brand-500/10" />
            <Loader2 className="w-8 h-8 text-brand-600 dark:text-brand-400 animate-spin" />
          </span>

          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {t.import.progress.title.replace('{count}', parsed ? parsed.length : 0)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.import.progress.hint}
          </p>

          {/* Indeterminate on purpose: the server answers once, at the end. A
              percentage here would be theatre. */}
          <div className="mt-6 w-56 h-1 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div className="h-full w-1/4 rounded-full bg-brand-600 animate-sweep" />
          </div>
        </div>
      ) : (
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
      )}

      <footer className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
        <button
          type="button"
          onClick={onCancel}
          disabled={importMutation.isPending}
          className="px-4 py-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 font-medium transition-colors disabled:opacity-50"
        >
          {t.import.cancel}
        </button>
        <button
          type="submit"
          disabled={!parsed || importMutation.isPending}
          className="px-5 py-2 rounded-md bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {importMutation.isPending
            ? t.import.submitting
            : t.import.submit.replace('{count}', parsed ? parsed.length : 0)}
        </button>
      </footer>
    </form>
  )
}

export default QuestionImportForm
