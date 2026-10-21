// Community page. Route: /community (public).
// Hero counters -> member search -> the crew (admins + helpers) -> "join the team" ->
// creators ranking + newest members side by side. Every card/row opens the user preview modal.
// Hidden: the Konami code turns every avatar into the Octopus logo.
import { useEffect } from 'react'
import CommunityHero from '../components/community/CommunityHero'
import { CrewSection, CreatorsPanel, NewcomersPanel, JoinSection } from '../components/community/CommunitySections'
import CommunitySearch from '../components/community/CommunitySearch'
import useKonamiCode from '../hooks/useKonamiCode'
import { useEasterEggStore } from '../store/easterEggStore'
import { toast } from '../store/toastStore'
import t from '../content/community.json'

function Community() {
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
