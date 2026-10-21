// Small formatting helpers shared by the profile page, preview modal and Community.
import { formatEnrollmentYear } from './years'
import t from '../content/profile.json'

export function formatMemberSince(created) {
  if (!created) return null
  const date = new Date(created).toLocaleDateString('el-GR', { day: 'numeric', month: 'long', year: 'numeric' })
  return t.public.memberSince.replace('{date}', date)
}

/** "πριν από 3 ημέρες" (Greek relative time), for the newest-members panel. */
export function joinedAgo(created) {
  if (!created) return null
  const days = Math.round((new Date(created).getTime() - Date.now()) / 86400000)
  const rtf = new Intl.RelativeTimeFormat('el', { numeric: 'auto' })
  if (days > -30) return rtf.format(days, 'day')
  if (days > -365) return rtf.format(Math.round(days / 30), 'month')
  return rtf.format(Math.round(days / 365), 'year')
}

/** "Φουρνιά 2023", or null when the enrollment year is unset/legacy. */
export function cohortLabel(year) {
  const formatted = formatEnrollmentYear(year)
  return formatted ? t.public.cohort.replace('{year}', formatted) : null
}

export function formatAvgScore(avg) {
  return avg == null ? '–' : `${Math.round(avg)}%`
}

/** Usernames are unique case-insensitively, so compare them that way. */
export function isSameUser(me, username) {
  return Boolean(me?.username && username && me.username.toLowerCase() === String(username).toLowerCase())
}

export function profilePath(username) {
  return `/profile/${encodeURIComponent(username)}`
}

/**
 * A PublicUserDto's stats with every count defaulted to 0. The one place the
 * frontend reads stats from, so an older backend (or a missing key) shows 0
 * instead of "undefined". avgScore stays null when there is no quiz yet.
 */
export function statsOf(user) {
  const s = user?.stats ?? {}
  const n = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0)
  return {
    quizzesCompleted: n(s.quizzesCompleted),
    avgScore: s.avgScore ?? null,
    questionsCreated: n(s.questionsCreated),
    coursesPracticed: n(s.coursesPracticed),
    perfectQuizzes: n(s.perfectQuizzes),
    nightOwlQuizzes: n(s.nightOwlQuizzes),
  }
}

// Which stats a profile shows, per role: students don't write questions, so
// they get courses instead; staff lead with the questions they wrote.
const ROLE_STATS = {
  STUDENT: ['quizzes', 'avgScore', 'courses'],
  HELPER: ['questions', 'quizzes', 'avgScore'],
  ADMIN: ['questions', 'quizzes', 'avgScore'],
}

const STAT_VALUE = {
  quizzes: (s) => s.quizzesCompleted,
  avgScore: (s) => formatAvgScore(s.avgScore),
  courses: (s) => s.coursesPracticed,
  questions: (s) => s.questionsCreated,
}

/** [{ key, label, value }] for a PublicUserDto, in the order its role shows them. */
export function profileStats(user) {
  const keys = ROLE_STATS[user?.role] ?? ROLE_STATS.STUDENT
  return keys.map((key) => ({ key, label: t.public.stats[key], value: STAT_VALUE[key](statsOf(user)) }))
}
