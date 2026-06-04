// Countdown timer hook (returns remaining seconds). Used by Test.
import { useEffect, useState } from 'react'

// Returns remaining seconds (or null when no timer). Calls onZero once when it hits 0.
export function useCountdown(durationSeconds, startedAt, onZero) {
  const [remaining, setRemaining] = useState(null)

  useEffect(() => {
    if (!durationSeconds || !startedAt) {
      setRemaining(null)
      return
    }
    function tick() {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000)
      const left = durationSeconds - elapsed
      setRemaining(left)
      if (left <= 0) onZero?.()
    }
    tick()
    const id = setInterval(tick, 500)
    return () => clearInterval(id)
  }, [durationSeconds, startedAt, onZero])

  return remaining
}
