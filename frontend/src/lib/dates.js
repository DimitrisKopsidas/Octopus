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


/**
 * Απόλυτη ημερομηνία + ώρα για πίνακες διαχείρισης, όπου το «Πριν 3 μέρες»
 * δεν αρκεί: ο admin θέλει να συγκρίνει και να ταξινομεί.
 */
export function formatDateTime(dateVal) {
  if (!dateVal) return '—'
  const d = new Date(dateVal)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleString('el-GR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Μόνο η ημερομηνία, για στήλες που δεν χωράνε και την ώρα. */
export function formatDate(dateVal) {
  if (!dateVal) return '—'
  const d = new Date(dateVal)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('el-GR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
