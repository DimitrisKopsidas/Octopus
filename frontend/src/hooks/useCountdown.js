import { useEffect, useRef, useState } from 'react'

// Returns remaining seconds (or null when no timer). Calls onZero once when it hits 0.
export function useCountdown(durationSeconds, startedAt, onZero) {
  const [remaining, setRemaining] = useState(() => {
    if (!durationSeconds || !startedAt) return null
    const elapsed = Math.floor((Date.now() - startedAt) / 1000)
    return Math.max(0, durationSeconds - elapsed)
  })

  const onZeroRef = useRef(onZero)
  useEffect(() => {
    onZeroRef.current = onZero
  })

  const hasFiredRef = useRef(false)

  useEffect(() => {
    hasFiredRef.current = false
    if (!durationSeconds || !startedAt) return

    function tick() {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000)
      const left = Math.max(0, durationSeconds - elapsed)
      setRemaining(left)
      if (left <= 0 && !hasFiredRef.current) {
        hasFiredRef.current = true
        onZeroRef.current?.()
      }
    }

    tick()
    const id = setInterval(tick, 500)
    return () => clearInterval(id)
  }, [durationSeconds, startedAt])

  return !durationSeconds || !startedAt ? null : remaining
}
