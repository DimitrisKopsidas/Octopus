// True/False correct-answer picker. Used by QuestionForm.
import TrueFalseCard from './TrueFalseCard'

// Correct-answer picker for a True/False question (index 0 = Σωστό, 1 = Λάθος).
function TrueFalseAnswers({ correctSet, onSelect }) {
  return (
    <section>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
        Σωστή απάντηση
      </label>
      <div className="grid grid-cols-2 gap-3">
        <TrueFalseCard
          label="Σωστό"
          emoji="✓"
          selected={correctSet.has(0)}
          onClick={() => onSelect(0)}
        />
        <TrueFalseCard
          label="Λάθος"
          emoji="✗"
          selected={correctSet.has(1)}
          onClick={() => onSelect(1)}
        />
      </div>
    </section>
  )
}

export default TrueFalseAnswers
