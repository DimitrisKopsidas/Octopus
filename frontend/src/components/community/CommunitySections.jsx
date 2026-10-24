// The curated bands of the Community page: the crew (admins + helpers), the
// creators ranking, the newest members and the join-the-team CTA.
import { useCommunityMembers } from '../../hooks/queries'
import Skeleton from '../ui/Skeleton'
import HelpCard from '../info/HelpCard'
import { CrewCard, MemberRow } from './MemberCard'
import { PenLine, Sparkles } from 'lucide-react'
import { joinedAgo, statsOf } from '../../lib/profiles'
import { roleNickname } from '../../lib/badges'
import t from '../../content/community.json'

// Stable param objects: TanStack keys on them, so they must not change per render.
const ADMINS = { role: 'ADMIN', sort: 'oldest', size: 50 }
const HELPERS = { role: 'HELPER', sort: 'questions', size: 50 }
const CREATORS = { sort: 'questions', size: 6 }
const NEWEST = { sort: 'newest', size: 6 }

function SectionHeader({ title, subtitle }) {
  return (
    <div className="space-y-1">
      <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h2>
      {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
    </div>
  )
}


export function CrewSection() {
  const admins = useCommunityMembers(ADMINS)
  const helpers = useCommunityMembers(HELPERS)
  const crew = [...admins.members, ...helpers.members]
  const loading = admins.isPending || helpers.isPending

  return (
    <section className="space-y-4">
      <SectionHeader title={t.crew.title} subtitle={t.crew.subtitle} />
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
      ) : crew.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">{t.crew.empty}</p>
      ) : (
        // Horizontal scroll on phones, grid from sm up.
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-x-auto sm:overflow-visible snap-x pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
          {crew.map((m) => (
            <div key={m.username} className="snap-start shrink-0 w-72 sm:w-auto">
              <CrewCard member={m} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function SidePanel({ icon: Icon, title, subtitle, isPending, children }) {
  return (
    <section className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm space-y-3">
      <div className="flex items-start gap-3 px-2">
        <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-900/60 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <h2 className="font-bold text-slate-900 dark:text-slate-100">{title}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>
      </div>
      {isPending ? (
        <div className="space-y-2">{[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-12 rounded-xl" />)}</div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">{children}</div>
      )}
    </section>
  )
}

const hasQuestions = (m) => statsOf(m).questionsCreated > 0

// Top creators as a small ranking: the bar is relative to the #1.
export function CreatorsPanel() {
  const { members, isPending } = useCommunityMembers(CREATORS)
  const creators = members.filter(hasQuestions).slice(0, 6)
  if (!isPending && creators.length === 0) return null
  const top = creators.length ? statsOf(creators[0]).questionsCreated : 1

  return (
    <SidePanel icon={PenLine} title={t.creators.title} subtitle={t.creators.subtitle} isPending={isPending}>
      {creators.map((m, i) => {
        const count = statsOf(m).questionsCreated
        return (
          <MemberRow
            key={m.username}
            member={m}
            rank={i + 1}
            subtitle={roleNickname(m.role)}
            aside={
              <div className="w-20 sm:w-24 shrink-0 text-right space-y-1">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                  {count === 1 ? t.creators.countOne : t.creators.count.replace('{count}', count)}
                </p>
                <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-sky-500" style={{ width: `${Math.round((count / top) * 100)}%` }} />
                </div>
              </div>
            }
          />
        )
      })}
    </SidePanel>
  )
}

export function NewcomersPanel() {
  const { members, isPending } = useCommunityMembers(NEWEST)
  if (!isPending && members.length === 0) return null

  return (
    <SidePanel icon={Sparkles} title={t.newcomers.title} subtitle={t.newcomers.subtitle} isPending={isPending}>
      {members.slice(0, 6).map((m) => (
        <MemberRow
          key={m.username}
          member={m}
          subtitle={`@${m.username}`}
          aside={<span className="shrink-0 text-[11px] font-semibold text-slate-400 dark:text-slate-500">{joinedAgo(m.memberSince)}</span>}
        />
      ))}
    </SidePanel>
  )
}

// "Join the team" CTA, moved here from /info. Same HelpCard and colours as it had there.
export function JoinSection() {
  const { card } = t.join
  return (
    <section className="rounded-3xl border border-brand-200/70 dark:border-brand-800/60 bg-gradient-to-br from-brand-50 to-white dark:from-brand-950/40 dark:to-slate-900 p-6 sm:p-8 grid gap-6 md:grid-cols-[1fr_minmax(0,22rem)] items-center">
      <div className="space-y-2">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">{t.join.title}</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">{t.join.subtitle}</p>
      </div>
      <HelpCard
        emoji={card.emoji}
        title={card.title}
        description={card.description}
        ctaLabel={card.cta}
        kind={card.kind}
        href={card.target}
        ctaClassName="bg-brand-500 text-white hover:bg-brand-600 shadow-sm"
        className="border-brand-500/50 dark:border-brand-500/30 shadow-[0_0_15px_-3px_rgba(34,197,94,0.1)] dark:shadow-[0_0_20px_-5px_rgba(34,197,94,0.15)]"
      />
    </section>
  )
}
