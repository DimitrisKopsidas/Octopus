// The value, but only after it has stopped changing for `delay` ms.
// Used by the Community search so each keystroke doesn't hit the API.
import { useEffect, useState } from 'react'

export default function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}
