import QuestionImage from './QuestionImage'
import t from '../../content/results.json'

function ReviewCard({ index, question, chosenAnswerId }) {
  const correctAnswer = question.answers.find((a) => a.isCorrect)
  const isCorrect = chosenAnswerId === correctAnswer?.id
  const wasAnswered = chosenAnswerId != null

  const headerTone = !wasAnswered
    ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
    : isCorrect
      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900'
      : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900'

  const badgeTone = !wasAnswered
    ? 'text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-700'
    : isCorrect
      ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60'
      : 'text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/60'

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className={`px-5 py-3 border-b flex items-center justify-between gap-3 ${headerTone}`}>
        <h3 className="font-semibold text-slate-900 dark:text-white">
          <span className="text-slate-400 dark:text-slate-500 mr-2">{index}.</span>
          {question.title}
        </h3>
        <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${badgeTone}`}>
          {!wasAnswered ? t.review.noAnswer : isCorrect ? t.review.correct : t.review.wrong}
        </span>
      </div>
      {question.imageUrl && (
        <div className="px-3 pt-3 flex justify-center">
          <QuestionImage src={question.imageUrl} alt={question.title} className="max-h-48" />
        </div>
      )}
      <ul className="p-3 space-y-1.5">
        {question.answers.map((a) => {
          const isChosen = a.id === chosenAnswerId
          const isCorrectAnswer = a.isCorrect
          const rowTone = isCorrectAnswer
            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
            : isChosen
              ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
              : 'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border border-transparent'

          return (
            <li key={a.id} className={`flex items-center gap-2 text-sm px-3 py-2 rounded-md ${rowTone}`}>
              <span className="text-base shrink-0">
                {isCorrectAnswer ? '✓' : isChosen ? '✗' : '·'}
              </span>
              <span className="flex-1">{a.title}</span>
              {isChosen && (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded shrink-0">
                  {t.review.yourChoice}
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default ReviewCard
