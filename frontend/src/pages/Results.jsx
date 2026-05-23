import { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTestStore } from '../store/testStore'
import BackButton from '../components/BackButton'

function Results() {
  const { courseId } = useParams()
  const navigate = useNavigate()

  const questions = useTestStore((s) => s.questions)
  const sessionCourseId = useTestStore((s) => s.courseId)
  const answers = useTestStore((s) => s.answers)
  const startedAt = useTestStore((s) => s.startedAt)
  const endedAt = useTestStore((s) => s.endedAt)
  const courseName = useTestStore((s) => s.courseName)
  const setIndex = useTestStore((s) => s.setIndex)
  const reset = useTestStore((s) => s.reset)

  const hasResults =
    sessionCourseId != null &&
    String(sessionCourseId) === String(courseId) &&
    questions.length > 0 &&
    endedAt != null

  // Guard: if no completed session, bounce to start
  useEffect(() => {
    if (!hasResults) {
      navigate(`/courses/${courseId}/start`, { replace: true })
    }
  }, [hasResults, courseId, navigate])

  const { correctCount, total, durationMs } = useMemo(() => {
    let correct = 0
    for (const q of questions) {
      const chosen = answers[q.id]
      const correctAnswer = q.answers.find((a) => a.isCorrect)
      if (correctAnswer && chosen === correctAnswer.id) correct += 1
    }
    return {
      correctCount: correct,
      total: questions.length,
      durationMs: endedAt && startedAt ? endedAt - startedAt : 0,
    }
  }, [questions, answers, startedAt, endedAt])

  // Persist completed systematic study sets to localStorage
  useEffect(() => {
    if (hasResults && setIndex !== null) {
      try {
        const saved = localStorage.getItem('octopus_completed_sets')
        const data = saved ? JSON.parse(saved) : {}
        if (!data[courseId]) {
          data[courseId] = {}
        }
        data[courseId][setIndex] = {
          score: correctCount,
          total: total,
          date: Date.now(),
        }
        localStorage.setItem('octopus_completed_sets', JSON.stringify(data))
      } catch (e) {
        console.error('Failed to save set progress', e)
      }
    }
  }, [hasResults, setIndex, courseId, correctCount, total])

  function tryAgain() {
    reset()
    navigate(`/courses/${courseId}/start`)
  }

  if (!hasResults) return null

  const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0
  const scoreTone =
    percent >= 80
      ? 'text-emerald-600 dark:text-emerald-400'
      : percent >= 50
        ? 'text-amber-600 dark:text-amber-400'
        : 'text-rose-600 dark:text-rose-400'

  return (
    <div>
      <div className="mb-6">
        <BackButton to="/courses" label="Πίσω στα μαθήματα" />
      </div>

      <div className="mb-8">
        <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-1">
          {courseName}
        </p>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Αποτελέσματα</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Σωστές απαντήσεις">
          <span className={`text-3xl font-bold ${scoreTone}`}>
            {correctCount}/{total}
          </span>
        </StatCard>
        <StatCard label="Ποσοστό επιτυχίας">
          <span className={`text-3xl font-bold ${scoreTone}`}>{percent}%</span>
        </StatCard>
        <StatCard label="Διάρκεια">
          <span className="text-3xl font-bold text-slate-900 dark:text-white">
            {formatDuration(durationMs)}
          </span>
        </StatCard>
      </div>

      <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Ανασκόπηση</h2>
        <button
          type="button"
          onClick={tryAgain}
          className="px-4 py-2 rounded-md bg-brand-600 hover:bg-brand-700 text-white font-medium shadow-sm transition-colors"
        >
          Νέο τεστ
        </button>
      </div>

      <div className="space-y-4">
        {questions.map((q, i) => (
          <ReviewCard
            key={q.id}
            index={i + 1}
            question={q}
            chosenAnswerId={answers[q.id]}
          />
        ))}
      </div>
    </div>
  )
}

function StatCard({ label, children }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
      <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-2">
        {label}
      </p>
      {children}
    </div>
  )
}

function ReviewCard({ index, question, chosenAnswerId }) {
  const correctAnswer = question.answers.find((a) => a.isCorrect)
  const isCorrect = chosenAnswerId === correctAnswer?.id
  const wasAnswered = chosenAnswerId != null

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div
        className={`px-5 py-3 border-b flex items-center justify-between gap-3 ${
          !wasAnswered
            ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
            : isCorrect
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900'
              : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900'
        }`}
      >
        <h3 className="font-semibold text-slate-900 dark:text-white">
          <span className="text-slate-400 dark:text-slate-500 mr-2">{index}.</span>
          {question.title}
        </h3>
        <span
          className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${
            !wasAnswered
              ? 'text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-700'
              : isCorrect
                ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60'
                : 'text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/60'
          }`}
        >
          {!wasAnswered ? 'Χωρίς απάντηση' : isCorrect ? 'Σωστή' : 'Λάθος'}
        </span>
      </div>
      <ul className="p-3 space-y-1.5">
        {question.answers.map((a) => {
          const isChosen = a.id === chosenAnswerId
          const isCorrectAnswer = a.isCorrect
          return (
            <li
              key={a.id}
              className={`flex items-center gap-2 text-sm px-3 py-2 rounded-md ${
                isCorrectAnswer
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                  : isChosen
                    ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                    : 'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border border-transparent'
              }`}
            >
              <span className="text-base shrink-0">
                {isCorrectAnswer ? '✓' : isChosen ? '✗' : '·'}
              </span>
              <span className="flex-1">{a.title}</span>
              {isChosen && (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded shrink-0">
                  η επιλογή σου
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function formatDuration(ms) {
  const s = Math.max(0, Math.floor(ms / 1000))
  const m = Math.floor(s / 60)
  const rem = s % 60
  return `${m}:${String(rem).padStart(2, '0')}`
}

export default Results
