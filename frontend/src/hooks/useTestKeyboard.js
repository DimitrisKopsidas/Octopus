// Keyboard shortcuts for the Test page. Used by Test.
import { useEffect } from 'react'

// Keyboard shortcuts for the Test page:
//   ← / → → previous / next question
//   1..5  → select answer A..E
//   0     → clear current answer
//   F     → toggle flag for review
export function useTestKeyboard({
  enabled,
  currentQuestion,
  isFirst,
  isLast,
  onPrev,
  onNext,
  onSelect,
  onClear,
  onToggleFlag,
}) {
  useEffect(() => {
    if (!enabled || !currentQuestion) return
    function onKey(e) {
      const tag = e.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === 'ArrowRight') {
        if (!isLast) onNext()
      } else if (e.key === 'ArrowLeft') {
        if (!isFirst) onPrev()
      } else if (e.key === 'f' || e.key === 'F') {
        onToggleFlag(currentQuestion.id)
      } else if (e.key === '0') {
        onClear(currentQuestion.id)
      } else if (/^[1-5]$/.test(e.key)) {
        const idx = Number(e.key) - 1
        const choice = currentQuestion.answers[idx]
        if (choice) onSelect(currentQuestion.id, choice.id)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [enabled, currentQuestion, isFirst, isLast, onPrev, onNext, onSelect, onClear, onToggleFlag])
}
