// Home / landing page (hero with quiz preview, how-it-works stepper). Route: /
import { Link } from 'react-router-dom'
import { useHomeStats } from '../hooks/queries'
import t from '../content/home.json'

// MOCK — see the POPULAR section below for why. Mirrors CourseResponseDto plus
// the two counters the card needs, so the swap to real data is a one-liner.
const MOCK_POPULAR = [
  { id: 1101, name: 'Μαθηματικά Ι', semester: 1, questionCount: 184, updatedLabel: 'πριν 2 μέρες' },
  { id: 1102, name: 'Δομημένος Προγραμματισμός', semester: 1, questionCount: 142, updatedLabel: 'πριν 5 μέρες' },
  { id: 1104, name: 'Ηλεκτρονική Φυσική', semester: 1, questionCount: 96, updatedLabel: 'πριν 1 εβδομάδα' },
]

function Home() {
  const stats = useHomeStats()

  const hasStats = stats.tests != null || stats.courses != null || stats.users != null

  return (
    <div>
      {/* HERO — copy left, live quiz preview right.
          overflow-hidden because the glow sits on -inset-6, so on narrow screens
          it reaches past the viewport and pushes out a horizontal scrollbar.
          Clipping a blurred, low-opacity decoration is invisible. */}
      <section className="pt-10 sm:pt-14 lg:pt-20 pb-14 overflow-hidden">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-6 text-center lg:text-left animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 dark:border-brand-900 bg-brand-50 dark:bg-brand-950/40 px-3 py-1 text-xs font-semibold text-brand-700 dark:text-brand-300">
              {t.hero.badge}
            </span>

            <h1 className="mt-5 text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-[1.1]">
              {t.hero.titlePrefix}{' '}
              {/* The highlight is painted behind the text so the letters keep
                  full contrast in both themes. */}
              <span className="relative inline-block">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-1 h-3 sm:h-4 bg-brand-400/40 dark:bg-brand-500/30 -rotate-1 rounded-sm"
                />
                <span className="relative">{t.hero.titleHighlight}</span>
              </span>
              ,{' '}{t.hero.titleSuffix}{' '}
              <span className="text-brand-600 dark:text-brand-400">{t.hero.brand}</span>
            </h1>

            <p className="mt-5 text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
              {t.hero.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
              <Link
                to="/courses"
                className="group inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 active:translate-y-px text-white font-semibold px-6 py-3 rounded-xl shadow-md shadow-brand-600/20 transition-all"
              >
                {t.hero.ctaPractice}
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center px-6 py-3 rounded-xl font-semibold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {t.hero.ctaHow}
              </a>
            </div>

            {hasStats && (
              <div className="mt-10 flex flex-wrap gap-8 sm:gap-10 justify-center lg:justify-start">
                {stats.tests != null && <HeroStat value={stats.tests} label={t.hero.statTests} />}
                {stats.courses != null && <HeroStat value={stats.courses} label={t.hero.statCourses} />}
                {stats.users != null && <HeroStat value={stats.users} label={t.hero.statUsers} />}
              </div>
            )}
          </div>

          <div className="lg:col-span-6 animate-fade-up" style={{ animationDelay: '0.12s' }}>
            <QuizPreview />
          </div>
        </div>
      </section>

      {/* POPULAR — mock until "popular" is a real measure.
          Ranking by plays needs a course_id on `bundles`, which does not exist
          yet, so nothing real can back this section today. The shape below is
          what the endpoint should return, so swapping MOCK_POPULAR for a query
          is the only change this section will need. */}
      <section className="py-14 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
              {t.popular.eyebrow}
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
              {t.popular.title}
            </h2>
          </div>
          <Link
            to="/courses"
            className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
          >
            {t.popular.allLink} →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_POPULAR.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* EXAM SIMULATION — every claim here maps to shipped behaviour:
          the countdown in Test, useTestKeyboard, FlagButton, and the review on
          Results. Nothing aspirational, so the page cannot promise more than
          the product delivers. */}
      <section className="py-14">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-brand-50 to-white dark:from-brand-950/40 dark:to-slate-900 p-6 sm:p-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center rounded-full border border-brand-200 dark:border-brand-900 bg-white/70 dark:bg-slate-900/60 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand-700 dark:text-brand-300">
                {t.simulation.eyebrow}
              </span>

              <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                {t.simulation.title}
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.simulation.body}
              </p>

              <dl className="mt-8 grid sm:grid-cols-2 gap-x-6 gap-y-5">
                {t.simulation.features.map((feature) => (
                  <div key={feature.title} className="flex gap-3">
                    <span aria-hidden="true" className="text-lg leading-none mt-0.5">{feature.icon}</span>
                    <div className="min-w-0">
                      <dt className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {feature.title}
                      </dt>
                      <dd className="mt-0.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {feature.body}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>

              <Link
                to="/courses"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-600/20 transition-colors"
              >
                {t.simulation.cta}
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-lg">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Keyboard shortcuts
              </p>
              <ul className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
                {t.simulation.shortcuts.map((shortcut) => (
                  <li key={shortcut.keys} className="flex items-center justify-between gap-4 py-2.5">
                    <span className="text-sm text-slate-600 dark:text-slate-300">{shortcut.label}</span>
                    <kbd className="shrink-0 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 font-mono text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm">
                      {shortcut.keys}
                    </kbd>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — connected numbered stepper.
          scroll-mt clears the sticky header when the hero link jumps here. */}
      <section
        id="how-it-works"
        className="scroll-mt-24 border-t border-slate-200 dark:border-slate-800 py-16 lg:py-20 animate-fade-up"
        style={{ animationDelay: '0.16s' }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-200 mb-12 text-center">
          {t.howItWorks.title}
        </h2>

        <div className="max-w-4xl mx-auto px-4">
          <div className="relative isolate">
            {/* Η οριζόντια γραμμή (desktop) παραμένει στη θέση της, κρυμμένη πίσω από τα νούμερα */}
            <div
              aria-hidden="true"
              className="hidden md:block absolute top-7 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-brand-300 via-brand-400 to-brand-300 dark:from-brand-800 dark:via-brand-700 dark:to-brand-800 -z-10"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              {t.howItWorks.steps.map((step, i) => (
                <Step 
                  key={step.number} 
                  number={i + 1} 
                  title={step.title} 
                  body={step.body} 
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function HeroStat({ value, label }) {
  return (
    <div className="text-center lg:text-left">
      <p className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
        {value.toLocaleString('el-GR')}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[9rem]">{label}</p>
    </div>
  )
}

function CourseCard({ course }) {
  return (
    <Link
      to={`/courses/${course.id}/start`}
      className="group flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:border-brand-400 dark:hover:border-brand-600 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          {course.semester}ο εξάμηνο
        </span>
        <span
          aria-hidden="true"
          className="text-slate-300 dark:text-slate-600 group-hover:text-brand-500 transition-colors"
        >
          ↗
        </span>
      </div>

      <h3 className="mt-2 font-bold text-slate-900 dark:text-slate-100 leading-snug">
        {course.name}
      </h3>

      <div className="mt-auto pt-4 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span className="font-semibold text-brand-600 dark:text-brand-400 tabular-nums">
          {course.questionCount.toLocaleString('el-GR')} {t.popular.questions}
        </span>
        <span>{course.updatedLabel}</span>
      </div>
    </Link>
  )
}

/*
 * A frozen moment from a real quiz: the answered state, with the correct option
 * marked and the explanation open. It sells the product better than a logo
 * because it shows what the page actually does. Purely decorative — no data,
 * no interaction — so it stays out of the tab order.
 */
function QuizPreview() {
  const demo = t.hero.demo

  return (
    <div className="relative mx-auto max-w-md lg:max-w-full">
      <div
        aria-hidden="true"
        className="absolute -inset-6 rounded-[2.5rem] bg-brand-400/20 dark:bg-brand-500/10 blur-2xl"
      />
      <div className="relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            {demo.course}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
            <span aria-hidden="true">⏱</span>
            {demo.timer}
          </span>
        </div>

        <p className="mt-4 text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 leading-snug">
          {demo.question}
        </p>
        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{demo.progress}</p>

        <ul className="mt-4 space-y-2">
          {demo.options.map((option) => {
            const isCorrect = option.key === demo.correctKey
            return (
              <li
                key={option.key}
                className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                  isCorrect
                    ? 'border-emerald-500/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300'
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                    isCorrect
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                  aria-hidden="true"
                >
                  {isCorrect ? '✓' : option.key}
                </span>
                <span className="font-mono">{option.text}</span>
              </li>
            )
          })}
        </ul>

        <p className="mt-4 rounded-xl border border-brand-200 dark:border-brand-900 bg-brand-50 dark:bg-brand-950/40 px-3 py-2.5 text-[11px] leading-relaxed text-brand-800 dark:text-brand-200">
          {demo.explanation}
        </p>
      </div>
    </div>
  )
}

function Step({ number, title, body }) {
  return (
    <div className="text-center">
      {/* Αντί για Icon, τώρα έχουμε ένα καθαρό, έντονο νούμερο */}
      <div className="relative z-10 mx-auto w-14 h-14 rounded-full bg-white dark:bg-slate-900 border-2 border-brand-500 dark:border-brand-600 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-sm font-bold text-lg select-none">
        {number}
      </div>
      <h3 className="mt-5 font-semibold text-slate-900 dark:text-slate-200 text-lg">{title}</h3>
      <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
        {body}
      </p>
    </div>
  )
}

export default Home