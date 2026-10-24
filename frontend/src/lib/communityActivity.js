import { Trophy } from 'lucide-react'
import { computeBadges, badgeView } from './badges'
import { joinedAgo } from './profiles'

/** "πριν από 5 λεπτά", "πριν από 2 ώρες", etc. Greek relative time for activity feed. */
export function timeAgo(timestamp) {
  if (!timestamp) return 'πρόσφατα'
  const diffMs = new Date(timestamp).getTime() - Date.now()
  const diffSec = Math.round(diffMs / 1000)
  const diffMin = Math.round(diffSec / 60)
  const diffHour = Math.round(diffMin / 60)
  const diffDay = Math.round(diffHour / 24)

  const rtf = new Intl.RelativeTimeFormat('el', { numeric: 'auto' })
  if (Math.abs(diffSec) < 45) return 'πριν λίγο'
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, 'minute')
  if (Math.abs(diffHour) < 24) return rtf.format(diffHour, 'hour')
  if (Math.abs(diffDay) < 30) return rtf.format(diffDay, 'day')
  if (Math.abs(diffDay) < 365) return rtf.format(Math.round(diffDay / 30), 'month')
  return rtf.format(Math.round(diffDay / 365), 'year')
}

/**
 * Formats events returned by the backend GET /api/v1/community/activity
 */
export function formatBackendActivities(items = []) {
  if (!items || items.length === 0) return []

  return items.map((item) => {
    const safeTier = Math.min(Math.max(item.tier || 1, 1), 4)
    const view = badgeView({ code: item.badgeCode, tier: safeTier, earned: true })
    const isRankUp = (item.tier || 1) > 1 || item.type === 'rankup'
    const badgeName = view?.name || item.title || item.badgeCode

    return {
      id: item.id,
      type: isRankUp ? 'rankup' : 'unlock',
      user: {
        username: item.username,
        name: item.displayName || item.username,
        role: item.role,
      },
      badge: {
        code: item.badgeCode,
        name: badgeName,
        tier: safeTier,
        Icon: view?.Icon || Trophy,
        tone: view?.tone,
      },
      detailTitle: item.title,
      timeText: timeAgo(item.timestamp),
      priority: isRankUp ? 3 : item.badgeCode === 'OG' ? 4 : 2,
      timestamp: new Date(item.timestamp).getTime(),
    }
  })
}

/**
 * Derives a rich stream of community events (rank-ups, badge unlocks, newcomers)
 * directly from the member directory list (fallback).
 */
export function deriveCommunityActivity(members = []) {
  if (!members || members.length === 0) return []

  const events = []

  members.forEach((member, memberIdx) => {
    const badges = computeBadges(member).filter((b) => b.earned)

    // 1. Process Badges & Rank-ups
    badges.forEach((b) => {
      const view = badgeView(b)
      if (!view) return

      const isRankUp = b.tiered && b.tier > 1
      const isSpecial = b.code === 'FOUNDER' || b.code === 'OG'

      events.push({
        id: `${member.username}-${b.code}-${b.tier}`,
        type: isRankUp ? 'rankup' : 'unlock',
        user: member,
        badge: {
          code: b.code,
          name: view.name,
          tier: b.tier,
          Icon: view.Icon,
          tone: view.tone,
        },
        timeText: memberIdx === 0 ? 'πριν λίγο' : joinedAgo(member.memberSince) || 'πρόσφατα',
        priority: isRankUp ? 3 : isSpecial ? 4 : 2,
        timestamp: new Date(member.memberSince || Date.now()).getTime() + (b.tier * 3600000),
      })
    })

    // 2. Newcomer events (for recent members)
    if (memberIdx < 5) {
      events.push({
        id: `${member.username}-joined`,
        type: 'join',
        user: member,
        timeText: joinedAgo(member.memberSince) || 'πρόσφατα',
        priority: 1,
        timestamp: new Date(member.memberSince || Date.now()).getTime(),
      })
    }
  })

  // Sort by priority (rank-ups & special first) and timestamp
  return events.sort((a, b) => b.priority - a.priority || b.timestamp - a.timestamp)
}
