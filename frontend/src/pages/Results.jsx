import { useEffect, useMemo, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTestStore } from '../store/testStore'
import { bundlesApi } from '../lib/api'
import BackButton from '../components/ui/BackButton'
import StatCard from '../components/ui/StatCard'
import ReviewCard from '../components/question/ReviewCard'
import t from '../content/results.json'

function formatDuration(ms) {
  const s = Math.max(0, Math.floor(ms / 1000))
  const m = Math.floor(s / 60)
  const rem = s % 60
  return `${m}:${String(rem).padStart(2, '0')}`
}

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

  const submittedRef = useRef(false)

  const hasResults =
    sessionCourseId != null &&
    String(sessionCourseId) === String(courseId) &&
    questions.length > 0 &&
    endedAt != null

  useEffect(() => {
    if (!hasResults) navigate(`/courses/${courseId}/start`, { replace: true })
  }, [hasResults, courseId, navigate])

  useEffect(() => {
    if (!hasResults || submittedRef.current) return
    const answerIds = Object.values(answers)
    if (answerIds.length === 0) return
    submittedRef.current = true
    bundlesApi
      .create({ setNum: setIndex, answerIds })
      .catch((err) => console.warn('Bundle submit failed', err))
  }, [hasResults, answers, setIndex])

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
        <BackButton to="/courses" label={t.backLabel} />
      </div>

      <div className="mb-8">
        <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-1">
          {courseName}
        </p>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t.title}</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label={t.stats.correct}>
          <span className={`text-3xl font-bold ${scoreTone}`}>{correctCount}/{total}</span>
        </StatCard>
        <StatCard label={t.stats.percentage}>
          <span className={`text-3xl font-bold ${scoreTone}`}>{percent}%</span>
        </StatCard>
        <StatCard label={t.stats.duration}>
          <span className="text-3xl font-bold text-slate-900 dark:text-white">
            {formatDuration(durationMs)}
          </span>
        </StatCard>
      </div>

      <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{t.reviewTitle}</h2>
        <button
          type="button"
          onClick={tryAgain}
          className="px-4 py-2 rounded-md bg-brand-600 hover:bg-brand-700 text-white font-medium shadow-sm transition-colors"
        >
          {t.tryAgain}
        </button>
      </div>

      <div className="space-y-4">
        {questions.map((q, i) => (
          <ReviewCard key={q.id} index={i + 1} question={q} chosenAnswerId={answers[q.id]} />
        ))}
      </div>
    </div>
  )
}

export default Results
