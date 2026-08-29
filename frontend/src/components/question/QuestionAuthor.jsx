// Attribution line for a question's author. Used by the admin question list,
// the study material panel and the results review. Renders nothing when the
// question predates created_by, so old rows don't leave an empty line behind.
import t from '../../content/question.json'

function QuestionAuthor({ name, className = '' }) {
  if (!name) return null

  return (
    <p className={`text-xs text-slate-400 dark:text-slate-500 ${className}`}>
      {t.author.replace('{name}', name)}
    </p>
  )
}

export default QuestionAuthor
