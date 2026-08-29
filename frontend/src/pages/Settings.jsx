// Settings page. Route: /settings
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMe, useUpdateMe, useUpdatePassword, useLogout } from '../hooks/queries'
import { extractErrorMessage } from '../lib/api'
import { toast } from '../store/toastStore'
import Skeleton from '../components/ui/Skeleton'
import ThemeToggle from '../components/layout/ThemeToggle'
import {
  ENROLLMENT_YEARS,
  DEFAULT_ENROLLMENT_YEAR,
  isValidEnrollmentYear,
} from '../lib/years'
import t from '../content/settings.json'

export default function Settings() {
  const navigate = useNavigate()
  const { user, isLoading } = useMe()
  // The profile form reads the saved user until something is edited, then reads
  // the draft. Nothing copies props into state, so it stays correct while useMe
  // is still loading and re-syncs on its own after a save.
  const [profileDraft, setProfileDraft] = useState(null)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const updateMeMutation = useUpdateMe()
  const updatePasswordMutation = useUpdatePassword()
  const logoutMutation = useLogout()

  const savedProfile = {
    year: isValidEnrollmentYear(user?.year) ? user.year : DEFAULT_ENROLLMENT_YEAR,
    discordName: user?.discordName ?? '',
    displayPreference: user?.displayPreference ?? 'DISPLAY_NAME',
  }
  const profile = profileDraft ?? savedProfile
  const editProfile = (patch) => setProfileDraft({ ...profile, ...patch })

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-8 space-y-8 animate-pulse">
        {/* Title */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-44 rounded-lg" />
          <Skeleton className="h-4 w-72 rounded-md" />
        </div>

        {/* Section 1: Study Year */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <Skeleton className="h-6 w-40 rounded-lg pb-3 border-b border-slate-100 dark:border-slate-800" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-full sm:w-64 rounded-xl" />
            <Skeleton className="h-3 w-64" />
          </div>
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>

        {/* Section 2: Password */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <Skeleton className="h-6 w-48 rounded-lg pb-3 border-b border-slate-100 dark:border-slate-800" />
          <div className="space-y-3 max-w-md">
            <div className="space-y-1"><Skeleton className="h-3 w-28" /><Skeleton className="h-10 w-full rounded-xl" /></div>
            <div className="space-y-1"><Skeleton className="h-3 w-28" /><Skeleton className="h-10 w-full rounded-xl" /></div>
            <div className="space-y-1"><Skeleton className="h-3 w-32" /><Skeleton className="h-10 w-full rounded-xl" /></div>
          </div>
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>

        {/* Section 3: Theme */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <Skeleton className="h-6 w-40 rounded-lg pb-3 border-b border-slate-100 dark:border-slate-800" />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-9 w-24 rounded-xl" />
          </div>
        </div>
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

  const trimmedDiscordName = profile.discordName.trim()
  // The server refuses DISCORD_NAME without a handle, so don't offer it either.
  const canUseDiscordName = trimmedDiscordName.length > 0

  async function handleSaveProfile(e) {
    e.preventDefault()
    try {
      await updateMeMutation.mutateAsync({
        year: profile.year,
        discordName: trimmedDiscordName,
        displayPreference: canUseDiscordName ? profile.displayPreference : 'DISPLAY_NAME',
      })
      setProfileDraft(null)
      toast.success('Το προφίλ ενημερώθηκε επιτυχώς!')
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Αποτυχία ενημέρωσης προφίλ.'))
    }
  }

  async function handleSavePassword(e) {
    e.preventDefault()
    if (!oldPassword) {
      toast.error('Παρακαλώ εισάγετε τον τρέχοντα κωδικό πρόσβασης.')
      return
    }
    if (!newPassword || newPassword !== confirmPassword) {
      toast.error('Οι νέοι κωδικοί πρόσβασης δεν ταιριάζουν.')
      return
    }
    if (newPassword.length < 6) {
      toast.error('Ο νέος κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες.')
      return
    }
    try {
      await updatePasswordMutation.mutateAsync({ oldPassword, newPassword })
      await logoutMutation.mutateAsync()
      toast.success('Ο κωδικός πρόσβασης ενημερώθηκε! Παρακαλώ συνδεθείτε ξανά με τον νέο σας κωδικό.')
      navigate('/login')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Αποτυχία ενημέρωσης κωδικού. Ελέγξτε τον παλιό κωδικό.')
    }
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
      <form onSubmit={handleSaveProfile} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
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
          <div className="relative w-full sm:w-64">
            <select
              id="year-select"
              value={profile.year}
              onChange={(e) => editProfile({ year: Number(e.target.value) })}
              className="w-full appearance-none rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-4 pr-10 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all cursor-pointer"
            >
              {ENROLLMENT_YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {t.sections.profile.yearHint}
          </p>
        </div>

        <div>
          <label htmlFor="discord-name" className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
            {t.sections.profile.discordLabel}
          </label>
          <input
            id="discord-name"
            type="text"
            value={profile.discordName}
            onChange={(e) => editProfile({ discordName: e.target.value })}
            maxLength={255}
            autoComplete="off"
            placeholder={t.sections.profile.discordPlaceholder}
            className="w-full sm:w-64 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {t.sections.profile.discordHint}
          </p>
        </div>

        <fieldset>
          <legend className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
            {t.sections.profile.displayPreferenceLabel}
          </legend>
          <div className="space-y-2">
            <label className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="radio"
                name="displayPreference"
                value="DISPLAY_NAME"
                checked={!canUseDiscordName || profile.displayPreference === 'DISPLAY_NAME'}
                onChange={() => editProfile({ displayPreference: 'DISPLAY_NAME' })}
                className="accent-brand-600"
              />
              <span>{t.sections.profile.displayNameOption}</span>
            </label>
            <label className={`flex items-center gap-2.5 text-sm ${canUseDiscordName ? 'text-slate-700 dark:text-slate-300 cursor-pointer' : 'text-slate-400 dark:text-slate-600 cursor-not-allowed'}`}>
              <input
                type="radio"
                name="displayPreference"
                value="DISCORD_NAME"
                disabled={!canUseDiscordName}
                checked={canUseDiscordName && profile.displayPreference === 'DISCORD_NAME'}
                onChange={() => editProfile({ displayPreference: 'DISCORD_NAME' })}
                className="accent-brand-600"
              />
              <span>
                {canUseDiscordName
                  ? t.sections.profile.discordNameOption
                  : t.sections.profile.discordNameOptionDisabled}
              </span>
            </label>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {t.sections.profile.displayPreferenceHint}
          </p>
        </fieldset>

        <button
          type="submit"
          disabled={updateMeMutation.isPending}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-600/20 transition-all disabled:opacity-50"
        >
          {updateMeMutation.isPending ? 'Αποθήκευση...' : t.sections.profile.saveProfile}
        </button>
      </form>

      {/* Section 2: Password & Security */}
      <form onSubmit={handleSavePassword} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          {t.sections.password.title}
        </h2>
        <div className="space-y-3 max-w-md">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
              {t.sections.password.oldLabel}
            </label>
            <div className="relative">
              <input
                type={showOldPassword ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-4 pr-10 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-1.5">
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 active:scale-95 transition-all focus:outline-none"
                  tabIndex={-1}
                  title={showOldPassword ? "Απόκρυψη κωδικού" : "Εμφάνιση κωδικού"}
                >
                  {showOldPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.025 10.025 0 013.122-.888c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
              {t.sections.password.newLabel}
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-4 pr-10 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-1.5">
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 active:scale-95 transition-all focus:outline-none"
                  tabIndex={-1}
                  title={showNewPassword ? "Απόκρυψη κωδικού" : "Εμφάνιση κωδικού"}
                >
                  {showNewPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.025 10.025 0 013.122-.888c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
              {t.sections.password.confirmLabel}
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-4 pr-10 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-1.5">
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 active:scale-95 transition-all focus:outline-none"
                  tabIndex={-1}
                  title={showConfirmPassword ? "Απόκρυψη κωδικού" : "Εμφάνιση κωδικού"}
                >
                  {showConfirmPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.025 10.025 0 013.122-.888c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={updatePasswordMutation.isPending}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-600/20 transition-all disabled:opacity-50"
        >
          {updatePasswordMutation.isPending ? 'Ενημέρωση...' : t.sections.password.savePassword}
        </button>
      </form>

      {/* Section 3: Appearance & Theme */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          {t.sections.theme.title}
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-200">
              {t.sections.theme.label}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.sections.theme.hint}
            </p>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
