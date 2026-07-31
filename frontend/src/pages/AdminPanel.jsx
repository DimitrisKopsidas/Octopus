import { Link } from 'react-router-dom'
import { useMe, useAuditLogs, useCourses } from '../hooks/queries'
import PanelNavigation from '../components/layout/PanelNavigation'
import t from '../content/adminPanel.json'

export default function AdminPanel() {
  const { user } = useMe()
  const { data: courses } = useCourses()
  const { logs, totalElements } = useAuditLogs({ page: 0, size: 5 })

  const recentLogs = logs.slice(0, 5)

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Top Navigation Tabs */}
      <PanelNavigation activeTab="/admin-panel" />

      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-brand-500/10 dark:from-amber-950/40 dark:via-purple-950/40 dark:to-slate-900 border border-amber-500/20 rounded-3xl p-8 sm:p-10 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
              {t.badge}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {t.welcomePrefix}, @{user?.username}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-xl">
              {t.subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/admin-panel/audits"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <span>{t.buttons.auditLogs}</span>
            </Link>
            <Link
              to="/control-panel"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-semibold text-sm transition-all"
            >
              <span>{t.buttons.controlPanel}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Shortcut Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Fast Access to Audit Logs */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-purple-500/30 dark:border-purple-500/20 shadow-xl rounded-2xl p-6 flex flex-col justify-between transition-all hover:border-purple-500/50 hover:-translate-y-1">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-900/60 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl shadow-sm">
                📜
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                {totalElements} Logs
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1.5">
              {t.cards.audits.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              {t.cards.audits.description}
            </p>
          </div>

          <Link
            to="/admin-panel/audits"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all transform hover:-translate-y-0.5"
          >
            <span>{t.cards.audits.button}</span>
          </Link>
        </div>

        {/* Card 2: Control Panel Shortcut */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-brand-500/30 dark:border-brand-500/20 shadow-xl rounded-2xl p-6 flex flex-col justify-between transition-all hover:border-brand-500/50 hover:-translate-y-1">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-900/60 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xl shadow-sm">
                🛠️
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                {courses?.length ?? 0} Μαθήματα
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1.5">
              {t.cards.courses.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              {t.cards.courses.description}
            </p>
          </div>

          <Link
            to="/control-panel"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/20 transition-all transform hover:-translate-y-0.5"
          >
            <span>{t.cards.courses.button}</span>
          </Link>
        </div>

        {/* Card 3: User & System Status */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-amber-500/30 dark:border-amber-500/20 shadow-xl rounded-2xl p-6 flex flex-col justify-between transition-all hover:border-amber-500/50 hover:-translate-y-1">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl shadow-sm">
                🛡️
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {t.cards.system.badge}
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1.5">
              {t.cards.system.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              {t.cards.system.descriptionPrefix}{user?.username}) έχει πλήρη δικαιώματα ADMIN στο σύστημα.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-600 dark:text-slate-300">
            <div>User ID: {user?.id?.substring(0, 8)}…</div>
            <div>Role: {user?.role}</div>
          </div>
        </div>
      </div>

      {/* Recent Audit Events Snippet */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>{t.recentLogs.title}</span>
          </h3>

          <Link
            to="/admin-panel/audits"
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
          >
            {t.recentLogs.fastAccess}
          </Link>
        </div>

        {recentLogs.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">{t.recentLogs.empty}</p>
        ) : (
          <div className="space-y-2.5">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600'}`}>
                    {log.action}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    @{log.actorUsername || 'system'}
                  </span>
                </div>

                <span className="font-mono text-[11px] text-slate-400">
                  {new Date(log.timestamp).toLocaleTimeString('el-GR')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
