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
  const flaggedIds = useTestStore((s) => s.flaggedIds)
  const durationSeconds = useTestStore((s) => s.durationSeconds)
  const startedAt = useTestStore((s) => s.startedAt)
  const endedAt = useTestStore((s) => s.endedAt)
  const courseName = useTestStore((s) => s.courseName)
  const selectAnswer = useTestStore((s) => s.selectAnswer)
  const clearAnswer = useTestStore((s) => s.clearAnswer)
  const toggleFlag = useTestStore((s) => s.toggleFlag)
  const goNext = useTestStore((s) => s.goNext)
  const goPrev = useTestStore((s) => s.goPrev)
  const goTo = useTestStore((s) => s.goTo)
  const finish = useTestStore((s) => s.finish)
  const reset = useTestStore((s) => s.reset)

  const [cancelOpen, setCancelOpen] = useState(false)
  const [remaining, setRemaining] = useState(null)
  const [flash, setFlash] = useState(null) // 'saved' | 'cleared' | null

  const hasSession =
    sessionCourseId != null &&
    String(sessionCourseId) === String(courseId) &&
    questions.length > 0

  // Guards: no active session → start; refreshed after finish → results
  useEffect(() => {
    if (!hasSession) {
      navigate(`/courses/${courseId}/start`, { replace: true })
    } else if (endedAt) {
      navigate(`/test/${courseId}/results`, { replace: true })
    }
  }, [hasSession, endedAt, courseId, navigate])

  // Countdown
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
  const isCurrentFlagged = currentQuestion ? flaggedIds.has(currentQuestion.id) : false
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers])

  function handleSelect(questionId, answerId) {
    selectAnswer(questionId, answerId)
    setFlash('saved')
  }

  function handleClear(questionId) {
    if (answers[questionId] == null) return
    clearAnswer(questionId)
    setFlash('cleared')
  }

  // Clear the flash pill after a short while
  useEffect(() => {
    if (!flash) return
    const id = setTimeout(() => setFlash(null), 1500)
    return () => clearTimeout(id)
  }, [flash])

  function handleFinish() {
    finish()
    navigate(`/test/${courseId}/results`)
  }

  function handleCancel() {
    reset()
    navigate(`/courses/${courseId}/start`, { replace: true })
  }

  // Keyboard shortcuts: arrows for nav, 1-5 to choose, f to flag
  useEffect(() => {
    if (!hasSession || !currentQuestion) return
    function onKey(e) {
      // Ignore if typing in an input/textarea (none currently, but defensive)
      const tag = e.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === 'ArrowRight') {
        if (!isLast) goNext()
      } else if (e.key === 'ArrowLeft') {
        if (!isFirst) goPrev()
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFlag(currentQuestion.id)
      } else if (e.key === '0') {
        handleClear(currentQuestion.id)
      } else if (/^[1-5]$/.test(e.key)) {
        const idx = Number(e.key) - 1
        const choice = currentQuestion.answers[idx]
        if (choice) handleSelect(currentQuestion.id, choice.id)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [hasSession, currentQuestion, isFirst, isLast, goNext, goPrev, toggleFlag])

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

      <div className="mb-4 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-brand-600 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
        />
      </div>

      <QuestionNavigator
        questions={questions}
        currentIndex={currentIndex}
        answers={answers}
        flaggedIds={flaggedIds}
        onJump={goTo}
      />

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
        <div className="flex items-start justify-between gap-3 mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white leading-snug">
            {currentQuestion.title}
          </h2>
          <FlagButton
            flagged={isCurrentFlagged}
            onToggle={() => toggleFlag(currentQuestion.id)}
          />
        </div>

        <div className="space-y-2">
          {currentQuestion.answers.map((a, i) => (
            <AnswerOption
              key={a.id}
              label={a.title}
              letter={String.fromCharCode(65 + i)}
              selected={selectedAnswerId === a.id}
              onClick={() => handleSelect(currentQuestion.id, a.id)}
            />
          ))}
        </div>

        <div className="mt-4 h-5 flex items-center justify-between gap-3">
          <span className="text-xs inline-flex items-center gap-1.5 min-w-0">
            {flash === 'saved' && (
              <span className="text-emerald-700 dark:text-emerald-400 font-medium inline-flex items-center gap-1.5">
                <span aria-hidden="true">✓</span>
                Η απάντηση αποθηκεύτηκε
              </span>
            )}
            {flash === 'cleared' && (
              <span className="text-slate-600 dark:text-slate-400 font-medium inline-flex items-center gap-1.5">
                <span aria-hidden="true">↺</span>
                Η επιλογή καθαρίστηκε
              </span>
            )}
          </span>
          {selectedAnswerId != null && (
            <button
              type="button"
              onClick={() => handleClear(currentQuestion.id)}
              title="Καθαρισμός επιλογής (0)"
              className="shrink-0 text-xs text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 font-medium inline-flex items-center gap-1 transition-colors"
            >
              <span aria-hidden="true">×</span>
              Καθαρισμός επιλογής
            </button>
          )}
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

function QuestionNavigator({ questions, currentIndex, answers, flaggedIds, onJump }) {
  return (
    <div className="mb-6 max-h-28 overflow-y-auto flex flex-wrap gap-1.5">
      {questions.map((q, i) => {
        const isCurrent = i === currentIndex
        const isAnswered = answers[q.id] != null
        const isFlagged = flaggedIds.has(q.id)
        return (
          <button
            key={q.id}
            type="button"
            onClick={() => onJump(i)}
            aria-label={`Μετάβαση στην ερώτηση ${i + 1}`}
            aria-current={isCurrent ? 'true' : undefined}
            className={`relative w-8 h-8 rounded-full text-xs font-semibold transition-all ${
              isCurrent
                ? 'bg-brand-600 text-white shadow-sm ring-2 ring-brand-300 dark:ring-brand-700'
                : isAnswered
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-600'
            } ${isFlagged ? 'ring-2 ring-amber-400 dark:ring-amber-500 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-950' : ''}`}
          >
            {i + 1}
          </button>
        )
      })}
    </div>
  )
}

function FlagButton({ flagged, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={flagged}
      aria-label={flagged ? 'Αφαίρεση σήμανσης' : 'Σήμανση για επανέλεγχο'}
      title={flagged ? 'Αφαίρεση σήμανσης (F)' : 'Σήμανση για επανέλεγχο (F)'}
      className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${
        flagged
          ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-amber-700 dark:hover:text-amber-400 hover:border-amber-300 dark:hover:border-amber-700'
      }`}
    >
      <span aria-hidden="true">{flagged ? '🔖' : '🏷'}</span>
      {flagged ? 'Σημειωμένη' : 'Σημείωση'}
    </button>
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
