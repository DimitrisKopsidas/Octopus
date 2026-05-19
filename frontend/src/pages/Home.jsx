import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="text-center py-16">
      <h1 className="text-5xl font-bold text-slate-900 mb-4">
        Welcome to <span className="text-indigo-600">Octopus</span>
      </h1>
      <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
        Practice your courses, test your knowledge, and track your progress.
      </p>
      <Link
        to="/courses"
        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-md transition-colors"
      >
        Start practicing
      </Link>
    </div>
  )
}

export default Home
