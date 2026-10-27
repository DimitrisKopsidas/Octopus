import { useState, useMemo } from 'react'
import { Trophy, Sparkles, Zap, ChevronDown, ChevronUp, Activity } from 'lucide-react'
import UserAvatar from '../user/UserAvatar'
import RoleBadge from '../user/RoleBadge'
import { openUserPreview } from '../../store/userPreviewStore'
import t from '../../content/community.json'

const INITIAL_LIMIT = 6

export default function CommunityActivityFeed({ events = [], isLoading = false }) {
  const [filter, setFilter] = useState('all') // 'all' | 'rankups' | 'unlocks'
  const [expanded, setExpanded] = useState(false)

  const filteredEvents = useMemo(() => {
    if (filter === 'rankups') return events.filter((e) => e.type === 'rankup')
    if (filter === 'unlocks') return events.filter((e) => e.type === 'unlock')
    return events
  }, [events, filter])

  const displayEvents = expanded
    ? filteredEvents.slice(0, 20)
    : filteredEvents.slice(0, INITIAL_LIMIT)

  const remaining = filteredEvents.length - INITIAL_LIMIT

  return (
    <section className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-5 sm:p-7 shadow-sm space-y-5 animate-fade-up">
      {/* Header with Title and Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 via-brand-500/10 to-teal-500/20 border border-amber-500/30 text-amber-500 flex items-center justify-center shrink-0 shadow-inner">
            <Activity className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>{t.activity.title}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {t.activity.subtitle}
            </p>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 self-start sm:self-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setFilter('all')
              setExpanded(false)
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {t.activity.filterAll}
          </button>
          <button
            type="button"
            onClick={() => {
              setFilter('rankups')
              setExpanded(false)
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filter === 'rankups'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {t.activity.filterRankups}
          </button>
          <button
            type="button"
            onClick={() => {
              setFilter('unlocks')
              setExpanded(false)
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filter === 'unlocks'
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {t.activity.filterUnlocks}
          </button>
        </div>
      </div>

      {/* Feed Stream */}
      {isLoading && displayEvents.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700" />
                <div className="space-y-1.5">
                  <div className="w-24 h-4 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="w-36 h-3 rounded bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700" />
            </div>
          ))}
        </div>
      ) : displayEvents.length === 0 ? (
        <div className="py-8 text-center text-sm text-slate-400">
          {t.activity.empty}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {displayEvents.map((event) => {
            const BadgeIcon = event.badge?.Icon || Trophy

            return (
              <div
                key={event.id}
                onClick={() => event.user?.username && openUserPreview(event.user.username)}
                className="group relative flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-brand-500/40 dark:hover:border-brand-500/40 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-xs cursor-pointer"
              >
                {/* User Info & Avatar */}
                <div className="flex items-center gap-3 min-w-0">
                  <UserAvatar
                    username={event.user?.username}
                    name={event.user?.name}
                    role={event.user?.role}
                    size="md"
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {event.user?.name || `@${event.user?.username}`}
                      </span>
                      <RoleBadge role={event.user?.role} size="sm" />
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1 flex-wrap">
                      {event.type === 'rankup' ? (
                        <>
                          <Zap className="w-3 h-3 text-amber-500 fill-amber-500 inline shrink-0" />
                          <span>{t.activity.rankedUp}</span>
                          <strong className="font-bold text-amber-600 dark:text-amber-400">
                            {event.badge?.name}
                          </strong>
                        </>
                      ) : event.type === 'unlock' ? (
                        <>
                          <Sparkles className="w-3 h-3 text-teal-500 inline shrink-0" />
                          <span>{t.activity.unlocked}</span>
                          <strong className="font-bold text-teal-600 dark:text-teal-400">
                            {event.badge?.name}
                          </strong>
                        </>
                      ) : event.type === 'join' ? (
                        <>
                          <Sparkles className="w-3 h-3 text-indigo-500 inline shrink-0" />
                          <span className="font-medium text-slate-600 dark:text-slate-300">
                            {event.badge?.name}
                          </span>
                        </>
                      ) : (
                        <>
                          <Activity className="w-3 h-3 text-slate-400 inline shrink-0" />
                          <span className="font-medium text-slate-700 dark:text-slate-200 truncate max-w-[220px]">
                            {event.badge?.name}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* Right: Badge Icon Emblem & Relative Time */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-xs transition-transform group-hover:scale-105 ${
                    event.badge?.tone || 'bg-slate-100 dark:bg-slate-800 text-slate-600 border-slate-200'
                  }`}>
                    <BadgeIcon className="w-4 h-4 stroke-[2]" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                    {event.timeText}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Show more / show less toggle */}
      {remaining > 0 && (
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>{t.activity.showLess}</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>{t.activity.showMore.replace('{count}', remaining)}</span>
              </>
            )}
          </button>
        </div>
      )}
    </section>
  )
}
