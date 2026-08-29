// Register page: creates a real account via POST /users. Route: /register
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRegister } from '../hooks/queries'
import { extractErrorMessage } from '../lib/api'
import { toast } from '../store/toastStore'
import logo from '../assets/favicon.png'
import { ENROLLMENT_YEARS, DEFAULT_ENROLLMENT_YEAR } from '../lib/years'
import t from '../content/register.json'

// Helper and admin codes now live in one table, so the server no longer says
// which kind failed. The role the user picked tells us which wording to show.
function translateServerError(err, role) {
  const raw = extractErrorMessage(err, '')
  if (/already exists/i.test(raw)) return t.errors.usernameTaken
  if (/user code/i.test(raw)) {
    return role === 'admin' ? t.errors.adminCodeInvalid : t.errors.helperCodeInvalid
  }
  return raw || t.errors.serverFallback
}

function Register() {
  const navigate = useNavigate()
  const registerMutation = useRegister()

  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [year, setYear] = useState(String(DEFAULT_ENROLLMENT_YEAR))
  const [discordName, setDiscordName] = useState('')
  const [role, setRole] = useState('student')
  const [helperCode, setHelperCode] = useState('')
  const [adminCode, setAdminCode] = useState('')
  const [error, setError] = useState(null)

  const submitting = registerMutation.isPending

  async function handleSubmit(e) {
    e.preventDefault()
    if (submitting) return
    if (!displayName.trim() || !username.trim() || !password) {
      setError(t.errors.requiredAll)
      return
    }
    if (role === 'helper' && !helperCode.trim()) {
      setError(t.errors.requiredHelperCode)
      return
    }
    if (role === 'admin' && !adminCode.trim()) {
      setError(t.errors.requiredAdminCode)
      return
    }
    setError(null)
    try {
      await registerMutation.mutateAsync({
        displayName: displayName.trim(),
        username: username.trim(),
        password,
        year: Number(year),
        discordName: discordName.trim() || undefined,
        // Both boxes feed the same field: the code row on the server decides
        // whether it grants HELPER or ADMIN.
        userCode:
          role === 'helper'
            ? helperCode.trim()
            : role === 'admin'
              ? adminCode.trim()
              : undefined,
      })
      toast.success(t.toast.created)
      navigate('/login', { replace: true })
    } catch (err) {
      setError(translateServerError(err, role))
    }
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <header className="text-center px-6 pt-8 pb-5">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/50 mb-3">
            <img src={logo} alt="Octopus" className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-200">
            {t.title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.subtitle}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          <Field
            label={t.fields.displayName}
            value={displayName}
            onChange={setDisplayName}
            placeholder={t.placeholders.displayName}
            autoFocus
          />
          <Field
            label={t.fields.username}
            value={username}
            onChange={setUsername}
            placeholder={t.placeholders.username}
          />
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t.fields.password}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.placeholders.password}
                className="w-full pl-3.5 pr-10 py-2 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-1.5">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 active:scale-95 transition-all focus:outline-none"
                  tabIndex={-1}
                  title={showPassword ? "Απόκρυψη κωδικού" : "Εμφάνιση κωδικού"}
                >
                  {showPassword ? (
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
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t.fields.year}
            </label>
            <div className="relative">
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full appearance-none pl-3.5 pr-9 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer text-sm font-medium"
              >
                {ENROLLMENT_YEARS.map((y) => (
                  <option key={y} value={String(y)}>
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
          </div>

          <div>
            <label htmlFor="discord-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t.fields.discordName}
            </label>
            <input
              id="discord-name"
              type="text"
              value={discordName}
              onChange={(e) => setDiscordName(e.target.value)}
              maxLength={255}
              autoComplete="off"
              placeholder={t.placeholders.discordName}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.hints.discordName}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {t.role.label}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <RoleOption
                emoji={t.role.student.emoji}
                label={t.role.student.label}
                description={t.role.student.description}
                active={role === 'student'}
                onClick={() => setRole('student')}
              />
              <RoleOption
                emoji={t.role.helper.emoji}
                label={t.role.helper.label}
                description={t.role.helper.description}
                active={role === 'helper'}
                onClick={() => setRole('helper')}
              />
              <RoleOption
                emoji={t.role.admin.emoji}
                label={t.role.admin.label}
                description={t.role.admin.description}
                active={role === 'admin'}
                onClick={() => setRole('admin')}
              />
            </div>
          </div>

          {role === 'helper' && (
            <div className="rounded-lg bg-brand-50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-900 p-3.5 animate-fadeIn">
              <label className="block text-sm font-medium text-brand-900 dark:text-brand-200 mb-1.5">
                {t.helperCode.label}
              </label>
              <input
                type="text"
                value={helperCode}
                onChange={(e) =>
                  setHelperCode(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))
                }
                placeholder={t.placeholders.helperCode}
                autoComplete="off"
                className="w-full px-3 py-2 rounded-md bg-white dark:bg-slate-950 border border-brand-200 dark:border-brand-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-mono tracking-wide focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          )}

          {role === 'admin' && (
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-3.5 animate-fadeIn">
              <label className="block text-sm font-medium text-amber-900 dark:text-amber-200 mb-1.5">
                {t.adminCode.label}
              </label>
              <input
                type="text"
                value={adminCode}
                onChange={(e) =>
                  setAdminCode(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))
                }
                placeholder={t.placeholders.adminCode}
                autoComplete="off"
                className="w-full px-3 py-2 rounded-md bg-white dark:bg-slate-950 border border-amber-200 dark:border-amber-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-mono tracking-wide focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}

          {error && (
            <div className="rounded-md bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 px-3 py-2 text-sm text-rose-700 dark:text-rose-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-2.5 rounded-md bg-brand-600 hover:bg-brand-700 disabled:bg-brand-600/50 disabled:cursor-not-allowed text-white font-medium shadow-sm transition-colors"
          >
            {submitting ? t.submitting : t.submit}
          </button>
        </form>

        <footer className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-center text-sm text-slate-600 dark:text-slate-400">
          {t.footer.prompt}{' '}
          <Link to="/login" className="text-brand-700 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 font-medium">
            {t.footer.link}
          </Link>
        </footer>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', placeholder, autoFocus }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full px-3 py-2 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
    </div>
  )
}

function RoleOption({ emoji, label, description, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left px-2.5 py-2 rounded-lg border-2 transition-all ${
        active
          ? 'bg-brand-50 dark:bg-brand-950/30 border-brand-500'
          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-600'
      }`}
    >
      <span className="flex items-center gap-1 text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-200">
        <span aria-hidden="true">{emoji}</span>
        {label}
      </span>
      <span className="block text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
        {description}
      </span>
    </button>
  )
}

export default Register
