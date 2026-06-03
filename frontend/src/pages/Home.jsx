import { Link } from 'react-router-dom'
import t from '../content/home.json'

function Home() {
  return (
    <div className="space-y-20">
      <section className="text-center pt-12 pb-8">
        <div className="text-6xl mb-4">🐙</div>
        <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
          {t.hero.titlePrefix}{' '}
          <span className="text-brand-600 dark:text-brand-400">{t.hero.brand}</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
          {t.hero.subtitle}
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            to="/courses"
            className="inline-block bg-brand-600 hover:bg-brand-700 text-white font-medium px-6 py-3 rounded-md transition-colors shadow-sm"
          >
            {t.hero.ctaPractice}
          </Link>
          <Link
            to="/admin"
            className="inline-block bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-brand-700 dark:text-brand-300 font-medium px-6 py-3 rounded-md transition-colors border border-slate-200 dark:border-slate-700"
          >
            {t.hero.ctaManage}
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">
          {t.howItWorks.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.howItWorks.steps.map((step) => (
            <Step key={step.number} number={step.number} title={step.title} body={step.body} />
          ))}
        </div>
      </section>

      {/* <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">
          {t.comingSoon.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {t.comingSoon.cards.map((card) => (
            <FeatureCard key={card.title} emoji={card.emoji} title={card.title} body={card.body} />
          ))}
        </div>
      </section> */}
    </div>
  )
}

function Step({ number, title, body }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 font-bold flex items-center justify-center mb-4">
        {number}
      </div>
      <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{body}</p>
    </div>
  )
}

function FeatureCard({ emoji, title, body }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="text-3xl mb-3">{emoji}</div>
      <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{body}</p>
    </div>
  )
}

export default Home
