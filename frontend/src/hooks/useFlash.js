import { useEffect, useState } from 'react'

// Transient state that auto-clears after `duration` ms. Returns [value, setValue].
export function useFlash(duration = 1500) {
  const [value, setValue] = useState(null)

  useEffect(() => {
    if (!value) return
    const id = setTimeout(() => setValue(null), duration)
    return () => clearTimeout(id)
  }, [value, duration])

  return [value, setValue]
}
