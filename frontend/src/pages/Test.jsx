import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTestStore } from '../store/testStore'
import ConfirmModal from '../components/ConfirmModal'

function Test() {
  const { courseId } = useParams()
  const navigate = useNavigate()

  const questions = useTestStore((s) => s.questions)
  const sessionCourseId = useTestStore((s) => s.courseId)
  const currentIndex = useTestStore((s) => s.currentIndex)
  const answers = useTestStore((s) => s.answers)
  const durationSeconds = useTestStore((s) => s.durationSeconds)
  const startedAt = useTestStore((s) => s.startedAt)
  const courseName = useTestStore((s) => s.courseName)
  const selectAnswer = useTestStore((s) => s.selectAnswer)
  const goNext = useTestStore((s) => s.goNext)
  const goPrev = useTestStore((s) => s.goPrev)
  const finish = useTestStore((s) => s.finish)
  const reset = useTestStore((s) => s.reset)

  const [cancelOpen, setCancelOpen] = useState(false)
  const [remaining, setRemaining] = useState(null)

  const hasSession =
    sessionCourseId != null &&
    String(sessionCourseId) === String(courseId) &&
    questions.length > 0

  // Guard: no active session for this course → bounce to start
  useEffect(() => {
    if (!hasSession) {
      navigate(`/courses/${courseId}/start`, { replace: true })
    }
  }, [hasSession, courseId, navigate])

  // Countdown timer
  useEffect(() => {
    if (!hasSession || !durationSeconds || !startedAt) {
      setRemaining(null)
      return
    }
    function tick() {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000)
      const left = durationSeconds - elapsed
      setRemaining(left)
      if (left <= 0) {
        finish()
        navigate(`/test/${courseId}/results`)
      }
    }
    tick()
    const id = setInterval(tick, 500)
    return () => clearInterval(id)
  }, [hasSession, durationSeconds, startedAt, finish, navigate, courseId])

  const total = questions.length
  const currentQuestion = questions[currentIndex]
  const selectedAnswerId = currentQuestion ? answers[currentQuestion.id] : undefined
  const isFirst = currentIndex === 0
  const isLast = currentIndex === total - 1
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers])

  function handleFinish() {
    finish()
    navigate(`/test/${courseId}/results`)
  }

  function handleCancel() {
    reset()
    navigate(`/courses/${courseId}/start`, { replace: true })
  }

  if (!hasSession || !currentQuestion) {
    return null
  }

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
            {courseName}
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-0.5">
            Ερώτηση <strong className="text-slate-900 dark:text-white">{currentIndex + 1}</strong> από {total}
            <span className="ml-3 text-slate-500 dark:text-slate-400">
              · απαντημένες {answeredCount}/{total}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {remaining != null && <Countdown seconds={remaining} />}
          <button
            type="button"
            onClick={() => setCancelOpen(true)}
            className="text-sm px-3 py-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
          >
            Ακύρωση
          </button>
        </div>
      </header>

      <div className="mb-6 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-brand-600 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
        />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white leading-snug mb-6">
          {currentQuestion.title}
        </h2>

        <div className="space-y-2">
          {currentQuestion.answers.map((a, i) => (
            <AnswerOption
              key={a.id}
              label={a.title}
              letter={String.fromCharCode(65 + i)}
              selected={selectedAnswerId === a.id}
              onClick={() => selectAnswer(currentQuestion.id, a.id)}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={goPrev}
          disabled={isFirst}
          className="px-4 py-2 rounded-md text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-600 font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          ← Προηγούμενη
        </button>
        {isLast ? (
          <button
            type="button"
            onClick={handleFinish}
            className="px-5 py-2 rounded-md bg-brand-600 hover:bg-brand-700 text-white font-medium shadow-sm transition-colors"
          >
            Ολοκλήρωση
          </button>
        ) : (
          <button
            type="button"
            onClick={goNext}
            className="px-4 py-2 rounded-md bg-brand-600 hover:bg-brand-700 text-white font-medium shadow-sm transition-colors"
          >
            Επόμενη →
          </button>
        )}
      </div>

      <ConfirmModal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={handleCancel}
        title="Ακύρωση τεστ"
        message="Αν ακυρώσεις, οι απαντήσεις σου θα χαθούν. Σίγουρα θες να συνεχίσεις;"
        confirmLabel="Ακύρωση τεστ"
        cancelLabel="Συνέχεια τεστ"
        variant="danger"
      />
    </div>
  )
}

function AnswerOption({ label, letter, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${
        selected
          ? 'bg-brand-50 dark:bg-brand-950/30 border-brand-500 text-slate-900 dark:text-white'
          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-600 text-slate-900 dark:text-slate-100'
      }`}
    >
      <span
        className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm shrink-0 transition-colors ${
          selected
            ? 'bg-brand-600 text-white'
            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
        }`}
      >
        {letter}
      </span>
      <span className="flex-1">{label}</span>
    </button>
  )
}

function Countdown({ seconds }) {
  const safe = Math.max(0, seconds)
  const m = Math.floor(safe / 60)
  const s = safe % 60
  const low = safe <= 60 && safe > 0
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold tabular-nums ${
        low
          ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
      }`}
    >
      <span aria-hidden="true">⏱</span>
      {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
    </span>
  )
}

export default Test
