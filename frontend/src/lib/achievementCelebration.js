import { communityApi } from './api'
import { computeBadges } from './badges'
import { queryClient, qk } from './queryClient'
import { triggerAchievementCelebration } from '../store/achievementCelebrationStore'

export async function fetchCurrentProfile(username) {
  if (!username) return null
  const cached = queryClient.getQueryData(qk.community.profile(username))
  if (cached) return cached
  try {
    return await communityApi.getProfile(username)
  } catch {
    return null
  }
}

export async function checkAchievementsAfter(username, prevProfile) {
  if (!username) return
  try {
    await queryClient.invalidateQueries({ queryKey: qk.community.all })
    const freshProfile = await communityApi.getProfile(username)
    if (!freshProfile) return

    const oldBadges = prevProfile ? computeBadges(prevProfile) : []
    const newBadges = computeBadges(freshProfile)

    const newlyUnlocked = []
    for (const nb of newBadges) {
      const ob = oldBadges.find((b) => b.code === nb.code)
      const oldTier = ob?.tier ?? 0
      const newTier = nb.tier
      if (newTier > oldTier) {
        newlyUnlocked.push({
          code: nb.code,
          oldTier,
          newTier,
          isUpgrade: oldTier > 0,
        })
      }
    }

    if (newlyUnlocked.length > 0) {
      triggerAchievementCelebration(newlyUnlocked)
    }
  } catch (err) {
    console.warn('Failed to check achievements', err)
  }
}
