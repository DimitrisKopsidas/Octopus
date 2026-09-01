// Favorites page. Route: /favorites
import { Link } from 'react-router-dom'
import { useMe } from '../hooks/queries'
import Skeleton from '../components/ui/Skeleton'
import ComingSoonPanel from '../components/ui/ComingSoonPanel'
import t from '../content/favorites.json'

// Το feature δεν έχει βγει ακόμα: η σελίδα δείχνει πάνελ «Έρχεται σύντομα»
// αντί για empty state που υπονοεί ότι ήδη δουλεύει. Το πραγματικό empty state
// είναι γραμμένο και περιμένει από κάτω — γύρνα αυτό σε false όταν βγει.
const COMING_SOON = true

function Favorites() {
  const { user, isLoading } = useMe()

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <div className="relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-2xl rounded-3xl p-8 sm:p-10 text-center animate-fade-up">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-500 flex items-center justify-center mx-auto mb-5 shadow-sm">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Απαιτείται Σύνδεση</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Συνδέσου στο λογαριασμό σου για να δεις τα αγαπημένα σου μαθήματα.</p>
          <Link to="/login" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md transition-all">
            Σύνδεση
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <span className="text-rose-500">❤️</span>
          {t.title}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          {t.subtitle}
        </p>
      </div>

      {COMING_SOON ? (
        <ComingSoonPanel
          emoji={t.comingSoon.emoji}
          version={t.comingSoon.version}
          title={t.comingSoon.title}
          body={t.comingSoon.body}
          bullets={t.comingSoon.bullets}
          cta={t.comingSoon.cta}
        />
      ) : (
        <>
        {/* Empty State Card */}
        <div className="relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl rounded-3xl p-10 text-center">
          <div className="w-20 h-20 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-500 flex items-center justify-center mx-auto mb-5 shadow-sm">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {t.emptyTitle}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto mb-8">
            {t.emptyMessage}
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-semibold text-sm shadow-lg shadow-brand-600/25 transition-all transform hover:-translate-y-0.5"
          >
            <span>{t.exploreButton}</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
        </>
      )}

    </div>
  )
}

export default Favorites
