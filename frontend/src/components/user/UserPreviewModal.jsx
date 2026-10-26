// Quick look at a user without leaving the page. Mounted once in Layout; opened
// from anywhere with openUserPreview(username). "Δες προφίλ" goes to the full page.
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, UserX } from 'lucide-react'
import Modal from '../ui/Modal'
import Skeleton from '../ui/Skeleton'
import UserAvatar from './UserAvatar'
import RoleBadge from './RoleBadge'
import UserBadges from './UserBadges'
import { useMe, usePublicProfile } from '../../hooks/queries'
import { useUserPreviewStore } from '../../store/userPreviewStore'
import { cohortLabel, formatMemberSince, isSameUser, profilePath, profileStats } from '../../lib/profiles'
import t from '../../content/profile.json'

function MiniStat({ label, value }) {
  return (
    <div className="flex-1 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 px-3 py-2.5 text-center">
      <p className="text-lg font-extrabold text-slate-900 dark:text-slate-100 tabular-nums">{value}</p>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  )
}

function PreviewBody({ username, onClose }) {
  const { user: me } = useMe()
  const { data: profile, isPending, notFound, error } = usePublicProfile(username)

  if (isPending) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-16 rounded-2xl" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-40 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
        </div>
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
    )
  }

  if (notFound || error || !profile) {
    return (
      <div className="p-8 text-center space-y-2">
        <UserX className="w-10 h-10 mx-auto text-slate-400" />
        <p className="font-semibold text-slate-800 dark:text-slate-200">
          {notFound ? t.public.notFound.title : t.public.loadError}
        </p>
        {notFound && <p className="text-sm text-slate-500 dark:text-slate-400">{t.public.notFound.subtitle}</p>}
      </div>
    )
  }

  const own = isSameUser(me, profile.username)
  const cohort = cohortLabel(profile.year)

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center gap-4">
        <UserAvatar name={profile.name} username={profile.username} role={profile.role} size="lg" />
        <div className="min-w-0 space-y-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
            {profile.name}
            {own && <span className="ml-2 text-xs font-semibold text-brand-600 dark:text-brand-400">({t.public.you})</span>}
          </h3>
          <p className="text-sm font-mono text-slate-500 dark:text-slate-400 truncate">@{profile.username}</p>
          <RoleBadge role={profile.role} />
        </div>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        {[formatMemberSince(profile.memberSince), cohort].filter(Boolean).join(' · ')}
      </p>

      <div className="flex gap-2">
        {profileStats(profile).map((stat) => <MiniStat key={stat.key} label={stat.label} value={stat.value} />)}
      </div>

      <UserBadges user={profile} />

      <Link
        to={own ? '/profile' : profilePath(profile.username)}
        onClick={onClose}
        className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-lg shadow-brand-600/25 transition-all"
      >
        {own ? t.public.viewOwnProfile : t.public.viewProfile}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}

function UserPreviewModal() {
  const username = useUserPreviewStore((s) => s.username)
  const close = useUserPreviewStore((s) => s.close)
  const { pathname } = useLocation()

  // Back/forward or any navigation closes the preview; it belongs to the page it opened on.
  useEffect(() => {
    useUserPreviewStore.getState().close()
  }, [pathname])

  return (
    <Modal open={Boolean(username)} onClose={close} title={t.public.previewTitle} size="sm">
      {username && <PreviewBody username={username} onClose={close} />}
    </Modal>
  )
}

export default UserPreviewModal
