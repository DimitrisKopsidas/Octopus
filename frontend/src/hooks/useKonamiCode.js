// Calls onUnlock when ↑ ↑ ↓ ↓ ← → ← → B A is typed. Ignores keys typed into
// inputs, so searching for a "b" never counts towards it.
import { useEffect, useRef } from 'react'

const SEQUENCE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
]

export default function useKonamiCode(onUnlock) {
  const position = useRef(0)
  const callback = useRef(onUnlock)

  useEffect(() => {
    callback.current = onUnlock
  }, [onUnlock])

  useEffect(() => {
    function handleKey(e) {
      const target = e.target
      if (target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))) {
        return
      }
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      if (key === SEQUENCE[position.current]) {
        position.current += 1
        if (position.current === SEQUENCE.length) {
          position.current = 0
          callback.current?.()
        }
      } else {
        position.current = key === SEQUENCE[0] ? 1 : 0
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])
}
