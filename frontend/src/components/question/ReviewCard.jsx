// Per-question review card (correct/wrong/unanswered). Used by Results.
import QuestionImage from './QuestionImage'
import { getChosenIds, isQuestionCorrect } from '../../lib/scoring'
import t from '../../content/results.json'

function ReviewCard({ index, question, chosenAnswerId }) {
  const chosenIds = getChosenIds(chosenAnswerId)
  const isCorrect = isQuestionCorrect(question, chosenAnswerId)
  const wasAnswered = chosenIds.length > 0

  // Three outcomes: correct (green), wrong (solid red), unanswered (muted red —
  // still no point, but visually distinct from an actively wrong answer).
  const headerTone = isCorrect
    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900'
    : !wasAnswered
      ? 'bg-rose-50/50 dark:bg-rose-950/15 border-rose-200/70 dark:border-rose-900/50'
      : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900'

  const badgeTone = isCorrect
    ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60'
    : !wasAnswered
      ? 'text-rose-500/90 dark:text-rose-400/80 bg-rose-100/60 dark:bg-rose-900/30'
      : 'text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/60'

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className={`px-5 py-3 border-b ${headerTone}`}>
        <span className={`inline-block mb-2 text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${badgeTone}`}>
          {!wasAnswered ? t.review.noAnswer : isCorrect ? t.review.correct : t.review.wrong}
        </span>
        <h3 className="font-semibold text-slate-900 dark:text-white break-words">
          <span className="text-slate-400 dark:text-slate-500 mr-2">{index}.</span>
          {question.title}
        </h3>
      </div>
      {question.imageUrl && (
        <div className="px-3 pt-3 flex justify-center">
          <QuestionImage src={question.imageUrl} alt={question.title} className="max-h-48" />
        </div>
      )}
      <ul className="p-3 space-y-1.5">
        {question.answers.map((a) => {
          const isChosen = chosenIds.includes(a.id)
          const isCorrectAnswer = a.isCorrect
          const rowTone = isCorrectAnswer
            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
            : isChosen
              ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
              : 'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border border-transparent'

          return (
            <li key={a.id} className={`flex items-start gap-2 text-sm px-3 py-2 rounded-md ${rowTone}`}>
              <span className="text-base shrink-0">
                {isCorrectAnswer ? '✓' : isChosen ? '✗' : '·'}
              </span>
              <div className="flex-1 min-w-0">
                <span className="break-words">{a.title}</span>
                {isChosen && (
                  <div className="mt-1">
                    <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded">
                      {t.review.yourChoice}
                    </span>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default ReviewCard
