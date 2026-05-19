import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="text-center py-16">
      <h1 className="text-5xl font-bold text-slate-900 mb-4">404</h1>
      <p className="text-slate-600 mb-6">Page not found.</p>
      <Link to="/" className="text-indigo-600 hover:text-indigo-700 font-medium">
        Back to Home
      </Link>
    </div>
  )
}

export default NotFound
