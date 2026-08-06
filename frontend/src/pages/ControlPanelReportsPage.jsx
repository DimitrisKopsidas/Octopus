import PanelNavigation from '../components/layout/PanelNavigation'
import t from '../content/controlPanel.json'

export default function ControlPanelReportsPage() {
  return (
    <div className="space-y-6 animate-fade-up">
      {/* Top Navigation Tabs */}
      <PanelNavigation activeTab="/control-panel/reports" />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-200 mb-2">{t.reportsPage.title}</h1>
        <p className="text-slate-600 dark:text-slate-400">{t.reportsPage.subtitle}</p>
      </div>

      {/* Reports Banner Card */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-amber-500/30 dark:border-amber-500/20 shadow-xl rounded-2xl p-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 text-amber-500 flex items-center justify-center text-3xl mx-auto shadow-sm">
          🚩
        </div>

        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          {t.reportsPage.cardTitle}
        </h2>

        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          {t.reportsPage.emptyText}
        </p>

        <div className="pt-2">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold">
            ✓ 0 Εκκρεμότητες
          </span>
        </div>
      </div>
    </div>
  )
}
