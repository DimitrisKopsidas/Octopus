// Semester filter modal. Used by Courses page.
import Modal from '../ui/Modal'
import SemesterButton from './SemesterButton'
import t from '../../content/courses.json'

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

function CoursesFilterModal({
  open,
  onClose,
  draftSemesters,
  setDraftSemesters,
  draftOnlyWithContent,
  setDraftOnlyWithContent,
  onApply,
  onReset,
  resetDisabled,
}) {
  function toggleSemester(s) {
    setDraftSemesters(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    )
  }

  return (
    <Modal open={open} onClose={onClose} title={t.filterModal.title} size="md">
      <div className="px-6 py-5 space-y-6">
        <section>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            {t.filterModal.semesterTitle}
          </h3>
          <div className="grid grid-cols-5 gap-2">
            <SemesterButton
              label={t.filterModal.allLabel}
              active={draftSemesters.length === 0}
              onClick={() => setDraftSemesters([])}
            />
            {SEMESTERS.map(s => (
              <SemesterButton
                key={s}
                label={String(s)}
                active={draftSemesters.includes(s)}
                onClick={() => toggleSemester(s)}
              />
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            {t.filterModal.contentTitle}
          </h3>
          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-md border border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-600 transition-colors">
            <input
              type="checkbox"
              checked={draftOnlyWithContent}
              onChange={e => setDraftOnlyWithContent(e.target.checked)}
              className="sr-only peer"
            />
            <span
              className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500 peer-focus-visible:ring-offset-2 ${
                draftOnlyWithContent
                  ? 'bg-brand-600 border-brand-600'
                  : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-600'
              }`}
            >
              {draftOnlyWithContent && (
                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="3 8 7 12 13 4" />
                </svg>
              )}
            </span>
            <span className="text-sm text-slate-900 dark:text-slate-100">
              {t.filterModal.onlyWithContent}
            </span>
          </label>
        </section>
      </div>

      <footer className="flex items-center justify-between gap-2 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 rounded-b-xl">
        <button
          type="button"
          onClick={onReset}
          disabled={resetDisabled}
          className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {t.filterModal.reset}
        </button>
        <button
          type="button"
          onClick={onApply}
          className="px-4 py-2 rounded-md bg-brand-600 hover:bg-brand-700 text-white font-medium shadow-sm transition-colors"
        >
          {t.filterModal.apply}
        </button>
      </footer>
    </Modal>
  )
}

export default CoursesFilterModal
