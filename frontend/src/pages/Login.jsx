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
  const [showPassword, setShowPassword] = useState(false)
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
      await loginMutation.mutateAsync({ username: username.trim(), password })
      navigate('/', { replace: true })
    } catch (err) {
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
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t.fields.username}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t.placeholders.username}
              autoFocus
              className="w-full px-3 py-2 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

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

export default Login
