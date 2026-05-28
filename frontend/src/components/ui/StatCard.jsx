function StatCard({ label, children }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
      <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-2">
        {label}
      </p>
      {children}
    </div>
  )
}

export default StatCard
