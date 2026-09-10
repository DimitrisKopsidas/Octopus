// Theme (dark/light) state + localStorage persistence hook. Used by ThemeToggle.
import { create } from 'zustand'

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || saved === 'light') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (theme === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
  try {
    localStorage.setItem('theme', theme)
  } catch {
    // Ignore storage quota or restricted access errors
  }
}

const initial = getInitialTheme()
applyTheme(initial)

const useThemeStore = create((set) => ({
  theme: initial,
  toggle: () =>
    set((state) => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark'
      applyTheme(nextTheme)
      return { theme: nextTheme }
    }),
  setTheme: (theme) => {
    applyTheme(theme)
    set({ theme })
  },
}))

export function useTheme() {
  const theme = useThemeStore((s) => s.theme)
  const toggle = useThemeStore((s) => s.toggle)
  return { theme, toggle }
}
