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

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
            {courseName}
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-0.5">
            {t.questionLabelTemplate.split('{current}')[0]}
            <strong className="text-slate-900 dark:text-white">{currentIndex + 1}</strong>
            {t.questionLabelTemplate.split('{current}')[1].replace('{total}', total)}
            <span className="ml-3 text-slate-500 dark:text-slate-400">
              {' '}
              {t.answeredTemplate.replace('{count}', answeredCount).replace('{total}', total)}
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
            {t.cancelButton}
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
          <FlagButton flagged={isCurrentFlagged} onToggle={() => toggleFlag(currentQuestion.id)} />
        </div>

        {currentQuestion.imageUrl && (
          <div className="mb-6 flex justify-center">
            <QuestionImage src={currentQuestion.imageUrl} alt={currentQuestion.title} />
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

        <div className="mt-4 h-5 flex items-center justify-between gap-3">
          <span className="text-xs inline-flex items-center gap-1.5 min-w-0">
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
          </span>
          {hasChoice && (
            <button
              type="button"
              onClick={() => handleClear(currentQuestion.id)}
              title={t.clear.tooltip}
              className="shrink-0 text-xs text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 font-medium inline-flex items-center gap-1 transition-colors"
            >
              <span aria-hidden="true">×</span> {t.clear.label}
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
