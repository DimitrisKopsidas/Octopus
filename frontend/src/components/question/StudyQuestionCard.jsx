// Single study question card: title, image, answers with the correct one(s) highlighted. Used by StudyMaterialPanel.
import QuestionImage from './QuestionImage'
import { isMultiAnswer } from '../../lib/scoring'
import t from '../../content/courseStart.json'

function StudyQuestionCard({ number, question }) {
  const isMulti = isMultiAnswer(question)

  return (
    <li className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="px-5 py-4">
        <div className="flex items-start gap-3 mb-3">
          <span className="shrink-0 w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-sm font-bold flex items-center justify-center">
            {number}
          </span>
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900 dark:text-slate-200 leading-snug break-words">{question.title}</h3>
            {isMulti && (
              <p className="mt-1 text-xs font-medium text-brand-700 dark:text-brand-400 inline-flex items-center gap-1.5">
                <span aria-hidden="true">☑</span> {t.study.multiHint}
              </p>
            )}
          </div>
        </div>

        {question.imageUrl && (
          <div className="mb-3 flex justify-center">
            <QuestionImage src={question.imageUrl} alt={question.title} className="max-h-56" />
          </div>
        )}

        <ul className="space-y-2">
          {question.answers.map((a) => {
            const tone = a.isCorrect
              ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800'
              : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
            return (
              <li key={a.id} className={`flex items-start gap-3 px-4 py-2.5 rounded-lg border ${tone}`}>
                <span className="text-base shrink-0">{a.isCorrect ? '✓' : '·'}</span>
                <span className="flex-1 min-w-0 break-words">{a.title}</span>
                {a.isCorrect && (
                  <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded shrink-0">
                    {t.study.correctTag}
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </li>
  )
}

export default StudyQuestionCard
