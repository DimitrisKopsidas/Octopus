// Quizzes page. Route: /quizzes
import { Link } from 'react-router-dom'
import { useMe } from '../hooks/queries'
import Skeleton from '../components/ui/Skeleton'
import ComingSoonPanel from '../components/ui/ComingSoonPanel'
import t from '../content/quizzes.json'

// Το feature δεν έχει βγει ακόμα: η σελίδα δείχνει πάνελ «Έρχεται σύντομα»
// αντί για empty state που υπονοεί ότι ήδη δουλεύει. Το πραγματικό empty state
// είναι γραμμένο και περιμένει από κάτω — γύρνα αυτό σε false όταν βγει.
const COMING_SOON = true

function Quizzes() {
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
          <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800 text-brand-500 flex items-center justify-center mx-auto mb-5 shadow-sm">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Απαιτείται Σύνδεση</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Συνδέσου στο λογαριασμό σου για να δεις τα κουίζ σου.</p>
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
          <span className="text-brand-500">📝</span>
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
          <div className="w-20 h-20 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900/60 text-brand-500 flex items-center justify-center mx-auto mb-5 shadow-sm">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
            <span>{t.startQuizButton}</span>
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

export default Quizzes
