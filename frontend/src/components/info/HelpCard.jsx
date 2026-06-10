// Help / FAQ card. Used by Info page.
import { Link } from 'react-router-dom'

const CTA_BASE = 'inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold transition-colors'

// `className`    → extra classes merged onto the card wrapper (per-card accent/glow)
// `ctaClassName` → overrides the CTA button colors (falls back to highlight/default)
function HelpCard({ emoji, title, description, ctaLabel, kind, href, to, highlight, className = '', ctaClassName }) {
  const cardTone = highlight
    ? `bg-amber-50 dark:bg-amber-950/20 ${className.includes('border-') ? '' : 'border-amber-200 dark:border-amber-900/60'}`
    : `bg-white dark:bg-slate-900 ${className.includes('border-') ? '' : 'border-slate-200 dark:border-slate-800'}`

  const ctaTone = ctaClassName
    ? ctaClassName
    : highlight
      ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'
      : 'bg-white dark:bg-slate-950 text-brand-700 dark:text-brand-400 border border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-600'

  return (
    <div className={`rounded-xl border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-6 flex flex-col h-full ${cardTone} ${className}`}>
      <div className="text-3xl mb-3">{emoji}</div>
      <h3 className="font-semibold text-slate-900 dark:text-slate-200 mb-1">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex-1">{description}</p>
      {kind === 'external' ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${CTA_BASE} ${ctaTone}`}
        >
          {ctaLabel}
          <span aria-hidden="true" className="text-xs">↗</span>
        </a>
      ) : (
        <Link
          to={to}
          className={`${CTA_BASE} ${ctaClassName || 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm'}`}
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  )
}

export default HelpCard
