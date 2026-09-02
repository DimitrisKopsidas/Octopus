import { useEffect } from 'react'

/**
 * Κλειδώνει το scroll της σελίδας όσο ένα modal είναι ανοιχτό.
 *
 * Δύο πράγματα που δεν είναι προφανή:
 *
 * 1. Το κλείδωμα μετριέται, δεν είναι on/off. Αν δύο overlays είναι ανοιχτά
 *    μαζί (π.χ. modal που ανοίγει ConfirmModal), το κλείσιμο του ενός δεν
 *    πρέπει να ξεκλειδώσει τη σελίδα όσο ζει το άλλο -- γι' αυτό κρατάμε
 *    μετρητή στο ίδιο το element και όχι boolean ανά component.
 *
 * 2. Μόλις φύγει το scrollbar, το περιεχόμενο πηδάει δεξιά κατά το πλάτος
 *    του. Το αντισταθμίζουμε με padding-right ίσο με αυτό το πλάτος, ώστε το
 *    άνοιγμα του modal να μην κουνάει τη σελίδα από κάτω.
 */
export default function useBodyScrollLock(locked) {
  useEffect(() => {
    if (!locked) return

    const body = document.body
    const depth = Number(body.dataset.scrollLocks || 0)

    if (depth === 0) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      body.dataset.prevOverflow = body.style.overflow
      body.dataset.prevPaddingRight = body.style.paddingRight
      body.style.overflow = 'hidden'
      if (scrollbarWidth > 0) {
        const current = parseFloat(getComputedStyle(body).paddingRight) || 0
        body.style.paddingRight = `${current + scrollbarWidth}px`
      }
    }

    body.dataset.scrollLocks = String(depth + 1)

    return () => {
      const remaining = Number(body.dataset.scrollLocks || 1) - 1
      body.dataset.scrollLocks = String(Math.max(0, remaining))
      if (remaining <= 0) {
        body.style.overflow = body.dataset.prevOverflow || ''
        body.style.paddingRight = body.dataset.prevPaddingRight || ''
        delete body.dataset.scrollLocks
        delete body.dataset.prevOverflow
        delete body.dataset.prevPaddingRight
      }
    }
  }, [locked])
}
