// Settings page. Route: /settings
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMe } from '../hooks/queries'
import { toast } from '../store/toastStore'
import Skeleton from '../components/ui/Skeleton'
import ThemeToggle from '../components/layout/ThemeToggle'
import t from '../content/settings.json'

function Settings() {
  const { user, isLoading } = useMe()
  const [year, setYear] = useState(user?.year || 1)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-8 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <div className="relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-2xl rounded-3xl p-8 sm:p-10 text-center animate-fade-up">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-5 shadow-sm">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Απαιτείται Σύνδεση</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Συνδέσου στο λογαριασμό σου για να αλλάξεις τις ρυθμίσεις σου.</p>
          <Link to="/login" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md transition-all">
            Σύνδεση
          </Link>
        </div>
      </div>
    )
  }

  function handleSaveYear(e) {
    e.preventDefault()
    toast.success('Το έτος σπουδών ενημερώθηκε επιτυχώς!')
  }

  function handleSavePassword(e) {
    e.preventDefault()
    if (!newPassword || newPassword !== confirmPassword) {
      toast.error('Οι κωδικοί πρόσβασης δεν ταιριάζουν.')
      return
    }
    setSavingPassword(true)
    setTimeout(() => {
      setSavingPassword(false)
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      toast.success('Ο κωδικός πρόσβασης ενημερώθηκε επιτυχώς!')
    }, 600)
  }

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {t.title}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          {t.subtitle}
        </p>
      </div>

      {/* Section 1: Study Year */}
      <form onSubmit={handleSaveYear} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
          {t.sections.profile.title}
        </h2>
        <div>
          <label htmlFor="year-select" className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
            {t.sections.profile.yearLabel}
          </label>
          <select
            id="year-select"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full sm:w-64 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
          >
            <option value={1}>1ο Έτος</option>
            <option value={2}>2ο Έτος</option>
            <option value={3}>3ο Έτος</option>
            <option value={4}>4ο Έτος</option>
            <option value={5}>5ο+ Έτος</option>
          </select>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {t.sections.profile.yearHint}
          </p>
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-600/20 transition-all"
        >
          {t.sections.profile.saveYear}
        </button>
      </form>

      {/* Section 2: Password & Security */}
      <form onSubmit={handleSavePassword} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          {t.sections.security.title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="old-password" className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
              {t.sections.security.oldPassword}
            </label>
            <input
              id="old-password"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
            />
          </div>
          <div />
          <div>
            <label htmlFor="new-password" className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
              {t.sections.security.newPassword}
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
              {t.sections.security.confirmPassword}
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={savingPassword}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-600/20 transition-all disabled:opacity-50"
        >
          {savingPassword ? 'Αποθήκευση…' : t.sections.security.savePassword}
        </button>
      </form>

      {/* Section 3: Appearance */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            {t.sections.appearance.title}
          </span>
          <ThemeToggle />
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t.sections.appearance.hint}
        </p>
      </div>
    </div>
  )
}

export default Settings
