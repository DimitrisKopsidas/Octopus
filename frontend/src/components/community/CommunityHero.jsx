// Community hero: title + three live counters that count up on load.
import { Link } from 'react-router-dom'
import { Users, Waves, PenLine, Eye, Trophy, UserPlus } from 'lucide-react'
import { useCommunitySummary, useMe } from '../../hooks/queries'
import { openUserPreview } from '../../store/userPreviewStore'
import useCountUp from '../../hooks/useCountUp'
import logo from '../../assets/logo.png'
import t from '../../content/community.json'

function Counter({ icon: Icon, label, value }) {
  const shown = useCountUp(value)
  return (
    <div className="min-w-0 rounded-2xl bg-white/10 border border-white/15 backdrop-blur px-3 py-2.5 sm:px-4 sm:py-3">
      <div className="flex items-center gap-1.5 sm:gap-2 text-brand-100 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider leading-tight">
        <Icon className="hidden sm:block w-3.5 h-3.5 shrink-0" />
        {label}
      </div>
      <p className="text-xl sm:text-3xl font-extrabold text-white tabular-nums">
        {value == null ? <span className="inline-block h-8 w-14 rounded-lg bg-white/15 animate-pulse align-middle" /> : shown.toLocaleString('el-GR')}
      </p>
    </div>
  )
}

function CommunityHero() {
  const { data: summary } = useCommunitySummary()
  const { user, isLoading } = useMe()

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-800 to-slate-900 p-6 sm:p-10 shadow-xl">
      <div className="absolute -top-20 -right-10 w-72 h-72 rounded-full bg-brand-400/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-10 w-64 h-64 rounded-full bg-teal-300/10 blur-3xl pointer-events-none" />
      <img src={logo} alt="" aria-hidden="true" className="hidden sm:block absolute right-10 bottom-8 w-28 h-28 opacity-90 animate-float" />

      <div className="relative space-y-6 sm:pr-40">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">{t.title}</h1>
          <p className="text-sm sm:text-base text-brand-100/90 max-w-xl leading-relaxed">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <Counter icon={Users} label={t.hero.members} value={summary?.members} />
          <Counter icon={Waves} label={t.hero.quizzes} value={summary?.quizzesCompleted} />
          <Counter icon={PenLine} label={t.hero.questions} value={summary?.questionsCreated} />
        </div>

        {summary && (
          <p className="text-xs text-brand-100/80 animate-pop">
            {t.hero.roles
              .replace('{admins}', summary.admins)
              .replace('{helpers}', summary.helpers)
              .replace('{students}', summary.students)}
          </p>
        )}

        {/* Next step: see yourself as others do, or join. */}
        {!isLoading && (
          <div className="flex flex-wrap gap-2">
            {user ? (
              <>
                <button
                  type="button"
                  onClick={() => openUserPreview(user.username)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-brand-800 font-semibold text-sm shadow-lg hover:bg-brand-50 transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  {t.hero.ctaMe}
                </button>
                <Link
                  to="/achievements"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
                >
                  <Trophy className="w-4 h-4 text-amber-300" />
                  {t.hero.ctaAchievements}
                </Link>
              </>
            ) : (
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-brand-800 font-semibold text-sm shadow-lg hover:bg-brand-50 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                {t.hero.ctaJoin}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default CommunityHero
