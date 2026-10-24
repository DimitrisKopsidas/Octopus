// Easter egg: 8 quick clicks on a profile avatar (one per tentacle) squirt ink.
// The counter resets after a 1.5s pause, so ordinary clicking never triggers it.
import { useEffect, useRef, useState } from 'react'

const CLICKS_NEEDED = 8
const CLICK_WINDOW_MS = 1500
const DROPS = 18

// Fixed spread, computed once: every burst looks the same and renders stay pure.
const SPLAT = Array.from({ length: DROPS }, (_, i) => {
  const angle = (i / DROPS) * Math.PI * 2
  const distance = 60 + (i % 3) * 28
  return {
    dx: `${Math.round(Math.cos(angle) * distance)}px`,
    dy: `${Math.round(Math.sin(angle) * distance)}px`,
    size: 6 + (i % 4) * 3,
    delay: `${(i % 5) * 30}ms`,
  }
})

function InkAvatar({ children }) {
  const [bursts, setBursts] = useState([])
  const clicks = useRef(0)
  const lastClick = useRef(0)
  const timers = useRef([])

  // Drop pending cleanup timers if the profile unmounts mid-splash.
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  function handleClick() {
    const now = Date.now()
    clicks.current = now - lastClick.current > CLICK_WINDOW_MS ? 1 : clicks.current + 1
    lastClick.current = now

    if (clicks.current >= CLICKS_NEEDED) {
      clicks.current = 0
      const id = now
      setBursts((b) => [...b, id])
      timers.current.push(setTimeout(() => setBursts((b) => b.filter((x) => x !== id)), 1400))
    }
  }

  return (
    <div className="relative w-fit" onClick={handleClick}>
      {children}
      {bursts.map((id) => (
        <div key={id} className="pointer-events-none absolute left-1/2 top-1/2" aria-hidden="true">
          {SPLAT.map((d, i) => (
            <span
              key={i}
              className={`ink-drop absolute rounded-full ${i % 3 === 0 ? 'bg-brand-500' : 'bg-slate-900 dark:bg-indigo-300'}`}
              style={{ width: d.size, height: d.size, '--dx': d.dx, '--dy': d.dy, animationDelay: d.delay }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default InkAvatar
