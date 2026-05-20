import { useTheme } from '../lib/useTheme'

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Εναλλαγή σε φωτεινό θέμα' : 'Εναλλαγή σε σκούρο θέμα'}
      title={isDark ? 'Φωτεινό θέμα' : 'Σκούρο θέμα'}
      className="ml-2 w-9 h-9 flex items-center justify-center rounded-md text-brand-100 hover:bg-brand-800 hover:text-white transition-colors"
    >
      <span className="text-lg">{isDark ? '☀️' : '🌙'}</span>
    </button>
  )
}

export default ThemeToggle
