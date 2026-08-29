// Relative "last updated" wording. Shared by the Courses grid card and the
// CourseStart sidebar so both phrase the same timestamp identically.
export function formatLastUpdated(dateVal) {
  if (!dateVal) return 'Ποτέ'
  try {
    const d = new Date(dateVal)
    if (isNaN(d.getTime())) return String(dateVal)

    const diffMs = Date.now() - d.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 5) return 'Πριν λίγο'
    if (diffMins < 60) return `Πριν ${diffMins} λ`
    if (diffHours < 24) return `Πριν ${diffHours} ώρες`
    if (diffDays === 1) return 'Εχθές'
    if (diffDays < 30) return `Πριν ${diffDays} μέρες`
    return d.toLocaleDateString('el-GR')
  } catch {
    return 'Ποτέ'
  }
}
