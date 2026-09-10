// Dark/light theme toggle button. Used in Layout header + mobile drawer + user panel.
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../lib/useTheme'

function ThemeToggle({ variant = 'nav', className = '' }) {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  const displayClass = className.includes('hidden') ? '' : 'flex'
  const baseClass =
    variant === 'panel'
      ? 'w-9 h-9 items-center justify-center rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-slate-200/80 dark:border-slate-800'
      : 'w-9 h-9 items-center justify-center rounded-xl text-brand-100 hover:bg-brand-800/80 hover:text-white transition-colors cursor-pointer'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Εναλλαγή σε φωτεινό θέμα' : 'Εναλλαγή σε σκούρο θέμα'}
      className={`${displayClass} ${baseClass} ${className}`.trim().replace(/\s+/g, ' ')}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-300" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  )
}

export default ThemeToggle

