// Active test page: one question at a time, answer select, navigator, timer. Route: /test/:courseId
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTestStore } from '../store/testStore'
import { useCountdown } from '../hooks/useCountdown'
import { useFlash } from '../hooks/useFlash'
import { useTestKeyboard } from '../hooks/useTestKeyboard'
import { isMultiAnswer, getChosenIds } from '../lib/scoring'
import ConfirmModal from '../components/ui/ConfirmModal'
import Countdown from '../components/ui/Countdown'
import QuestionNavigator from '../components/question/QuestionNavigator'
import FlagButton from '../components/question/FlagButton'
import AnswerOption from '../components/question/AnswerOption'
import QuestionImage from '../components/question/QuestionImage'
import t from '../content/test.json'

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
  const setIndex = useTestStore((s) => s.setIndex)
  const selectAnswer = useTestStore((s) => s.selectAnswer)
  const toggleAnswer = useTestStore((s) => s.toggleAnswer)
  const clearAnswer = useTestStore((s) => s.clearAnswer)
  const toggleFlag = useTestStore((s) => s.toggleFlag)
  const goNext = useTestStore((s) => s.goNext)
  const goPrev = useTestStore((s) => s.goPrev)
  const goTo = useTestStore((s) => s.goTo)
  const finish = useTestStore((s) => s.finish)
  const reset = useTestStore((s) => s.reset)

  const [cancelOpen, setCancelOpen] = useState(false)
  const [flash, setFlash] = useFlash(1500) // 'saved' | 'cleared' | null

  const hasSession =
    sessionCourseId != null &&
    String(sessionCourseId) === String(courseId) &&
    questions.length > 0

  useEffect(() => {
    if (!hasSession) {
      navigate(`/courses/${courseId}/start`, { replace: true })
    } else if (endedAt) {
      navigate(`/test/${courseId}/results`, { replace: true })
    }
  }, [hasSession, endedAt, courseId, navigate])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentIndex])

  function onTimerZero() {
    finish()
    navigate(`/test/${courseId}/results`)
  }
  const remaining = useCountdown(hasSession ? durationSeconds : null, startedAt, onTimerZero)

  const total = questions.length
  const currentQuestion = questions[currentIndex]
  const isMultiCurrent = currentQuestion ? isMultiAnswer(currentQuestion) : false
  const chosenIds = currentQuestion ? getChosenIds(answers[currentQuestion.id]) : []
  const hasChoice = chosenIds.length > 0
  const isFirst = currentIndex === 0
  const isLast = currentIndex === total - 1
  const isCurrentFlagged = currentQuestion ? flaggedIds.has(currentQuestion.id) : false
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers])

  // Single-correct → replace the choice. Multi-correct → toggle within the set.
  function handleSelect(questionId, answerId) {
    if (isMultiCurrent) {
      const wasSelected = getChosenIds(answers[questionId]).includes(answerId)
      toggleAnswer(questionId, answerId)
      setFlash(wasSelected ? 'cleared' : 'saved')
    } else {
      selectAnswer(questionId, answerId)
      setFlash('saved')
    }
  }
  function handleClear(questionId) {
    if (answers[questionId] == null) return
    clearAnswer(questionId)
    setFlash('cleared')
  }
  function handleFinish() {
    finish()
    navigate(`/test/${courseId}/results`)
  }
  function handleCancel() {
    reset()
    navigate(`/courses/${courseId}/start`, { replace: true })
  }

  useTestKeyboard({
    enabled: hasSession,
    currentQuestion,
    isFirst,
    isLast,
    onPrev: goPrev,
    onNext: goNext,
    onSelect: handleSelect,
    onClear: handleClear,
    onToggleFlag: toggleFlag,
  })

  if (!hasSession || !currentQuestion) return null

  const progressBar = (
    <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
      <div
        className="h-full bg-brand-600 rounded-full transition-[width] duration-500 ease-out"
        style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
      />
    </div>
  )

  // Timer display values for the prominent sidebar block
  const timerLow = remaining != null && remaining <= 60 && remaining > 0
  const timerMin = remaining != null ? Math.floor(Math.max(0, remaining) / 60) : 0
  const timerSec = remaining != null ? Math.max(0, remaining) % 60 : 0

  const questionMeta = (
    <>
      <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-2 flex-wrap">
        <span>{courseName}</span>
        {setIndex != null && (
          <span className="normal-case tracking-normal text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-1.5 py-0.5 rounded">
            {t.setLabel.replace('{n}', setIndex + 1)}
          </span>
        )}
      </p>
      <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
        {t.questionLabelTemplate.split('{current}')[0]}
        <strong className="text-slate-900 dark:text-slate-200">{currentIndex + 1}</strong>
        {t.questionLabelTemplate.split('{current}')[1].replace('{total}', total)}
        <span className="ml-2 text-slate-500 dark:text-slate-400">
          · {t.answeredTemplate.replace('{count}', answeredCount).replace('{total}', total)}
        </span>
      </p>
    </>
  )

  return (
    <div className="max-w-6xl mx-auto">
      {/* ── Mobile header (hidden on lg+) ── */}
      <header className="lg:hidden mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0">{questionMeta}</div>
        <div className="flex items-center justify-between gap-3 sm:justify-end shrink-0">
          {remaining != null && <Countdown seconds={remaining} />}
          <button
            type="button"
            onClick={() => setCancelOpen(true)}
            className="text-sm px-3 py-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
          >
            {t.cancelButton}
          </button>
        </div>
      </header>

      <div className="lg:grid lg:grid-cols-[1fr_260px] lg:gap-8 lg:items-start">
        {/* ── Main question column (mobile: progress + navigator above; desktop: only question) ── */}
        <div>
          <div className="lg:hidden">
            <div className="mb-4">{progressBar}</div>
            <QuestionNavigator
              questions={questions}
              currentIndex={currentIndex}
              answers={answers}
              flaggedIds={flaggedIds}
              onJump={goTo}
            />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-200 leading-snug break-words mb-6">
              {currentQuestion.title}
            </h2>

            {currentQuestion.imageUrl && (
              <div className="mb-6 flex justify-center">
                <QuestionImage src={currentQuestion.imageUrl} alt={currentQuestion.title} className="lg:max-h-96" />
              </div>
            )}

            {isMultiCurrent && (
              <p className="mb-3 text-xs font-medium text-brand-700 dark:text-brand-400 inline-flex items-center gap-1.5">
                <span aria-hidden="true">☑</span> {t.multiHint}
              </p>
            )}

            <div className="space-y-2">
              {currentQuestion.answers.map((a, i) => (
                <AnswerOption
                  key={a.id}
                  label={a.title}
                  letter={String.fromCharCode(65 + i)}
                  selected={chosenIds.includes(a.id)}
                  multi={isMultiCurrent}
                  onClick={() => handleSelect(currentQuestion.id, a.id)}
                />
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <FlagButton flagged={isCurrentFlagged} onToggle={() => toggleFlag(currentQuestion.id)} />

              <div className="flex items-center gap-3 min-w-0 text-xs">
                {flash === 'saved' && (
                  <span className="text-emerald-700 dark:text-emerald-400 font-medium inline-flex items-center gap-1.5">
                    <span aria-hidden="true">✓</span> {t.flash.saved}
                  </span>
                )}
                {flash === 'cleared' && (
                  <span className="text-slate-600 dark:text-slate-400 font-medium inline-flex items-center gap-1.5">
                    <span aria-hidden="true">↺</span> {t.flash.cleared}
                  </span>
                )}
                {hasChoice && (
                  <button
                    type="button"
                    onClick={() => handleClear(currentQuestion.id)}
                    title={t.clear.tooltip}
                    className="shrink-0 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 font-medium inline-flex items-center gap-1 transition-colors"
                  >
                    <span aria-hidden="true">×</span> {t.clear.label}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={goPrev}
              disabled={isFirst}
              className="px-4 py-2 rounded-md text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-600 font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {t.prevButton}
            </button>
            {isLast ? (
              <button
                type="button"
                onClick={handleFinish}
                className="px-5 py-2 rounded-md bg-brand-600 hover:bg-brand-700 text-white font-medium shadow-sm transition-colors"
              >
                {t.finishButton}
              </button>
            ) : (
              <button
                type="button"
                onClick={goNext}
                className="px-4 py-2 rounded-md bg-brand-600 hover:bg-brand-700 text-white font-medium shadow-sm transition-colors"
              >
                {t.nextButton}
              </button>
            )}
          </div>
        </div>

        {/* ── Right sidebar (desktop only) ── */}
        <aside className="hidden lg:flex flex-col gap-3 sticky top-6 self-start">
          {/* Timer — prominent block, only when the test is timed */}
          {remaining != null && (
            <div
              className={`rounded-xl border shadow-sm px-5 py-4 transition-colors ${
                timerLow
                  ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <p
                className={`text-[11px] uppercase tracking-wider font-semibold mb-1 ${
                  timerLow ? 'text-rose-500 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {t.sidebar.timerLabel}
              </p>
              <p
                className={`text-3xl font-bold tabular-nums tracking-tight leading-none ${
                  timerLow ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-slate-100'
                }`}
              >
                {String(timerMin).padStart(2, '0')}:{String(timerSec).padStart(2, '0')}
              </p>
            </div>
          )}

          {/* Progress card — subject, position counter, progress bar, answered count */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-2 flex-wrap">
              <span className="truncate">{courseName}</span>
              {setIndex != null && (
                <span className="normal-case tracking-normal text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-1.5 py-0.5 rounded">
                  {t.setLabel.replace('{n}', setIndex + 1)}
                </span>
              )}
            </p>

            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums leading-none">
                {currentIndex + 1}
              </span>
              <span className="text-sm text-slate-400 dark:text-slate-500 tabular-nums">/ {total}</span>
              <span className="ml-1 text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">
                {t.sidebar.questionLabel}
              </span>
            </div>

            <div className="mt-3">
              {progressBar}
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                {t.sidebar.answeredTemplate.replace('{count}', answeredCount).replace('{total}', total)}
              </p>
            </div>
          </div>

          {/* Navigator card with legend */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-3">
              {t.sidebar.navLabel}
            </p>
            <QuestionNavigator
              questions={questions}
              currentIndex={currentIndex}
              answers={answers}
              flaggedIds={flaggedIds}
              onJump={goTo}
              className="max-h-44"
            />
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" aria-hidden="true" />
                {t.sidebar.legendAnswered}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-white dark:bg-slate-900 ring-2 ring-amber-400 dark:ring-amber-500 shrink-0" aria-hidden="true" />
                {t.sidebar.legendFlagged}
              </span>
            </div>
          </div>

          {/* Cancel */}
          <button
            type="button"
            onClick={() => setCancelOpen(true)}
            className="w-full text-sm px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200 dark:border-slate-800 font-medium transition-colors active:scale-[0.98]"
          >
            {t.cancelButton}
          </button>
        </aside>
      </div>

      <ConfirmModal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={handleCancel}
        title={t.cancelModal.title}
        message={t.cancelModal.message}
        confirmLabel={t.cancelModal.confirm}
        cancelLabel={t.cancelModal.cancel}
        variant="danger"
      />
    </div>
  )
}

export default Test
