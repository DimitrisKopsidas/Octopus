import { Link } from 'react-router-dom'
import t from '../content/info.json'

function resolveHref(target) {
  if (target === 'bmcUrl') return t.bmcUrl
  if (target === 'mailto') return `mailto:${t.contactEmail}`
  return target
}

function Info() {
  return (
    <div className="max-w-4xl mx-auto space-y-16">

      <section className="text-center pt-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-brand-50 dark:bg-brand-950/50 text-5xl mb-4">
          🐙
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
          {t.hero.title}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          {t.hero.subtitlePrefix}{' '}
          <span className="text-brand-600 dark:text-brand-400 font-semibold">{t.hero.brand}</span>{' '}
          {t.hero.subtitleSuffix}
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{t.whatIs.title}</h2>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
          {t.whatIs.paragraphs.map((p, i) => (
            <p key={i} className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{t.howItWorks.title}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
          {t.howItWorks.subtitle}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {t.howItWorks.modes.map((mode) => (
            <ModeCard
              key={mode.title}
              emoji={mode.emoji}
              title={mode.title}
              description={mode.description}
              bullets={mode.bullets}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{t.howToHelp.title}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
          {t.howToHelp.subtitle}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {t.howToHelp.cards.map((card) => (
            <HelpCard
              key={card.title}
              emoji={card.emoji}
              title={card.title}
              description={card.description}
              ctaLabel={card.cta}
              kind={card.kind}
              href={card.kind === 'external' ? resolveHref(card.target) : undefined}
              to={card.kind === 'internal' ? card.target : undefined}
              highlight={card.highlight}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{t.shortcuts.title}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
          {t.shortcuts.subtitle}
        </p>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <dl className="space-y-3">
            {t.shortcuts.items.map((s, i) => (
              <div key={i} className="flex items-center justify-between gap-4 flex-wrap">
                <dt className="text-sm text-slate-700 dark:text-slate-300">{s.label}</dt>
                <dd className="flex items-center gap-1.5">
                  {s.keys.map((k, j) => (
                    <Kbd key={j}>{k}</Kbd>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{t.faq.title}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
          {t.faq.subtitle}
        </p>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm divide-y divide-slate-200 dark:divide-slate-800">
          {t.faq.items.map((item, i) => (
            <details key={i} className="group p-5">
              <summary className="flex items-center justify-between cursor-pointer text-slate-900 dark:text-white font-medium list-none">
                <span>{item.q}</span>
                <span className="text-brand-600 dark:text-brand-400 text-xl transition-transform group-open:rotate-45 select-none">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{t.roadmap.title}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
          {t.roadmap.subtitle}
        </p>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <ul className="space-y-3 text-sm">
            {t.roadmap.items.map((item, i) => (
              <RoadmapItem key={i} emoji={item.emoji}>{item.text}</RoadmapItem>
            ))}
          </ul>
        </div>
      </section>

      <section className="text-center py-8 border-t border-slate-200 dark:border-slate-800">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t.footer.tagline}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          {t.footer.credit}
        </p>
        <Link
          to="/"
          className="inline-block mt-4 text-sm text-brand-700 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 font-medium"
        >
          {t.footer.backLink}
        </Link>
      </section>
    </div>
  )
}

function ModeCard({ emoji, title, description, bullets }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col h-full">
      <div className="text-3xl mb-3">{emoji}</div>
      <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{description}</p>
      <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 mt-auto">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-brand-600 dark:text-brand-400 mt-0.5 shrink-0">✓</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function HelpCard({ emoji, title, description, ctaLabel, kind, href, to, highlight }) {
  return (
    <div
      className={`rounded-xl border shadow-sm p-6 flex flex-col h-full ${
        highlight
          ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
      }`}
    >
      <div className="text-3xl mb-3">{emoji}</div>
      <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex-1">{description}</p>
      {kind === 'external' ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
            highlight
              ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-950 text-brand-700 dark:text-brand-400 border border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-600'
          }`}
        >
          {ctaLabel}
          <span aria-hidden="true" className="text-xs">↗</span>
        </a>
      ) : (
        <Link
          to={to}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-colors"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  )
}

function Kbd({ children }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-mono font-semibold shadow-[0_1px_0_0_rgba(0,0,0,0.08)] dark:shadow-[0_1px_0_0_rgba(0,0,0,0.4)]">
      {children}
    </kbd>
  )
}

function RoadmapItem({ emoji, children }) {
  return (
    <li className="flex items-start gap-3">
      <span className="text-lg shrink-0">{emoji}</span>
      <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{children}</span>
    </li>
  )
}

export default Info
