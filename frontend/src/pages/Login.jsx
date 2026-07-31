// Login page. Route: /login
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMe, useLogin } from '../hooks/queries'
import { extractErrorMessage } from '../lib/api'
import logo from '../assets/favicon.png'
import t from '../content/login.json'

function Login() {
  const navigate = useNavigate()
  const { user } = useMe()
  const loginMutation = useLogin()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const submitting = loginMutation.isPending

  // Already signed in — nothing to do here.
  useEffect(() => {
    if (user) navigate('/', { replace: true })
  }, [user, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    if (submitting) return
    if (!username.trim() || !password) {
      setError(t.errors.required)
      return
    }
    setError(null)
    try {
      // useLogin seeds the me cache from the response, so the navbar flips to the
      // logged-in state before this navigation lands.
      await loginMutation.mutateAsync({ username: username.trim(), password })
      navigate('/', { replace: true })
    } catch (err) {
      // 401 is the expected failure, and it deliberately does not say whether it
      // was the username or the password that was wrong.
      setError(extractErrorMessage(err, t.errors.invalid))
    }
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <header className="text-center px-6 pt-8 pb-5">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-3">
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
            label={t.fields.username}
            value={username}
            onChange={setUsername}
            placeholder={t.placeholders.username}
            autoFocus
          />
          <Field
            label={t.fields.password}
            type="password"
            value={password}
            onChange={setPassword}
            placeholder={t.placeholders.password}
          />

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
          <Link to="/register" className="text-brand-700 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 font-medium">
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

export default Login
