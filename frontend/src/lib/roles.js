// Role helpers. The single place that knows how UserRole is spelled on the wire.
//
// The backend sends STUDENT / HELPER / ADMIN in uppercase (see AUTH_API.md).
// The demo auth store used lowercase 'helper', so any comparison written against
// it would silently fail once real data arrived — every helper would have read as
// a plain student, and the admin link would have stayed hidden from them.
// Comparing role strings inline is how that bug spreads. Do it here instead.

export const ROLE = {
  STUDENT: 'STUDENT',
  HELPER: 'HELPER',
  ADMIN: 'ADMIN',
}

const CONTENT_MANAGERS = [ROLE.HELPER, ROLE.ADMIN]

/** Can this user create, edit or delete questions and course settings? */
export function canManageContent(user) {
  return user != null && CONTENT_MANAGERS.includes(user.role)
}

export function isAdmin(user) {
  return user?.role === ROLE.ADMIN
}

export function isHelper(user) {
  return user?.role === ROLE.HELPER
}

const LABELS = {
  [ROLE.STUDENT]: 'Φοιτητής',
  [ROLE.HELPER]: 'Helper',
  [ROLE.ADMIN]: 'Διαχειριστής',
}

export function roleLabel(user) {
  return LABELS[user?.role] ?? LABELS[ROLE.STUDENT]
}

/** First letter for the avatar circle, with a safe fallback. */
export function userInitial(user) {
  const source = user?.displayName?.trim() || user?.username?.trim() || ''
  return source.charAt(0).toUpperCase() || '?'
}
