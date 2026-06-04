// Multiple-choice answers editor (rows + add). Used by QuestionForm.
import AnswerRow from './AnswerRow'
import { MAX_ANSWERS } from '../../hooks/useQuestionForm'

// Editor for multiple-choice answers: the list of rows + "add" action.
// Pure presentation — all state lives in useQuestionForm.
function MultipleChoiceAnswers({
  answers,
  correctSet,
  canAdd,
  canRemove,
  onUpdateAnswer,
  onToggleCorrect,
  onRemoveAnswer,
  onAddAnswer,
}) {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-3">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Απαντήσεις
          <span className="ml-2 text-xs text-slate-500 dark:text-slate-400 font-normal">
            {answers.length} / {MAX_ANSWERS}
          </span>
        </label>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Τσέκαρε τις σωστές
        </span>
      </div>

      <div className="space-y-2">
        {answers.map((a, idx) => (
          <AnswerRow
            key={idx}
            index={idx}
            value={a.title}
            isCorrect={correctSet.has(idx)}
            canRemove={canRemove}
            onChange={(v) => onUpdateAnswer(idx, v)}
            onToggleCorrect={() => onToggleCorrect(idx)}
            onRemove={() => onRemoveAnswer(idx)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onAddAnswer}
        disabled={!canAdd}
        className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-700 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className="text-base leading-none">+</span>
        Προσθήκη απάντησης
      </button>
    </section>
  )
}

export default MultipleChoiceAnswers
