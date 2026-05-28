import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { coursesApi, questionsApi } from '../lib/api'
import { useTestStore } from '../store/testStore'
import BackButton from '../components/BackButton'
import t from '../content/courseStart.json'

const TIMER_PRESET_MINUTES = [null, 5, 10, 15, 30]

function CourseStart() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const startSession = useTestStore((s) => s.startSession)

  const [course, setCourse] = useState(null)
  const [settings, setSettings] = useState(null) // { totalQuestionCount, setQuestionCount, defaultTimerMinutes }
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [starting, setStarting] = useState(false)

  const [activeTab, setActiveTab] = useState('systematic')
  const [count, setCount] = useState(10)
  const [durationSeconds, setDurationSeconds] = useState(null)

  // Completed sets will come from the user model (backend) — interface only for now.
  const completedSets = {}

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    Promise.all([
      coursesApi.list(),
      questionsApi.settingsInfo(courseId),
    ])
      .then(([courses, info]) => {
        if (cancelled) return
        const found = courses.find((c) => String(c.id) === String(courseId))
        setCourse(found || null)
        setSettings(info)
        const total = info.totalQuestionCount || 0
        if (total > 0) setCount(Math.min(10, total))
        if (info.defaultTimerMinutes) {
          setDurationSeconds(info.defaultTimerMinutes * 60)
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || t.errorLoad)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [courseId])

  const max = settings?.totalQuestionCount || 0
  const SET_SIZE = settings?.setQuestionCount || 25
  const canStart = max > 0 && count >= 1 && count <= max
  const totalSets = Math.ceil(max / SET_SIZE)

  const sets = useMemo(
    () =>
      Array.from({ length: totalSets }, (_, i) => ({
        index: i,
        start: i * SET_SIZE + 1,
        end: Math.min((i + 1) * SET_SIZE, max),
        count: Math.min(SET_SIZE, max - i * SET_SIZE),
      })),
    [totalSets, SET_SIZE, max]
  )

  const coveragePercentage = useMemo(() => {
    if (max === 0) return 0
    let covered = 0
    sets.forEach((s) => { if (completedSets[s.index]) covered += s.count })
    return Math.round((covered / max) * 100)
  }, [sets, completedSets, max])

  // Timer options: presets + the course's default (if not already in presets)
  const timerOptions = useMemo(() => {
    const minutesSet = new Set(TIMER_PRESET_MINUTES)
    if (settings?.defaultTimerMinutes != null) {
      minutesSet.add(settings.defaultTimerMinutes)
    }
    const minutes = [...minutesSet].sort((a, b) => {
      if (a == null) return -1
      if (b == null) return 1
      return a - b
    })
    return minutes.map((m) => ({
      value: m == null ? null : m * 60,
      label: m == null ? t.sandbox.timerNone : t.sandbox.timerMinutesTemplate.replace('{minutes}', m),
    }))
  }, [settings])

  async function handleStart() {
    if (!canStart || starting) return
    setStarting(true)
    setError(null)
    try {
      const questions = await questionsApi.byRandomCount(courseId, count)
      startSession({
        courseId: Number(courseId),
        courseName: course?.name || t.fallbackTitle.replace('{courseId}', courseId),
        count,
        durationSeconds,
        order: 'random',
        questions,
        setIndex: null,
      })
      navigate(`/test/${courseId}`)
    } catch (err) {
      setError(err.message || t.errorStartTest)
      setStarting(false)
    }
  }

  async function handleStartSet(set) {
    if (starting) return
    setStarting(true)
    setError(null)
    try {
      const questions = await questionsApi.bySetNum(courseId, set.index)
      const timerSec = settings?.defaultTimerMinutes
        ? settings.defaultTimerMinutes * 60
        : null
      startSession({
        courseId: Number(courseId),
        courseName: course?.name || t.fallbackTitle.replace('{courseId}', courseId),
        count: set.count,
        durationSeconds: timerSec,
        order: 'sequential',
        questions,
        setIndex: set.index,
      })
      navigate(`/test/${courseId}`)
    } catch (err) {
      setError(err.message || t.errorStartSet)
      setStarting(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <BackButton to="/courses" label={t.backLabel} />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {course ? course.name : t.fallbackTitle.replace('{courseId}', courseId)}
        </h1>
        {course && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.subheader.replace('{id}', course.id).replace('{semester}', course.semester)}
          </p>
        )}
      </div>

      {loading && (
        <p className="text-slate-500 dark:text-slate-400">{t.loading}</p>
      )}

      {error && !loading && (
        <div className="rounded-md bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 p-4 text-rose-700 dark:text-rose-300">
          {error}
        </div>
      )}

      {!loading && !error && max === 0 && (
        <div className="rounded-lg bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-1">{t.emptyCourse.title}</p>
          <p className="text-sm text-slate-500 dark:text-slate-500">{t.emptyCourse.hint}</p>
        </div>
      )}

      {!loading && !error && max > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2 space-y-6">

            <div className="flex border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-1 gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('systematic')}
                className={`flex-1 text-center py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'systematic'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                {t.tabs.systematic}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('sandbox')}
                className={`flex-1 text-center py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'sandbox'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                {t.tabs.sandbox}
              </button>
            </div>

            {activeTab === 'systematic' ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
                <div className="rounded-lg bg-brand-50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900/60 p-4">
                  <h3 className="font-semibold text-brand-900 dark:text-brand-300 text-sm mb-1">
                    {t.systematic.explanationTitle}
                  </h3>
                  <p className="text-xs text-brand-800 dark:text-brand-400 leading-relaxed">
                    {t.systematic.explanationTemplate
                      .replace('{setSize}', SET_SIZE)
                      .replace('{total}', max)
                      .replace('{totalSets}', totalSets)}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      {t.systematic.coverageLabel}
                    </span>
                    <span className="text-xl font-bold text-brand-600 dark:text-brand-400 tabular-nums">
                      {coveragePercentage}% {coveragePercentage === 100 && '🏆'}
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
                    <div
                      className="h-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-500 rounded-full"
                      style={{ width: `${coveragePercentage}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {coveragePercentage === 100
                      ? t.systematic.coverageDone
                      : t.systematic.coveragePending}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {sets.map((set) => {
                    const completed = completedSets[set.index]
                    return (
                      <div
                        key={set.index}
                        className={`flex flex-col rounded-lg border p-4 shadow-sm transition-all ${
                          completed
                            ? 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-300 dark:border-slate-800'
                            : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                              {t.systematic.setLabel} {set.index + 1}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {t.systematic.setRangeTemplate
                                .replace('{start}', set.start)
                                .replace('{end}', set.end)
                                .replace('{count}', set.count)}
                            </p>
                            {settings?.defaultTimerMinutes != null && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 inline-flex items-center gap-1">
                                <span aria-hidden="true">⏱</span>
                                {t.systematic.setTimerTemplate.replace('{minutes}', settings.defaultTimerMinutes)}
                              </p>
                            )}
                          </div>
                          {completed && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                              ✓ {completed.score}/{completed.total}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleStartSet(set)}
                          disabled={starting}
                          className={`mt-auto w-full py-2 rounded-md text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                            completed
                              ? 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                              : 'bg-brand-600 hover:bg-brand-700 text-white'
                          }`}
                        >
                          {starting ? t.systematic.loadingSet : completed ? t.systematic.repeatSet : t.systematic.startSet}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <header className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
                  <h2 className="font-semibold text-slate-900 dark:text-white text-sm">
                    {t.sandbox.title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {t.sandbox.subtitle}
                  </p>
                </header>

                <div className="px-6 py-5 space-y-6">
                  {coveragePercentage < 100 && (
                    <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/60 p-4">
                      <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                        {t.sandbox.warningTemplate}
                      </p>
                    </div>
                  )}

                  <section>
                    <div className="flex items-baseline justify-between mb-3">
                      <label htmlFor="count" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {t.sandbox.countLabel}
                      </label>
                      <span className="text-2xl font-bold text-brand-600 dark:text-brand-400 tabular-nums">
                        {count}
                      </span>
                    </div>
                    <input
                      id="count"
                      type="range"
                      min={1}
                      max={max}
                      value={count}
                      onChange={(e) => setCount(Number(e.target.value))}
                      className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-800 appearance-none cursor-pointer accent-brand-600"
                    />
                    <div className="flex items-center justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>1</span>
                      <button
                        type="button"
                        onClick={() => setCount(max)}
                        className="text-brand-700 dark:text-brand-400 font-medium hover:text-brand-800 dark:hover:text-brand-300"
                      >
                        {t.sandbox.allLabelTemplate.replace('{max}', max)}
                      </button>
                      <span>{max}</span>
                    </div>
                  </section>

                  <section>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
                      {t.sandbox.timerLabel}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {timerOptions.map((opt) => (
                        <TimerOption
                          key={String(opt.value)}
                          label={opt.label}
                          active={durationSeconds === opt.value}
                          onClick={() => setDurationSeconds(opt.value)}
                        />
                      ))}
                    </div>
                  </section>
                </div>

                <footer className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                  <button
                    type="button"
                    onClick={handleStart}
                    disabled={!canStart || starting}
                    className="px-5 py-2.5 rounded-md bg-brand-600 hover:bg-brand-700 disabled:bg-brand-600/50 disabled:cursor-not-allowed text-white font-medium shadow-sm transition-colors cursor-pointer"
                  >
                    {starting ? t.sandbox.startingButton : t.sandbox.startButton}
                  </button>
                </footer>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <CourseInfoCard course={course} questionCount={max} coverage={coveragePercentage} />
            <TipsCard />
          </aside>
        </div>
      )}
    </div>
  )
}

function CourseInfoCard({ course, questionCount, coverage }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <header className="px-5 py-3 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          {t.info.title}
        </h2>
      </header>
      <dl className="px-5 py-4 space-y-3 text-sm">
        <InfoRow label={t.info.availableQuestions}>
          <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
            {questionCount}
          </span>
        </InfoRow>
        <InfoRow label={t.info.coverage}>
          <span className="font-semibold text-brand-600 dark:text-brand-400 tabular-nums">
            {coverage}%
          </span>
        </InfoRow>
        {course && (
          <>
            <InfoRow label={t.info.code}>
              <span className="text-slate-700 dark:text-slate-300 tabular-nums">{course.id}</span>
            </InfoRow>
            <InfoRow label={t.info.semester}>
              <span className="text-slate-700 dark:text-slate-300">{course.semester}</span>
            </InfoRow>
          </>
        )}
        <InfoRow label={t.info.lastExam} muted>
          <SoonBadge />
        </InfoRow>
        <InfoRow label={t.info.recentAdditions} muted>
          <SoonBadge />
        </InfoRow>
      </dl>
    </div>
  )
}

function TipsCard() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <header className="px-5 py-3 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          {t.tipsCard.title}
        </h2>
      </header>
      <ol className="px-5 py-4 space-y-3">
        {t.tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-3 text-sm">
            <span className="shrink-0 w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-bold flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {tip}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function InfoRow({ label, children, muted }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className={`text-xs uppercase tracking-wider font-medium ${muted ? 'text-slate-400 dark:text-slate-500' : 'text-slate-500 dark:text-slate-400'}`}>
        {label}
      </dt>
      <dd>{children}</dd>
    </div>
  )
}

function SoonBadge() {
  return (
    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
      {t.info.soonBadge}
    </span>
  )
}

function TimerOption({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? 'bg-brand-600 text-white shadow-sm'
          : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-600 hover:text-brand-700 dark:hover:text-brand-300'
      }`}
    >
      {label}
    </button>
  )
}

export default CourseStart
