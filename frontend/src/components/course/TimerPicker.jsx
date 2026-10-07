// Timer presets + custom minutes input. Used by SandboxPanel and UnsolvedQuizPanel.
import { useState } from 'react'
import TimerOption from './TimerOption'
import t from '../../content/courseStart.json'

function TimerPicker({ durationSeconds, setDurationSeconds, timerOptions }) {
  const [customMinutes, setCustomMinutes] = useState('')

  function handlePresetClick(value) {
    setCustomMinutes('')
    setDurationSeconds(value)
  }

  function handleCustomChange(e) {
    const val = e.target.value
    setCustomMinutes(val)
    const parsed = parseInt(val, 10)
    if (!isNaN(parsed) && parsed > 0) {
      setDurationSeconds(parsed * 60)
    } else if (val === '') {
      setDurationSeconds(null)
    }
  }

  const isCustomActive = customMinutes !== '' && timerOptions.every((opt) => opt.value !== durationSeconds)

  return (
    <section>
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
        {t.sandbox.timerLabel}
      </label>
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
        {timerOptions.map((opt) => (
          <TimerOption
            key={String(opt.value)}
            label={opt.label}
            active={!isCustomActive && durationSeconds === opt.value}
            onClick={() => handlePresetClick(opt.value)}
            className="sm:flex-1 sm:min-w-[92px]"
          />
        ))}
        <input
          type="number"
          min={1}
          placeholder="Άλλο (λεπτά)"
          value={customMinutes}
          onChange={handleCustomChange}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors text-center sm:flex-1 sm:min-w-[92px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
            isCustomActive
              ? 'bg-brand-600 text-white shadow-sm placeholder-white/70'
              : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-600 placeholder-slate-400 dark:placeholder-slate-500'
          }`}
        />
      </div>
    </section>
  )
}

export default TimerPicker
