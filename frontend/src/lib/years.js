// Enrollment year (year of enrollment), not year of study.
// Mirrors the server contract: CreateUserRequestDto and UpdateMeRequestDto
// both validate @Min(2000) @Max(2030) on `year`.
export const MIN_ENROLLMENT_YEAR = 2000
export const MAX_ENROLLMENT_YEAR = 2030

// Nobody enrols in the future, so the list stops at the current year -- but it
// never runs past what the server accepts.
const latestSelectable = Math.min(new Date().getFullYear(), MAX_ENROLLMENT_YEAR)

export const DEFAULT_ENROLLMENT_YEAR = Math.max(latestSelectable, MIN_ENROLLMENT_YEAR)

// Newest first: the common case is a recent enrolment.
export const ENROLLMENT_YEARS = Array.from(
  { length: latestSelectable - MIN_ENROLLMENT_YEAR + 1 },
  (_, i) => latestSelectable - i,
)

export function isValidEnrollmentYear(year) {
  return Number.isInteger(year) && year >= MIN_ENROLLMENT_YEAR && year <= MAX_ENROLLMENT_YEAR
}

// Accounts created before the meaning changed still hold 1-5. Showing "3" under
// an "Έτος Εισαγωγής" label would be a lie, so those read as unset instead.
export function formatEnrollmentYear(year) {
  return isValidEnrollmentYear(year) ? String(year) : null
}
