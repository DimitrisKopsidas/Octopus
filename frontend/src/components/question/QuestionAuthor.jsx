// Attribution line for a question's author. Used by the admin question list,
// the study material panel and the results review. Renders nothing when the
// question predates created_by, so old rows don't leave an empty line behind.
// With a username the name opens the author's preview modal.
import UserLink from '../user/UserLink'
import t from '../../content/question.json'

function QuestionAuthor({ name, username, className = '' }) {
  if (!name) return null

  const [before, after = ''] = t.author.split('{name}')

  return (
    <p className={`text-xs text-slate-400 dark:text-slate-500 ${className}`}>
      {before}
      <UserLink username={username}>{name}</UserLink>
      {after}
    </p>
  )
}

export default QuestionAuthor
