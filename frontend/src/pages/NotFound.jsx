import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="text-center py-16">
      <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">404</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-6">Η σελίδα δεν βρέθηκε.</p>
      <Link to="/" className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium">
        Πίσω στην Αρχική
      </Link>
    </div>
  )
}

export default NotFound
