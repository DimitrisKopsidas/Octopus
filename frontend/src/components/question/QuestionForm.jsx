// Create/edit question form orchestrator (tabs + answers + image). Logic in useQuestionForm. Used by AdminCourse modal.
import QuestionImageUpload from './QuestionImageUpload'
import MultipleChoiceAnswers from './MultipleChoiceAnswers'
import TrueFalseAnswers from './TrueFalseAnswers'
import { useQuestionForm } from '../../hooks/useQuestionForm'

function QuestionForm({ courseId, initialQuestion, onCreated, onUpdated, onCancel }) {
  const form = useQuestionForm({ courseId, initialQuestion, onCreated, onUpdated })

  // --- Tab bar classes ---
  const tabBase = 'flex-1 py-2 text-sm font-medium rounded-md transition-colors text-center'
  const tabActive = `${tabBase} bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm`
  const tabInactive = `${tabBase} text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300`

  return (
    <form onSubmit={form.handleSubmit} className="flex flex-col">
      <div className="px-6 py-5 space-y-6">

        {/* Type tabs */}
        {!form.isEdit && (
          <div className="flex gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-950">
            <button type="button" onClick={() => form.switchType('multiple')}
              className={form.questionType === 'multiple' ? tabActive : tabInactive}>
              Πολλαπλή επιλογή
            </button>
            <button type="button" onClick={() => form.switchType('truefalse')}
              className={form.questionType === 'truefalse' ? tabActive : tabInactive}>
              Σωστό / Λάθος
            </button>
          </div>
        )}

        {/* Question title */}
        <section>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {form.questionType === 'truefalse' ? 'Πρόταση' : 'Ερώτηση'}
          </label>
          <textarea
            value={form.title}
            onChange={(e) => form.setTitle(e.target.value)}
            rows={3}
            maxLength={510}
            placeholder={form.questionType === 'truefalse'
              ? 'π.χ. Η Java είναι interpreted γλώσσα.'
              : 'π.χ. Τι σημαίνει το ακρωνύμιο JVM;'}
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 text-right">
            {form.title.length}/510
          </p>
        </section>

        <QuestionImageUpload
          file={form.imageFile}
          existingUrl={form.existingImageUrl}
          onFileChange={form.handleImageChange}
          onRemove={form.handleImageRemove}
        />

        {form.questionType === 'multiple' ? (
          <MultipleChoiceAnswers
            answers={form.answers}
            correctSet={form.correctSet}
            canAdd={form.canAdd}
            canRemove={form.canRemove}
            onUpdateAnswer={form.updateAnswer}
            onToggleCorrect={form.toggleCorrect}
            onRemoveAnswer={form.removeAnswer}
            onAddAnswer={form.addAnswer}
          />
        ) : (
          <TrueFalseAnswers correctSet={form.correctSet} onSelect={form.selectTfCorrect} />
        )}

        {form.error && (
          <div className="rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
            {form.error}
          </div>
        )}
      </div>

      <footer className="flex items-center justify-center gap-2 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 rounded-b-xl">
        <button
          type="button"
          onClick={onCancel}
          disabled={form.submitting}
          className="px-4 py-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 font-medium transition-colors disabled:opacity-50"
        >
          Ακύρωση
        </button>
        <button
          type="submit"
          disabled={form.submitting}
          className="px-5 py-2 rounded-md bg-brand-600 hover:bg-brand-700 disabled:bg-brand-600/50 disabled:cursor-not-allowed text-white font-medium shadow-sm transition-colors"
        >
          {form.submitting ? 'Αποθήκευση…' : form.isEdit ? 'Αποθήκευση αλλαγών' : 'Δημιουργία ερώτησης'}
        </button>
      </footer>
    </form>
  )
}

export default QuestionForm
