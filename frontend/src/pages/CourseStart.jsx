import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { coursesApi, questionsApi } from '../lib/api'
import { useTestStore } from '../store/testStore'
import BackButton from '../components/BackButton'

const TIMER_OPTIONS = [
  { value: null, label: 'Χωρίς χρονόμετρο' },
  { value: 5 * 60, label: '5 λεπτά' },
  { value: 10 * 60, label: '10 λεπτά' },
  { value: 15 * 60, label: '15 λεπτά' },
  { value: 30 * 60, label: '30 λεπτά' },
]

const TIPS = [
  'Ξεκίνα με μικρό τεστ (5–10 ερωτήσεις) για να εκτιμήσεις πού βρίσκεσαι.',
  'Αν δεν ξέρεις, πέρνα παρακάτω και γύρνα στο τέλος — μην χάνεις χρόνο.',
  'Πρόσεξε απόλυτες λέξεις («πάντα», «ποτέ», «μόνο») — συχνά είναι λάθος.',
  'Πριν την εξεταστική, βάλε timer στα όρια της εξέτασης για ρεαλιστικό warm-up.',
]

function CourseStart() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const startSession = useTestStore((s) => s.startSession)

  const [course, setCourse] = useState(null)
  const [availableQuestions, setAvailableQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Tab State: 'systematic' (Fixed sets of 25) vs 'sandbox' (Custom configuration)
  const [activeTab, setActiveTab] = useState('systematic')

  // Sandbox config
  const [count, setCount] = useState(10)
  const [durationSeconds, setDurationSeconds] = useState(null)

  // Local storage persistence of completed systematic study sets
  const [completedSets, setCompletedSets] = useState({})

  useEffect(() => {
    try {
      const saved = localStorage.getItem('octopus_completed_sets')
      if (saved) {
        const data = JSON.parse(saved)
        setCompletedSets(data[courseId] || {})
      }
    } catch (e) {
      console.error('Failed to load completed sets', e)
    }
  }, [courseId])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    Promise.all([
      coursesApi.list(),
      questionsApi.listByCourse(courseId),
    ])
      .then(([courses, questions]) => {
        if (cancelled) return
        const found = courses.find((c) => String(c.id) === String(courseId))
        setCourse(found || null)
        setAvailableQuestions(questions)
        const max = questions.length
        if (max > 0) setCount(Math.min(10, max))
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Σφάλμα φόρτωσης')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [courseId])

  const max = availableQuestions.length
  const canStart = max > 0 && count >= 1 && count <= max

  // Fixed set constants
  const SET_SIZE = 25
  const totalSets = Math.ceil(max / SET_SIZE)

  // Partition questions into sets
  const sets = useMemo(() => {
    const result = []
    for (let i = 0; i < totalSets; i++) {
      const startIdx = i * SET_SIZE
      const endIdx = Math.min((i + 1) * SET_SIZE, max)
      result.push({
        index: i,
        start: startIdx + 1,
        end: endIdx,
        questions: availableQuestions.slice(startIdx, endIdx),
      })
    }
    return result
  }, [availableQuestions, totalSets, max])

  // Syllabus coverage progress based on unique questions completed
  const coveragePercentage = useMemo(() => {
    if (max === 0) return 0
    let coveredCount = 0
    sets.forEach((set) => {
      if (completedSets[set.index]) {
        coveredCount += set.questions.length
      }
    })
    return Math.round((coveredCount / max) * 100)
  }, [sets, completedSets, max])

  // Custom sandbox launch
  function handleStart() {
    if (!canStart) return
    const selected = availableQuestions.slice(0, count)
    startSession({
      courseId: Number(courseId),
      courseName: course?.name || `Μάθημα ${courseId}`,
      count,
      durationSeconds,
      order: 'sequential',
      questions: selected,
      setIndex: null, // custom sandbox
    })
    navigate(`/test/${courseId}`)
  }

  // Systematic Set launch
  function handleStartSet(set) {
    startSession({
      courseId: Number(courseId),
      courseName: course?.name || `Μάθημα ${courseId}`,
      count: set.questions.length,
      durationSeconds: null,
      order: 'sequential',
      questions: set.questions,
      setIndex: set.index,
    })
    navigate(`/test/${courseId}`)
  }

  return (
    <div>
      <div className="mb-6">
        <BackButton to="/courses" label="Πίσω στα μαθήματα" />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {course ? course.name : `Μάθημα ${courseId}`}
        </h1>
        {course && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Κωδικός: {course.id} · Εξάμηνο: {course.semester}
          </p>
        )}
      </div>

      {loading && (
        <p className="text-slate-500 dark:text-slate-400">Φόρτωση…</p>
      )}

      {error && !loading && (
        <div className="rounded-md bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 p-4 text-rose-700 dark:text-rose-300">
          {error}
        </div>
      )}

      {!loading && !error && max === 0 && (
        <div className="rounded-lg bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-1">
            Αυτό το μάθημα δεν έχει ακόμα ερωτήσεις.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Δοκίμασε ξανά αργότερα ή διάλεξε άλλο μάθημα.
          </p>
        </div>
      )}

      {!loading && !error && max > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tabs for Systematic Study vs Custom Sandbox */}
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
                🎯 Συστηματική Μελέτη
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
                ⚙️ Προσαρμοσμένο Τεστ
              </button>
            </div>

            {activeTab === 'systematic' ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
                
                {/* Educational Explanation Box */}
                <div className="rounded-lg bg-brand-50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900/60 p-4">
                  <h3 className="font-semibold text-brand-900 dark:text-brand-300 text-sm mb-1">
                    💡 Πώς λειτουργεί η Συστηματική Μελέτη;
                  </h3>
                  <p className="text-xs text-brand-850 dark:text-brand-400 leading-relaxed">
                    Η τελική εξέταση του μαθήματος αποτελείται από 25 ερωτήσεις. Χωρίσαμε τις συνολικά <strong>{max}</strong> ερωτήσεις του μαθήματος σε <strong>{totalSets}</strong> σταθερά, μη-επικαλυπτόμενα σετ. Ολοκληρώνοντας όλα τα σετ, εξασφαλίζεις ότι έχεις δει το <strong>100% της ύλης</strong>, χωρίς τυχαίες παραλείψεις ή επαναλήψεις!
                  </p>
                </div>

                {/* Syllabus Coverage Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Συνολική Κάλυψη Ύλης
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
                      ? 'Συγχαρητήρια! Έχεις καλύψει ολόκληρη την ύλη του μαθήματος!'
                      : 'Ολοκλήρωσε όλα τα παρακάτω σετ για να φτάσεις στο 100%.'}
                  </p>
                </div>

                {/* Fixed Sets Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {sets.map((set) => {
                    const completed = completedSets[set.index]
                    return (
                      <div
                        key={set.index}
                        className={`flex flex-col rounded-lg border p-4 shadow-sm transition-all ${
                          completed
                            ? 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-250 dark:border-slate-800'
                            : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-850 hover:border-brand-300 dark:hover:border-brand-700'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                              Σετ {set.index + 1}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              Ερωτήσεις {set.start} - {set.end} ({set.questions.length} σύνολο)
                            </p>
                          </div>
                          {completed && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-450 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                              ✓ {completed.score}/{completed.total}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleStartSet(set)}
                          className={`mt-auto w-full py-2 rounded-md text-xs font-semibold shadow-sm transition-all cursor-pointer ${
                            completed
                              ? 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                              : 'bg-brand-600 hover:bg-brand-700 text-white'
                          }`}
                        >
                          {completed ? 'Επανάληψη Σετ' : 'Έναρξη Σετ'}
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
                    Ρυθμίσεις Προσαρμοσμένου Τεστ
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Διαμόρφωσε τις ρυθμίσεις της προπόνησής σου ελεύθερα.
                  </p>
                </header>

                <div className="px-6 py-5 space-y-6">
                  {coveragePercentage < 100 && (
                    <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/60 p-4">
                      <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                        ⚠️ <strong>Προσοχή:</strong> Δεν έχεις καλύψει ακόμα το 100% της ύλης του μαθήματος. Συστήνεται να ολοκληρώσεις πρώτα τη <strong>Συστηματική Μελέτη</strong> για να σιγουρευτείς ότι έχεις διαβάσει όλες τις ερωτήσεις!
                      </p>
                    </div>
                  )}

                  <section>
                    <div className="flex items-baseline justify-between mb-3">
                      <label htmlFor="count" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Πλήθος ερωτήσεων
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
                        Όλες ({max})
                      </button>
                      <span>{max}</span>
                    </div>
                  </section>

                  <section>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
                      Χρονόμετρο
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {TIMER_OPTIONS.map((opt) => (
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
                    disabled={!canStart}
                    className="px-5 py-2.5 rounded-md bg-brand-600 hover:bg-brand-700 disabled:bg-brand-600/50 disabled:cursor-not-allowed text-white font-medium shadow-sm transition-colors cursor-pointer"
                  >
                    Ξεκίνα τεστ
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
          <span aria-hidden="true">📊</span>
          Πληροφορίες μαθήματος
        </h2>
      </header>
      <dl className="px-5 py-4 space-y-3 text-sm">
        <InfoRow label="Διαθέσιμες ερωτήσεις">
          <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
            {questionCount}
          </span>
        </InfoRow>
        <InfoRow label="Κάλυψη ύλης">
          <span className="font-semibold text-brand-600 dark:text-brand-400 tabular-nums">
            {coverage}%
          </span>
        </InfoRow>
        {course && (
          <>
            <InfoRow label="Κωδικός">
              <span className="text-slate-700 dark:text-slate-300 tabular-nums">{course.id}</span>
            </InfoRow>
            <InfoRow label="Εξάμηνο">
              <span className="text-slate-700 dark:text-slate-300">{course.semester}</span>
            </InfoRow>
          </>
        )}
        <InfoRow label="Τελευταία εξεταστική" muted>
          <SoonBadge />
        </InfoRow>
        <InfoRow label="Πρόσφατες προσθήκες" muted>
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
          <span aria-hidden="true">💡</span>
          Συμβουλές για το τεστ
        </h2>
      </header>
      <ol className="px-5 py-4 space-y-3">
        {TIPS.map((tip, i) => (
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
      Σύντομα
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
