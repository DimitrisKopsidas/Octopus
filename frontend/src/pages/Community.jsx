// Community page. Route: /community (public).
// Hero counters -> member search -> the crew (admins + helpers) -> "join the team" ->
// creators ranking + newest members side by side. Every card/row opens the user preview modal.
// Hidden: the Konami code turns every avatar into the Octopus logo.
import { useEffect, useMemo } from 'react'
import CommunityHero from '../components/community/CommunityHero'
import CommunityActivityFeed from '../components/community/CommunityActivityFeed'
import { CrewSection, CreatorsPanel, NewcomersPanel, JoinSection } from '../components/community/CommunitySections'
import CommunitySearch from '../components/community/CommunitySearch'
import { useCommunityMembers, useCommunityActivity } from '../hooks/queries'
import { deriveCommunityActivity, formatBackendActivities } from '../lib/communityActivity'
import useKonamiCode from '../hooks/useKonamiCode'
import { useEasterEggStore } from '../store/easterEggStore'
import { toast } from '../store/toastStore'
import t from '../content/community.json'

const ALL_MEMBERS = { size: 50, sort: 'newest' }

function Community() {
  const { activities: backendActivities, isLoading: isActivityLoading } = useCommunityActivity(30)
  const { members } = useCommunityMembers(ALL_MEMBERS)

  const activityEvents = useMemo(() => {
    if (backendActivities && backendActivities.length > 0) {
      return formatBackendActivities(backendActivities)
    }
    return deriveCommunityActivity(members)
  }, [backendActivities, members])

  useKonamiCode(() => {
    const { octopusAvatars, toggleOctopusAvatars } = useEasterEggStore.getState()
    toggleOctopusAvatars()
    toast.info(octopusAvatars ? t.konami.off : t.konami.on)
  })

  // Octopus mode belongs to this page; leaving it puts the faces back.
  useEffect(() => () => useEasterEggStore.getState().resetOctopusAvatars(), [])

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-10 space-y-10 animate-fade-up">
      <CommunityHero />

      <CommunitySearch />

      {/* Activity & Achievement Feed */}
      <CommunityActivityFeed events={activityEvents} isLoading={isActivityLoading} />

      <CrewSection />
      <JoinSection />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <CreatorsPanel />
        <NewcomersPanel />
      </div>
    </div>
  )
}

export default Community
