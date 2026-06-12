// Test results page: score stats + per-question review + bundle submit. Route: /test/:courseId/results
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTestStore } from '../store/testStore'
import { bundlesApi, questionsApi, extractErrorMessage } from '../lib/api'
import { isQuestionCorrect, flattenAnswerIds } from '../lib/scoring'
import { toast } from '../store/toastStore'
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
  const totalSets = useTestStore((s) => s.totalSets)
  const startSession = useTestStore((s) => s.startSession)
  const reset = useTestStore((s) => s.reset)

  const submittedRef = useRef(false)
  const restartingRef = useRef(false) // suppresses the redirect guard during an intentional set restart
  const [setActionLoading, setSetActionLoading] = useState(false)

  const hasResults =
    sessionCourseId != null &&
    String(sessionCourseId) === String(courseId) &&
    questions.length > 0 &&
    endedAt != null

  useEffect(() => {
    if (!hasResults && !restartingRef.current) navigate(`/courses/${courseId}/start`, { replace: true })
  }, [hasResults, courseId, navigate])

  useEffect(() => {
    if (!hasResults || submittedRef.current) return
    const answerIds = flattenAnswerIds(answers)
    if (answerIds.length === 0) return
    submittedRef.current = true
    const timeForCompletion = endedAt && startedAt
      ? Math.round((endedAt - startedAt) / 1000)
      : null
    bundlesApi
      .create({ setNum: setIndex, answerIds, timeForCompletion })
      .catch((err) => console.warn('Bundle submit failed', err))
  }, [hasResults, answers, setIndex, startedAt, endedAt])

  const { correctCount, total, durationMs } = useMemo(() => {
    let correct = 0
    for (const q of questions) {
      if (isQuestionCorrect(q, answers[q.id])) correct += 1
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

  // Sandbox/simulation: re-run a fresh random quiz with the SAME settings
  // (same question count + timer), just newly shuffled questions.
  async function redoRandom() {
    if (setActionLoading) return
    setSetActionLoading(true)
    try {
      const { count, durationSeconds } = useTestStore.getState()
      const questions = await questionsApi.byRandomCount(courseId, count)
      restartingRef.current = true
      startSession({
        courseId: Number(courseId),
        courseName,
        count,
        durationSeconds,
        order: 'random',
        questions,
        setIndex: null,
        totalSets: null,
      })
      navigate(`/test/${courseId}`)
    } catch (err) {
      restartingRef.current = false
      toast.error(extractErrorMessage(err, 'Σφάλμα έναρξης'))
      setSetActionLoading(false)
    }
  }

  async function redoSet() {
    if (setActionLoading || setIndex == null) return
    setSetActionLoading(true)
    try {
      const durationSeconds = useTestStore.getState().durationSeconds
      const questions = await questionsApi.bySetNum(courseId, setIndex)
      restartingRef.current = true
      startSession({
        courseId: Number(courseId),
        courseName,
        count: questions.length,
        durationSeconds,
        order: 'sequential',
        questions,
        setIndex,
        totalSets,
      })
      navigate(`/test/${courseId}`)
    } catch (err) {
      restartingRef.current = false
      toast.error(extractErrorMessage(err, 'Σφάλμα επανεκκίνησης'))
      setSetActionLoading(false)
    }
  }

  async function nextChapter() {
    if (setActionLoading || setIndex == null) return
    const nextIndex = setIndex + 1
    if (totalSets != null && nextIndex >= totalSets) {
      navigate(`/courses/${courseId}/start`)
      return
    }
    setSetActionLoading(true)
    try {
      const durationSeconds = useTestStore.getState().durationSeconds
      const questions = await questionsApi.bySetNum(courseId, nextIndex)
      restartingRef.current = true
      startSession({
        courseId: Number(courseId),
        courseName,
        count: questions.length,
        durationSeconds,
        order: 'sequential',
        questions,
        setIndex: nextIndex,
        totalSets,
      })
      navigate(`/test/${courseId}`)
    } catch (err) {
      restartingRef.current = false
      toast.error(extractErrorMessage(err, 'Σφάλμα φόρτωσης επόμενου κεφαλαίου'))
      setSetActionLoading(false)
    }
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
        <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-1 flex items-center gap-2 flex-wrap">
          <span>{courseName}</span>
          {setIndex != null && (
            <span className="normal-case tracking-normal text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-1.5 py-0.5 rounded">
              {t.setLabel.replace('{n}', setIndex + 1)}
            </span>
          )}
        </p>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-200">{t.title}</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label={t.stats.correct}>
          <span className={`text-3xl font-bold ${scoreTone}`}>{correctCount}/{total}</span>
        </StatCard>
        <StatCard label={t.stats.percentage}>
          <span className={`text-3xl font-bold ${scoreTone}`}>{percent}%</span>
        </StatCard>
        <StatCard label={t.stats.duration}>
          <span className="text-3xl font-bold text-slate-900 dark:text-slate-200">
            {formatDuration(durationMs)}
          </span>
        </StatCard>
      </div>

      <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-200">{t.reviewTitle}</h2>
        <div className="flex items-center gap-2 flex-wrap">
          {setIndex != null ? (
            <>
              <button
                type="button"
                onClick={redoSet}
                disabled={setActionLoading}
                className="px-4 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium hover:border-brand-400 dark:hover:border-brand-600 hover:text-brand-700 dark:hover:text-brand-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {setActionLoading ? 'Φόρτωση…' : t.redoSet}
              </button>
              {(totalSets == null || setIndex + 1 < totalSets) && (
                <button
                  type="button"
                  onClick={nextChapter}
                  disabled={setActionLoading}
                  className="px-4 py-2 rounded-md bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium shadow-sm transition-colors"
                >
                  {setActionLoading ? 'Φόρτωση…' : t.nextChapter}
                </button>
              )}
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={tryAgain}
                disabled={setActionLoading}
                className="px-4 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium hover:border-brand-400 dark:hover:border-brand-600 hover:text-brand-700 dark:hover:text-brand-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t.changeSettings}
              </button>
              <button
                type="button"
                onClick={redoRandom}
                disabled={setActionLoading}
                className="px-4 py-2 rounded-md bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium shadow-sm transition-colors"
              >
                {setActionLoading ? 'Φόρτωση…' : t.tryAgain}
              </button>
            </>
          )}
        </div>
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
