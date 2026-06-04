// Demo register page with role picker (auth UI; route currently disabled in main.jsx)
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import logo from '../assets/favicon.png'
import t from '../content/register.json'

function Register() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const register = useAuthStore((s) => s.register)

  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [helperCode, setHelperCode] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) navigate('/', { replace: true })
  }, [user, navigate])

  function handleSubmit(e) {
    e.preventDefault()
    if (!displayName.trim() || !username.trim() || !password) {
      setError(t.errors.requiredAll)
      return
    }
    if (role === 'helper' && !helperCode.trim()) {
      setError(t.errors.requiredHelperCode)
      return
    }
    register({
      displayName: displayName.trim(),
      username: username.trim(),
      password,
      role,
      helperCode: role === 'helper' ? helperCode.trim() : undefined,
    })
    navigate('/')
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <header className="text-center px-6 pt-8 pb-5">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/50 mb-3">
            <img src={logo} alt="Octopus" className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
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
          <Field
            label={t.fields.password}
            type="password"
            value={password}
            onChange={setPassword}
            placeholder={t.placeholders.password}
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {t.role.label}
            </label>
            <div className="grid grid-cols-2 gap-2">
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
            </div>
          </div>

          {role === 'helper' && (
            <div className="rounded-lg bg-brand-50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-900 p-3.5">
              <label className="block text-sm font-medium text-brand-900 dark:text-brand-200 mb-1.5">
                {t.helperCode.label}
              </label>
              <input
                type="text"
                value={helperCode}
                onChange={(e) =>
                  setHelperCode(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))
                }
                placeholder={t.placeholders.helperCode}
                autoComplete="off"
                className="w-full px-3 py-2 rounded-md bg-white dark:bg-slate-950 border border-brand-200 dark:border-brand-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-mono tracking-wide focus:outline-none focus:ring-2 focus:ring-brand-500"
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
            className="w-full px-4 py-2.5 rounded-md bg-brand-600 hover:bg-brand-700 text-white font-medium shadow-sm transition-colors"
          >
            {t.submit}
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
      className={`text-left px-3 py-2.5 rounded-lg border-2 transition-all ${
        active
          ? 'bg-brand-50 dark:bg-brand-950/30 border-brand-500'
          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-600'
      }`}
    >
      <span className="flex items-center gap-1.5 text-sm font-medium text-slate-900 dark:text-white">
        <span aria-hidden="true">{emoji}</span>
        {label}
      </span>
      <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
        {description}
      </span>
    </button>
  )
}

export default Register
