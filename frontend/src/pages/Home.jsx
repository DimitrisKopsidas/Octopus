// Home / landing page (asymmetric hero, live stats band, how-it-works stepper). Route: /
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { coursesApi, bundlesApi } from '../lib/api'
import logo from '../assets/hero.png'
import t from '../content/home.json'

function Home() {
  const [stats, setStats] = useState({ tests: null, courses: null })

  useEffect(() => {
    bundlesApi.count().then((v) => setStats((s) => ({ ...s, tests: v }))).catch(() => {})
    coursesApi.countWithContent().then((v) => setStats((s) => ({ ...s, courses: v }))).catch(() => {})
  }, [])

  const hasStats = stats.tests != null || stats.courses != null

  return (
    <div>
      {/* HERO — asymmetric: copy left, brand visual right */}
      <section className="pt-10 sm:pt-14 lg:pt-20 pb-16">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-6 items-center">
          <div className="lg:col-span-7 text-center lg:text-left animate-fade-up">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-200 leading-[1.1]">
              {t.hero.titlePrefix}{' '}
              <span className="text-brand-600 dark:text-brand-400">{t.hero.brand}</span>
            </h1>
            <p className="mt-5 text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
              {t.hero.subtitle}
            </p>
            <div className="mt-8 flex justify-center lg:justify-start">
              <Link
                to="/courses"
                className="group inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 active:translate-y-px text-white font-semibold px-6 py-3 rounded-md shadow-sm transition-all"
              >
                {t.hero.ctaPractice}
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 animate-fade-up" style={{ animationDelay: '0.12s' }}>
            <div className="relative mx-auto max-w-sm">
              {/* soft brand glow (inner, not neon) */}
              <div
                aria-hidden="true"
                className="absolute -inset-6 rounded-[2.5rem] bg-brand-400/20 dark:bg-brand-500/10 blur-2xl"
              />
              <div className="relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-brand-50 to-white dark:from-brand-950/40 dark:to-slate-900 p-10 sm:p-12 flex items-center justify-center shadow-sm">
                <img src={logo} alt="Octopus" className="w-36 h-36 sm:w-44 sm:h-44 animate-float" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS — divider band, not cards */}
      {hasStats && (
        <section className="border-y border-slate-200 dark:border-slate-800 py-10">
          <p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 mb-6">
            {t.hero.statHeading}
          </p>
          <div className="flex items-stretch justify-center divide-x divide-slate-200 dark:divide-slate-800">
            {stats.tests != null && <HeroStat value={stats.tests} label={t.hero.statTests} />}
            {stats.courses != null && <HeroStat value={stats.courses} label={t.hero.statCourses} />}
          </div>
        </section>
      )}

      {/* HOW IT WORKS — connected numbered stepper */}
      <section className="py-16 lg:py-20 animate-fade-up" style={{ animationDelay: '0.16s' }}>
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
    <div className="text-center px-8 sm:px-12">
      <p className="text-4xl sm:text-5xl font-bold text-brand-600 dark:text-brand-400 tabular-nums">
        {value}
      </p>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">{label}</p>
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