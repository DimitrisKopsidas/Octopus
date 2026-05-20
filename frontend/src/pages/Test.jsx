import { useParams } from 'react-router-dom'
import BackButton from '../components/BackButton'

function Test() {
  const { courseId } = useParams()
  return (
    <div>
      <div className="mb-6">
        <BackButton to={`/courses/${courseId}/start`} label="Πίσω στις ρυθμίσεις τεστ" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Τεστ σε εξέλιξη</h1>
      <p className="text-slate-600 dark:text-slate-400">
        ID μαθήματος: <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{courseId}</code>
      </p>
      <p className="text-slate-600 dark:text-slate-400 mt-2">UI ερωτήσεων (v0.2.0).</p>
    </div>
  )
}

export default Test
