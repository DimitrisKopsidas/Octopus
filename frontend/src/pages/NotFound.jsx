// 404 fallback page. Route: *
import { Link } from 'react-router-dom'
import t from '../content/notFound.json'

function NotFound() {
  return (
    <div className="text-center py-16">
      <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">{t.title}</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-6">{t.message}</p>
      <Link to="/" className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium">
        {t.backLink}
      </Link>
    </div>
  )
}

export default NotFound
