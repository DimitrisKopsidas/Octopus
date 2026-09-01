// Info / about page (help cards, study modes, roadmap). Route: /info
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import ModeCard from '../components/info/ModeCard'
import HelpCard from '../components/info/HelpCard'
import RoadmapItem from '../components/info/RoadmapItem'
import Kbd from '../components/ui/Kbd'
import t from '../content/info.json'
import news from '../content/news.json'

function resolveHref(target) {
  if (target === 'bmcUrl') return t.bmcUrl
  return target
}

function Info() {
  return (
    <div className="max-w-4xl mx-auto space-y-16">

      <section className="text-center pt-8 animate-fade-up">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-brand-50 dark:bg-brand-950/50 mb-4">
          <img src={logo} alt="Octopus" className="w-12 h-12" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-200 mb-3 tracking-tight">
          {t.hero.title}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          {t.hero.subtitlePrefix}{' '}
          <span className="text-brand-600 dark:text-brand-400 font-semibold">{t.hero.brand}</span>{' '}
          {t.hero.subtitleSuffix}
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-200 mb-3">{t.whatIs.title}</h2>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
          {t.whatIs.paragraphs.map((p, i) => (
            <p key={i} className="text-slate-700 dark:text-slate-300 leading-relaxed">{p}</p>
          ))}
        </div>
      </section>

{/*       <section> */}
{/*         <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-200 mb-1">{t.howItWorks.title}</h2> */}
{/*         <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">{t.howItWorks.subtitle}</p> */}
{/*         <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}
{/*           {t.howItWorks.modes.map((mode) => ( */}
{/*             <ModeCard key={mode.title} {...mode} /> */}
{/*           ))} */}
{/*         </div> */}
{/*       </section> */}

      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-200 mb-1">{t.howToHelp.title}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">{t.howToHelp.subtitle}</p>
        <div className={`grid grid-cols-1 ${t.howToHelp.cards.length === 1
          ? 'max-w-md mx-auto w-full'
          : t.howToHelp.cards.length === 2
            ? 'md:grid-cols-2 max-w-2xl mx-auto w-full'
            : 'md:grid-cols-3'
          } gap-4`}>
          {t.howToHelp.cards.map((card, index) => {
            const ctaVariants = [
              'bg-orange-500 text-white hover:bg-orange-600 shadow-sm',
              'bg-[#5865F2] text-white hover:bg-[#4752C4] shadow-sm',
              'bg-brand-500 text-white hover:bg-brand-600 shadow-sm',
            ];

            const cardVariants = [
              'border-orange-500/40 dark:border-orange-500/20 shadow-[0_0_15px_-3px_rgba(249,115,22,0.1)]',
              'border-[#5865F2]/30 dark:border-[#5865F2]/20 shadow-[0_0_15px_-3px_rgba(88,101,242,0.1)]',
              'border-brand-500/50 dark:border-brand-500/30 shadow-[0_0_15px_-3px_rgba(34,197,94,0.1)] dark:shadow-[0_0_20px_-5px_rgba(34,197,94,0.15)]', 
            ];

            return (
              <HelpCard
                key={card.title}
                emoji={card.emoji}
                title={card.title}
                description={card.description}
                ctaClassName={ctaVariants[index]}
                ctaLabel={card.cta}
                kind={card.kind}
                href={card.kind === 'external' ? resolveHref(card.target) : undefined}
                to={card.kind === 'internal' ? card.target : undefined}
                highlight={card.highlight}
                className={cardVariants[index]}
              />
            );
          })}
        </div>
      </section>

      {/* Roadmap σε accordion. Χρονολογική σειρά: ό,τι έχει βγει πάνω, ό,τι
          έρχεται από κάτω, και ο δείκτης «Είμαστε εδώ» στην τρέχουσα έκδοση --
          έτσι φαίνεται με μια ματιά πόσος δρόμος έγινε και πόσος μένει.
          Τα δεδομένα είναι στο content/news.json, το ίδιο αρχείο που
          τροφοδοτεί το κομμάτι «Μόλις μπήκαν» στην Αρχική. */}
      <section id="roadmap" className="scroll-mt-24">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-200 mb-1">{news.roadmap.title}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">{news.roadmap.subtitle}</p>

        <div className="space-y-3">
          {news.releases.map((release) => (
            <ReleaseAccordion
              key={release.version}
              release={release}
              isCurrent={release.version === news.currentVersion}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-200 mb-1">{t.faq.title}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">{t.faq.subtitle}</p>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm divide-y divide-slate-200 dark:divide-slate-800">
        {t.faq.items.map((item, i) => (
          <details key={i} className="group p-5">
            <summary className="flex items-center justify-between cursor-pointer text-slate-900 dark:text-slate-200 font-medium list-none">
              <span>{item.q}</span>
              <span className="text-brand-600 dark:text-brand-400 text-xl transition-transform group-open:rotate-45 select-none">+</span>
            </summary>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-200 mb-1">{t.shortcuts.title}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">{t.shortcuts.subtitle}</p>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <dl className="space-y-3">
            {t.shortcuts.items.map((s, i) => (
              <div key={i} className="flex items-center justify-between gap-4 flex-wrap">
                <dt className="text-sm text-slate-700 dark:text-slate-300">{s.label}</dt>
                <dd className="flex items-center gap-1.5">
                  {s.keys.map((k, j) => <Kbd key={j}>{k}</Kbd>)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

{/*       <section className="text-center py-8 border-t border-slate-200 dark:border-slate-800"> */}
{/*         <p className="text-sm text-slate-500 dark:text-slate-400">{t.footer.tagline}</p> */}
{/*         <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{t.footer.credit}</p> */}
{/*         <Link to="/" className="inline-block mt-4 text-sm text-brand-700 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 font-medium"> */}
{/*           {t.footer.backLink} */}
{/*         </Link> */}
{/*       </section> */}
    </div>
  )
}

/**
 * Μία έκδοση του roadmap. Χρησιμοποιεί <details> αντί για state, όπως και το
 * FAQ παραπάνω: το άνοιγμα/κλείσιμο το χειρίζεται ο browser, δουλεύει με
 * πληκτρολόγιο χωρίς κώδικα, και το Ctrl+F βρίσκει και κλειστό περιεχόμενο.
 *
 * Ανοιχτή από την αρχή είναι μόνο η τρέχουσα έκδοση -- αυτή που ενδιαφέρει
 * κάποιον που μόλις έφτασε εδώ από το κουμπί της Αρχικής.
 */
function ReleaseAccordion({ release, isCurrent }) {
  const shipped = release.status === 'shipped'

  const statusLabel = isCurrent
    ? news.roadmap.status.current
    : shipped
      ? news.roadmap.status.shipped
      : news.roadmap.status.planned

  const statusClass = isCurrent
    ? 'bg-brand-500/10 text-brand-700 dark:text-brand-300 border-brand-500/30'
    : shipped
      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
      : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-400/20'

  return (
    <details
      open={isCurrent}
      className={`group rounded-xl border bg-white dark:bg-slate-900 shadow-sm overflow-hidden ${
        isCurrent
          ? 'border-brand-500/40 dark:border-brand-500/30 ring-1 ring-brand-500/20'
          : 'border-slate-200 dark:border-slate-800'
      }`}
    >
      <summary className="flex items-center gap-3 p-4 cursor-pointer list-none select-none">
        {/* Η κουκκίδα του timeline: γεμάτη για ό,τι έχει βγει, κούφια για ό,τι έρχεται */}
        <span
          aria-hidden="true"
          className={`shrink-0 w-2.5 h-2.5 rounded-full ${
            shipped
              ? 'bg-emerald-500'
              : 'border-2 border-slate-300 dark:border-slate-600'
          }`}
        />

        <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-200 shrink-0">
          v{release.version}
        </span>

        <span className="flex-1 min-w-0 text-sm text-slate-700 dark:text-slate-300 truncate">
          {release.title}
        </span>

        {isCurrent && (
          <span className="hidden sm:inline-flex items-center gap-1 shrink-0 text-[10px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300">
            ← {news.roadmap.currentLabel}
          </span>
        )}

        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusClass}`}>
          {statusLabel}
        </span>

        <span
          aria-hidden="true"
          className="shrink-0 text-brand-600 dark:text-brand-400 text-xl leading-none transition-transform group-open:rotate-45 select-none"
        >
          +
        </span>
      </summary>

      <ul className="px-4 pb-4 pt-1 space-y-3 text-sm border-t border-slate-100 dark:border-slate-800">
        {release.items.map((item) => (
          <RoadmapItem key={item.title} emoji={item.emoji}>
            <span className="font-medium text-slate-900 dark:text-slate-200">{item.title}</span>
            {' — '}
            {item.body}
          </RoadmapItem>
        ))}
      </ul>
    </details>
  )
}

export default Info