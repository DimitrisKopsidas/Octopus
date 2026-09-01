// Μοναδική πηγή για το πώς παρουσιάζονται τα audit actions: ελληνική ετικέτα,
// χρωματισμός και μια πρόταση που εξηγεί τι σημαίνει η ενέργεια. Το ίδιο αρχείο
// γεμίζει και το φίλτρο, οπότε μια νέα τιμή στο AuditAction enum του backend
// μπαίνει εδώ μία φορά και εμφανίζεται παντού -- πριν, το dropdown έλειπε
// ήδη το USER_UPDATED και κανείς δεν μπορούσε να φιλτράρει σε αυτό.

export const AUDIT_ACTIONS = [
  { value: 'USER_LOGIN_SUCCESS', label: 'Επιτυχής σύνδεση', tone: 'success' },
  { value: 'USER_LOGIN_FAILED', label: 'Αποτυχία σύνδεσης', tone: 'danger' },
  { value: 'USER_LOGOUT', label: 'Αποσύνδεση', tone: 'neutral' },
  { value: 'USER_REGISTERED', label: 'Νέα εγγραφή', tone: 'success' },
  { value: 'USER_REGISTER_FAILED', label: 'Αποτυχία εγγραφής', tone: 'danger' },
  { value: 'USER_UPDATED', label: 'Ενημέρωση χρήστη', tone: 'warning' },
  { value: 'USER_DEACTIVATED', label: 'Απενεργοποίηση χρήστη', tone: 'danger' },
  { value: 'USER_ROLE_CHANGED', label: 'Αλλαγή ρόλου', tone: 'warning' },
  { value: 'INVITE_CODE_GENERATED', label: 'Δημιουργία κωδικού πρόσκλησης', tone: 'brand' },
  { value: 'INVITE_CODE_DELETED', label: 'Διαγραφή κωδικού πρόσκλησης', tone: 'danger' },
  { value: 'TOKEN_REFRESHED', label: 'Ανανέωση token', tone: 'neutral' },
  { value: 'COURSE_UPDATED', label: 'Ενημέρωση μαθήματος', tone: 'warning' },
  { value: 'QUESTION_CREATED', label: 'Νέα ερώτηση', tone: 'brand' },
  { value: 'QUESTION_UPDATED', label: 'Ενημέρωση ερώτησης', tone: 'warning' },
  { value: 'QUESTION_DEACTIVATED', label: 'Απενεργοποίηση ερώτησης', tone: 'danger' },
  { value: 'QUESTION_IMAGE_UPLOADED', label: 'Ανέβασμα εικόνας', tone: 'brand' },
  { value: 'QUESTION_IMAGE_DELETED', label: 'Διαγραφή εικόνας', tone: 'danger' },
  { value: 'BUNDLE_CREATED', label: 'Ολοκλήρωση quiz', tone: 'brand' },
  { value: 'CLIENT_AUDIT_EVENT', label: 'Συμβάν από το frontend', tone: 'neutral' },
]

const BY_VALUE = Object.fromEntries(AUDIT_ACTIONS.map((a) => [a.value, a]))

/** Ελληνική ετικέτα· άγνωστο action επιστρέφει το raw enum αντί για κενό. */
export function auditActionLabel(action) {
  return BY_VALUE[action]?.label ?? action ?? '—'
}

const TONE_CLASS = {
  success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  danger: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  brand: 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20',
  neutral: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-400/20',
}

/**
 * Το status υπερισχύει του action: ένα COURSE_UPDATED που απέτυχε είναι
 * κόκκινο, όχι πορτοκαλί, γιατί αυτό ψάχνει ο admin όταν σκανάρει τη λίστα.
 */
export function auditActionClass(action, status) {
  if (status === 'FAILURE') return TONE_CLASS.danger
  return TONE_CLASS[BY_VALUE[action]?.tone] ?? TONE_CLASS.neutral
}

const RESOURCE_LABELS = {
  USER: 'Χρήστης',
  COURSE: 'Μάθημα',
  QUESTION: 'Ερώτηση',
  BUNDLE: 'Quiz',
  INVITE_CODE: 'Κωδικός πρόσκλησης',
  AUTH: 'Σύνδεση',
}

export function resourceLabel(resourceType) {
  return RESOURCE_LABELS[resourceType] ?? resourceType ?? '—'
}

/**
 * Σύνδεσμος προς τον πόρο, όπου υπάρχει σελίδα που τον δείχνει. Επιστρέφει
 * null όταν δεν υπάρχει -- δεν φτιάχνουμε link που οδηγεί σε 404.
 */
export function resourceHref(resourceType, resourceId) {
  if (!resourceId) return null
  if (resourceType === 'COURSE') return `/control-panel/courses/${resourceId}`
  return null
}
