import BackButton from '../components/BackButton'

function Results() {
  return (
    <div>
      <div className="mb-6">
        <BackButton to="/courses" label="Πίσω στα μαθήματα" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Αποτελέσματα</h1>
      <p className="text-slate-600 dark:text-slate-400">
        Σκορ και ανασκόπηση ανά ερώτηση (v0.2.0).
      </p>
    </div>
  )
}

export default Results
