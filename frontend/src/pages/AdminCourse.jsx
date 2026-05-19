import { useParams } from 'react-router-dom'

function AdminCourse() {
  const { courseId } = useParams()
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Manage questions</h1>
      <p className="text-slate-600">
        Course ID: <code className="bg-slate-100 px-2 py-1 rounded">{courseId}</code>
      </p>
      <p className="text-slate-600 mt-2">Question list + add/edit/delete (v0.5.0).</p>
    </div>
  )
}

export default AdminCourse
