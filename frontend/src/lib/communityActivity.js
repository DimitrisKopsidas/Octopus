import { Trophy, Waves, Target, PenLine, UserPlus } from 'lucide-react'
import { computeBadges, badgeView, checkMilestone } from './badges'
import { joinedAgo } from './profiles'
import t from '../content/community.json'

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
    // 1. OG Milestone
    if (item.badgeCode === 'OG') {
      const view = badgeView({ code: 'OG', tier: 1, earned: true })
      return {
        id: item.id,
        type: 'unlock',
        user: {
          username: item.username,
          name: item.displayName || item.username,
          role: item.role,
        },
        badge: {
          code: 'OG',
          name: view?.name || 'OG',
          tier: 1,
          Icon: view?.Icon || Trophy,
          tone: view?.tone,
        },
        timeText: timeAgo(item.timestamp),
        priority: 4,
        timestamp: new Date(item.timestamp).getTime(),
      }
    }

    // 2. Member Joined without OG
    if (item.type === 'MEMBER_JOINED') {
      return {
        id: item.id,
        type: 'join',
        user: {
          username: item.username,
          name: item.displayName || item.username,
          role: item.role,
        },
        badge: {
          name: t.activity.joined,
          Icon: UserPlus,
          tone: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800',
        },
        timeText: timeAgo(item.timestamp),
        priority: 1,
        timestamp: new Date(item.timestamp).getTime(),
      }
    }

    // 3. Tiered Badges: Check if this event was an actual milestone crossing
    const milestone = checkMilestone(item.badgeCode, item.tier)

    if (milestone.isMilestone) {
      const view = badgeView({ code: item.badgeCode, tier: milestone.tier, earned: true })
      const isRankUp = milestone.isRankUp
      const type = isRankUp ? 'rankup' : 'unlock'

      return {
        id: item.id,
        type,
        user: {
          username: item.username,
          name: item.displayName || item.username,
          role: item.role,
        },
        badge: {
          code: item.badgeCode,
          name: view?.name || item.badgeCode,
          tier: milestone.tier,
          Icon: view?.Icon || Trophy,
          tone: view?.tone,
        },
        detailTitle: item.title,
        timeText: timeAgo(item.timestamp),
        priority: isRankUp ? 3 : 2,
        timestamp: new Date(item.timestamp).getTime(),
      }
    }

    // 4. Regular Activity (e.g. normal quiz completion, new question creation)
    const isPerfect = item.type === 'PERFECT_QUIZ'
    const isQuestion = item.type === 'QUESTION_CREATED'

    return {
      id: item.id,
      type: 'activity',
      user: {
        username: item.username,
        name: item.displayName || item.username,
        role: item.role,
      },
      badge: {
        code: item.badgeCode,
        name: isQuestion
          ? `Νέα ερώτηση: ${item.title}`
          : isPerfect
            ? '100% Επιτυχία σε Quiz'
            : 'Ολοκληρωμένο Quiz',
        Icon: isQuestion ? PenLine : isPerfect ? Target : Waves,
        tone: isQuestion
          ? 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800'
          : isPerfect
            ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
            : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700',
      },
      detailTitle: item.title,
      timeText: timeAgo(item.timestamp),
      priority: 1,
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
