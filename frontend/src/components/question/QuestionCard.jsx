// Admin question display card (edit/delete). Used by AdminCourse.
import QuestionImage from './QuestionImage'
import t from '../../content/adminCourse.json'

function QuestionCard({ index, question, onEdit, onDelete, deleting }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="mb-3">
        <h3 className="font-semibold text-slate-900 dark:text-white break-words">
          <span className="text-slate-400 dark:text-slate-500 mr-2">{index}.</span>
          {question.title}
        </h3>
        <div className="mt-2 flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="text-sm px-2.5 py-1 rounded-md text-brand-700 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/30 font-medium transition-colors"
          >
            {t.questionCard.edit}
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="text-sm px-2.5 py-1 rounded-md text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-medium disabled:opacity-50 transition-colors"
          >
            {deleting ? t.questionCard.deleting : t.questionCard.delete}
          </button>
        </div>
      </div>
      {question.imageUrl && (
        <div className="mb-3">
          <QuestionImage src={question.imageUrl} alt={question.title} className="max-h-40" />
        </div>
      )}
      <ul className="space-y-1.5">
        {question.answers.map(a => (
          <li
            key={a.id}
            className={`flex items-center gap-2 text-sm px-3 py-2 rounded-md ${
              a.isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                : 'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border border-transparent'
            }`}
          >
            <span className="text-base shrink-0">{a.isCorrect ? '✓' : '·'}</span>
            <span className="flex-1 min-w-0 break-words">{a.title}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default QuestionCard
