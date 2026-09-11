// Καταγραφή συμβάντων και σφαλμάτων από το frontend προς το backend.
//
// Το backend εκθέτει εδώ και καιρό τα POST /logs/audit και /logs/crash, αλλά
// δεν τα καλούσε κανείς: το action CLIENT_AUDIT_EVENT δεν παραγόταν ποτέ και ο
// πίνακας Crash Logs ήταν μόνιμα άδειος. Αυτό το module είναι η σύνδεση.
//
// Τρεις κανόνες που τηρούνται παντού εδώ μέσα:
//   1. Ποτέ δεν πετάει. Ένας logger που ρίχνει την εφαρμογή είναι χειρότερος
//      από καθόλου logger, οπότε κάθε κλήση καταπίνει τα δικά της σφάλματα.
//   2. Ποτέ δεν μπλοκάρει. Καμία κλήση δεν γίνεται await από UI κώδικα.
//   3. Ποτέ δεν πλημμυρίζει. Ένα render loop μπορεί να καλέσει το onerror
//      εκατοντάδες φορές το δευτερόλεπτο -- υπάρχει dedupe και όριο ανά φόρτωση.
import { auditApi, crashApi } from './api'

// Τα όρια είναι του CreateCrashLogRequestDto. Κόβουμε εδώ αντί να αφήσουμε το
// @Size να απορρίψει το request: μια κομμένη αναφορά είναι πιο χρήσιμη από
// καμία αναφορά.
const LIMITS = {
  exceptionClass: 255,
  message: 2000,
  requestUri: 500,
  httpMethod: 10,
}

const MAX_CRASHES_PER_PAGELOAD = 5
const DEDUPE_WINDOW_MS = 30_000

let crashesSent = 0
const recentCrashes = new Map() // key -> timestamp

function truncate(value, max) {
  if (typeof value !== 'string') return null
  return value.length > max ? value.slice(0, max) : value
}

/**
 * Συμβάν που ξέρει μόνο ο browser -- κάτι που το backend δεν μπορεί να δει από
 * μόνο του, όπως ότι ο χρήστης παράτησε quiz στη μέση.
 *
 * Το `action` ΔΕΝ είναι παράμετρος επίτηδες. Το endpoint είναι permitAll, και
 * αν το frontend μπορούσε να διαλέξει action, θα μπορούσε και ο καθένας με ένα
 * curl -- γράφοντας ψεύτικα USER_ROLE_CHANGED στο audit log του admin. Το τι
 * συνέβη το λέει το `details`.
 */
export function logClientEvent({ resourceType = null, resourceId = null, details, status = 'SUCCESS' }) {
  try {
    auditApi
      .createLog({
        action: 'CLIENT_AUDIT_EVENT',
        resourceType,
        resourceId: resourceId == null ? null : String(resourceId),
        status,
        details,
      })
      .catch(() => {})
  } catch {
    // ignored -- βλ. κανόνα 1
  }
}

/**
 * Παραλλαγή για όταν η σελίδα κλείνει. Το axios request ακυρώνεται μαζί με τη
 * σελίδα, οπότε χρησιμοποιούμε sendBeacon: ο browser αναλαμβάνει να το στείλει
 * αφού φύγει ο χρήστης.
 */
export function logClientEventOnUnload(payload) {
  try {
    if (typeof navigator === 'undefined' || !navigator.sendBeacon) return
    const base = import.meta.env.VITE_API_BASE_URL || '/api/v1'
    const body = new Blob(
      [JSON.stringify({ action: 'CLIENT_AUDIT_EVENT', status: 'SUCCESS', ...payload })],
      { type: 'application/json' },
    )
    navigator.sendBeacon(`${base}/logs/audit`, body)
  } catch {
    // ignored
  }
}

const EXTENSION_SCHEMES = [
  'chrome-extension://',
  'moz-extension://',
  'safari-extension://',
  'safari-web-extension://',
]

function isIgnoredError({ message, stackTrace, filename }) {
  const msg = typeof message === 'string' ? message : ''
  const stack = typeof stackTrace === 'string' ? stackTrace : ''
  const file = typeof filename === 'string' ? filename : ''

  // 1. Generic cross-origin/browser-masked error without actionable stack trace
  if ((msg === 'Script error.' || msg === 'Script error') && !stack) {
    return true
  }

  // 2. Errors originating from browser extensions (e.g. Urban VPN, adblockers)
  for (const scheme of EXTENSION_SCHEMES) {
    if (msg.includes(scheme) || stack.includes(scheme) || file.includes(scheme)) {
      return true
    }
  }

  return false
}

/**
 * Σφάλμα του frontend. Καλείται από το ErrorBoundary και από τους καθολικούς
 * handlers -- δεν χρειάζεται να το καλέσεις χειροκίνητα από component.
 */
export function logCrash({ exceptionClass, message, stackTrace, requestUri, statusCode = null }) {
  try {
    if (crashesSent >= MAX_CRASHES_PER_PAGELOAD) return
    if (isIgnoredError({ message, stackTrace })) return

    const key = `${exceptionClass}::${message}`
    const now = Date.now()
    const last = recentCrashes.get(key)
    // Το React StrictMode ξανακαλεί τα renders σε development, και ένα σπασμένο
    // component ξαναπέφτει σε κάθε render. Χωρίς αυτό, ένα bug γίνεται DDoS.
    if (last && now - last < DEDUPE_WINDOW_MS) return
    recentCrashes.set(key, now)
    crashesSent += 1

    crashApi
      .createLog({
        exceptionClass: truncate(exceptionClass, LIMITS.exceptionClass) || 'UnknownError',
        message: truncate(message, LIMITS.message),
        stackTrace: stackTrace || null,
        requestUri: truncate(requestUri ?? window.location.pathname + window.location.search, LIMITS.requestUri),
        httpMethod: 'GET',
        statusCode,
      })
      .catch(() => {})
  } catch {
    // ignored
  }
}

/**
 * Πιάνει ό,τι ξεφεύγει από το ErrorBoundary: σφάλματα εκτός React (event
 * handlers, timers, async κώδικας) και promises που απορρίφθηκαν χωρίς catch.
 * Καλείται μία φορά, στο boot.
 */
export function installGlobalErrorHandlers() {
  if (typeof window === 'undefined' || window.__octopusErrorHandlersInstalled) return
  window.__octopusErrorHandlersInstalled = true

  window.addEventListener('error', (event) => {
    const filename = event?.filename || ''
    const err = event?.error
    const message = err?.message || event?.message || 'Unknown window error'
    const stackTrace = err?.stack || null

    if (isIgnoredError({ message, stackTrace, filename })) return

    logCrash({
      exceptionClass: err?.name || 'WindowError',
      message,
      stackTrace,
    })
  })

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event?.reason
    const message = reason?.message || String(reason ?? 'Unknown rejection')
    const stackTrace = reason?.stack || null

    if (isIgnoredError({ message, stackTrace })) return

    logCrash({
      exceptionClass: reason?.name || 'UnhandledRejection',
      message,
      stackTrace,
      statusCode: reason?.response?.status ?? null,
    })
  })
}
