// Achievements: the one table of rules, plus icon, colour and Greek text.
// Computed here from the stats the backend sends (PublicUserDto); only "og"
// (first 30 users) comes from the database.
import { Crown, Gem, PenLine, Waves, Target, Moon } from 'lucide-react'
import t from '../content/profile.json'
import { statsOf } from './profiles'

const FOUNDERS = ['dimitriskopsidas', 'corporal1984', 'retsos', 'rets5820', 'rets']

function isFounder(user) {
  if (!user) return false
  const candidates = [user.username, user.name, user.discordName]
    .filter(Boolean)
    .map((c) => c.toLowerCase().replace(/^@/, ''))
  return candidates.some((c) => FOUNDERS.includes(c))
}

const CREATOR_TIERS = [25, 50, 100, 300]
const QUIZ_TIERS = [25, 50, 100, 300]
const PERFECT_TIERS = [25, 50, 100, 300]
const NIGHT_OWL_TIERS = [10, 30, 100, 200]

/** Thresholds of the tiered badges, for the tier ladders on /achievements. */
export const TIER_THRESHOLDS = { CREATOR: CREATOR_TIERS, QUIZZES: QUIZ_TIERS, PERFECT: PERFECT_TIERS, NIGHT_OWL: NIGHT_OWL_TIERS }

/**
 * Given a badgeCode and the cumulative count reached at the time of an event,
 * returns { isMilestone: true, tier: 1..4, isRankUp: boolean } if this count was
 * an exact milestone crossing, or { isMilestone: false } if it was a normal activity.
 */
export function checkMilestone(badgeCode, count) {
  const tiers = TIER_THRESHOLDS[badgeCode]
  if (!tiers || count == null || count < 1) return { isMilestone: false }

  const tierIndex = tiers.indexOf(count)
  if (tierIndex === -1) return { isMilestone: false }

  const tier = tierIndex + 1
  return {
    isMilestone: true,
    tier,
    isRankUp: tier > 1,
  }
}

function single(code, earned) {
  return { code, tier: earned ? 1 : 0, maxTier: 1, earned, progress: null, nextTarget: null }
}

function tiered(code, tiers, count) {
  const tier = tiers.filter((min) => count >= min).length
  return { code, tier, maxTier: tiers.length, earned: tier > 0, progress: count, nextTarget: tiers[tier] ?? null }
}

/** Every badge for a PublicUserDto, earned or not, in display order. */
export function computeBadges(user) {
  if (!user) return []
  const stats = statsOf(user)
  return [
    single('FOUNDER', isFounder(user)),
    single('OG', Boolean(user.og)),
    tiered('CREATOR', CREATOR_TIERS, stats.questionsCreated),
    tiered('QUIZZES', QUIZ_TIERS, stats.quizzesCompleted),
    tiered('PERFECT', PERFECT_TIERS, stats.perfectQuizzes),
    tiered('NIGHT_OWL', NIGHT_OWL_TIERS, stats.nightOwlQuizzes),
  ]
}

const META = {
  FOUNDER: { icon: Crown, tone: 'text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800' },
  OG: { icon: Gem, tone: 'text-violet-600 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/50 border-violet-300 dark:border-violet-800' },
  CREATOR: { icon: PenLine, tone: 'text-sky-600 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/50 border-sky-300 dark:border-sky-800' },
  QUIZZES: { icon: Waves, tone: 'text-brand-600 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/50 border-brand-300 dark:border-brand-800' },
  PERFECT: { icon: Target, tone: 'text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800' },
  NIGHT_OWL: { icon: Moon, tone: 'text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-800' },
}

// Handed out, not earned: never shown as a locked goal.
const NOT_A_GOAL = new Set(['FOUNDER', 'OG'])

/** Should a locked badge show as something to aim for? Students don't write questions, so no Creator goal. */
export function isGoal(badge, role) {
  if (badge.earned) return true
  if (NOT_A_GOAL.has(badge.code)) return false
  return !(badge.code === 'CREATOR' && role === 'STUDENT')
}

/**
 * How badges are grouped on profiles and /achievements, in display order.
 * "special" (handed out, not earned) gets the gold treatment.
 */
export const BADGE_CATEGORIES = [
  { key: 'quizzes', codes: ['QUIZZES'] },
  { key: 'creator', codes: ['CREATOR'] },
  { key: 'challenges', codes: ['PERFECT', 'NIGHT_OWL'] },
  { key: 'special', codes: ['FOUNDER', 'OG'] },
]

/** [{ key, title, badges }] for the given badges, empty categories dropped. */
export function groupBadges(badges) {
  return BADGE_CATEGORIES
    .map((c) => ({ key: c.key, title: t.badges.categories[c.key], badges: badges.filter((b) => c.codes.includes(b.code)) }))
    .filter((c) => c.badges.length > 0)
}


const LOCKED_TONE = 'text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'

/**
 * Display data for one BadgeDto, or null for an unknown code.
 * Tiered badges are named after the reached tier (or the first tier while locked).
 */
export function badgeView(badge) {
  const meta = META[badge?.code]
  const text = t.badges.items[badge?.code]
  if (!meta || !text) return null

  const tiered = Array.isArray(text.tiers)
  const name = tiered ? text.tiers[Math.max(badge.tier, 1) - 1] : text.name

  return {
    code: badge.code,
    name,
    description: text.description,
    Icon: meta.icon,
    tone: badge.earned ? meta.tone : LOCKED_TONE,
    earned: badge.earned,
    tier: badge.tier,
    maxTier: badge.maxTier,
    tiered,
  }
}

export function roleNickname(role) {
  return t.roles[role]?.nickname ?? t.roles.STUDENT.nickname
}

export function hasBadge(badges, code) {
  return Boolean(badges?.some((b) => b.code === code && b.earned))
}
