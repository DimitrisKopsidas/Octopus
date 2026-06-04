// Keyboard-key styled label. Used by Info / Test hints.
function Kbd({ children }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-mono font-semibold shadow-[0_1px_0_0_rgba(0,0,0,0.08)] dark:shadow-[0_1px_0_0_rgba(0,0,0,0.4)]">
      {children}
    </kbd>
  )
}

export default Kbd
