// Someone else's profile. Route: /profile/:username (public, no login needed).
// Visiting your own username redirects to /profile, which adds the private bits.
import { Link, Navigate, useParams } from 'react-router-dom'
import { Users } from 'lucide-react'
import { useMe, usePublicProfile } from '../hooks/queries'
import ErrorState from '../components/ui/ErrorState'
import logo from '../assets/logo.png'
import ProfileView, { ProfileViewSkeleton } from '../components/profile/ProfileView'
import { isSameUser } from '../lib/profiles'
import t from '../content/profile.json'

function PublicProfile() {
  const { username } = useParams()
  const { user: me, isLoading: meLoading } = useMe()
  const own = isSameUser(me, username)
  const { data: profile, isPending, notFound, error, refetch } = usePublicProfile(own ? null : username)

  if (meLoading) return <ProfileViewSkeleton />
  if (own) return <Navigate to="/profile" replace />
  if (isPending) return <ProfileViewSkeleton />

  if (notFound) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4 animate-fade-up">
        <img src={logo} alt="" aria-hidden="true" className="w-24 h-24 mx-auto animate-float" />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t.public.notFound.title}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">{t.public.notFound.subtitle}</p>
        <Link
          to="/community"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-lg shadow-brand-600/25 transition-all"
        >
          <Users className="w-4 h-4" />
          {t.public.notFound.cta}
        </Link>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <ErrorState message={error ?? t.public.loadError} onRetry={refetch} />
      </div>
    )
  }

  return <ProfileView profile={profile} />
}

export default PublicProfile
