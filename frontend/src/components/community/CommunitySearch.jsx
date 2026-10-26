// Find a member by name or username. Results show only while typing, as a list
// under the bar (same rows as the side panels); a row opens the preview modal.
import { useId, useState } from 'react'
import { Search, X } from 'lucide-react'
import { useCommunityMembers } from '../../hooks/queries'
import useDebouncedValue from '../../hooks/useDebouncedValue'
import { roleLabel } from '../../lib/roles'
import Skeleton from '../ui/Skeleton'
import { MemberRow } from './MemberCard'
import t from '../../content/community.json'

const MAX_RESULTS = 8
// Same cap as CommunityService.MAX_QUERY_LENGTH: no real name is longer.
const MAX_QUERY_LENGTH = 50

function CommunitySearch() {
  const [search, setSearch] = useState('')
  const q = useDebouncedValue(search.trim(), 300)
  const resultsId = useId()
  const { members, isPending, isFetching, error } = useCommunityMembers(
    { q, sort: 'name', size: MAX_RESULTS },
    { enabled: q.length > 0 },
  )
  const open = q.length > 0

  return (
    <section className="space-y-2" aria-label={t.search.label}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="search"
          value={search}
          maxLength={MAX_QUERY_LENGTH}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Escape' && setSearch('')}
          placeholder={t.search.placeholder}
          aria-label={t.search.label}
          aria-controls={resultsId}
          aria-expanded={open}
          className="w-full pl-12 pr-11 py-3.5 rounded-2xl text-sm sm:text-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            aria-label={t.search.clear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {open && (
        <div
          id={resultsId}
          role="region"
          aria-live="polite"
          className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg p-2 transition-opacity ${isFetching ? 'opacity-70' : ''}`}
        >
          {isPending ? (
            <div className="space-y-2 p-1">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-12 rounded-xl" />)}</div>
          ) : error ? (
            <p className="px-3 py-4 text-sm text-rose-600 dark:text-rose-400">{error}</p>
          ) : members.length === 0 ? (
            <p className="px-3 py-4 text-sm text-slate-500 dark:text-slate-400">{t.search.empty}</p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {members.map((m) => (
                <MemberRow key={m.username} member={m} subtitle={`@${m.username} · ${roleLabel(m)}`} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default CommunitySearch
