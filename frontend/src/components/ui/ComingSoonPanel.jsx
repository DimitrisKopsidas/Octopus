// Πάνελ «Έρχεται σύντομα» για σελίδες που υπάρχουν στο μενού αλλά το feature
// τους δεν έχει βγει ακόμα (Αγαπημένα, Τα Κουίζ μου). Λέει τι θα κάνει η σελίδα
// όταν βγει, αντί για empty state που υπονοεί ότι ήδη δουλεύει.
import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

function ComingSoonPanel({ emoji = '🚧', title, body, bullets = [], version, cta, ctaTo = '/courses' }) {
  return (
    <div className="relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-brand-500/30 dark:border-brand-500/20 shadow-xl rounded-3xl p-8 sm:p-10 text-center animate-fade-up">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-900/60 text-brand-500 flex items-center justify-center text-3xl mx-auto mb-5 shadow-sm">
        {emoji}
      </div>

      <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 dark:border-brand-900 bg-brand-50 dark:bg-brand-950/40 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand-700 dark:text-brand-300">
        <Sparkles className="w-3 h-3" />
        Έρχεται σύντομα
        {version && <span className="font-mono normal-case tracking-normal opacity-70">· {version}</span>}
      </span>

      <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
        {body}
      </p>

      {bullets.length > 0 && (
        <ul className="mt-6 max-w-sm mx-auto space-y-2 text-left">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
              <span aria-hidden="true" className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
              <span className="leading-relaxed">{bullet}</span>
            </li>
          ))}
        </ul>
      )}

      {cta && (
        <Link
          to={ctaTo}
          className="mt-8 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-lg shadow-brand-600/25 transition-all transform hover:-translate-y-0.5"
        >
          {cta}
          <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  )
}

export default ComingSoonPanel
