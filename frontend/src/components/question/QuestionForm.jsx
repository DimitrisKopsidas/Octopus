import { useState } from 'react'
import { questionsApi } from '../../lib/api'

const MIN_ANSWERS = 3
const MAX_ANSWERS = 5

function emptyAnswer() {
  return { title: '' }
}

function initialState(initialQuestion) {
  if (!initialQuestion) {
    return {
      title: '',
      answers: [emptyAnswer(), emptyAnswer(), emptyAnswer()],
      correctIndex: 0,
    }
  }
  const answers = initialQuestion.answers.map(a => ({ title: a.title }))
  const correctIndex = initialQuestion.answers.findIndex(a => a.isCorrect)
  return {
    title: initialQuestion.title,
    answers,
    correctIndex: correctIndex >= 0 ? correctIndex : 0,
  }
}

function QuestionForm({ courseId, initialQuestion, onCreated, onUpdated, onCancel }) {
  const isEdit = Boolean(initialQuestion)
  const init = initialState(initialQuestion)

  const [title, setTitle] = useState(init.title)
  const [answers, setAnswers] = useState(init.answers)
  const [correctIndex, setCorrectIndex] = useState(init.correctIndex)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const canAdd = answers.length < MAX_ANSWERS
  const canRemove = answers.length > MIN_ANSWERS

  function updateAnswer(idx, value) {
    setAnswers(prev => prev.map((a, i) => (i === idx ? { ...a, title: value } : a)))
  }

  function addAnswer() {
    if (!canAdd) return
    setAnswers(prev => [...prev, emptyAnswer()])
  }

  function removeAnswer(idx) {
    if (!canRemove) return
    setAnswers(prev => prev.filter((_, i) => i !== idx))
    if (correctIndex === idx) setCorrectIndex(0)
    else if (correctIndex > idx) setCorrectIndex(correctIndex - 1)
  }

  function validate() {
    if (!title.trim()) return 'Συμπλήρωσε τίτλο ερώτησης.'
    if (answers.some(a => !a.title.trim())) return 'Συμπλήρωσε όλες τις απαντήσεις.'
    if (correctIndex < 0 || correctIndex >= answers.length) return 'Επίλεξε τη σωστή απάντηση.'
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      const answersPayload = answers.map((a, i) => ({
        title: a.title.trim(),
        isCorrect: i === correctIndex,
      }))
      if (isEdit) {
        await questionsApi.update(initialQuestion.id, {
          title: title.trim(),
          answers: answersPayload,
        })
        onUpdated?.()
      } else {
        await questionsApi.create({
          title: title.trim(),
          courseId: Number(courseId),
          answers: answersPayload,
        })
        onCreated?.()
      }
    } catch (err) {
      const backendMsg = err?.response?.data?.message || err?.response?.data?.error
      setError(backendMsg || err.message || 'Σφάλμα αποθήκευσης.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="px-6 py-5 space-y-6">
        <section>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Ερώτηση
          </label>
          <textarea
            value={title}
            onChange={e => setTitle(e.target.value)}
            rows={3}
            maxLength={255}
            placeholder="π.χ. Τι σημαίνει το ακρωνύμιο JVM;"
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 text-right">
            {title.length}/255
          </p>
        </section>

        <section>
          <div className="flex items-baseline justify-between mb-3">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Απαντήσεις
              <span className="ml-2 text-xs text-slate-500 dark:text-slate-400 font-normal">
                {answers.length} / {MAX_ANSWERS}
              </span>
            </label>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Πάτησε στον κύκλο για να ορίσεις τη σωστή
            </span>
          </div>

          <div className="space-y-2">
            {answers.map((a, idx) => (
              <AnswerRow
                key={idx}
                index={idx}
                value={a.title}
                isCorrect={correctIndex === idx}
                canRemove={canRemove}
                onChange={v => updateAnswer(idx, v)}
                onSelectCorrect={() => setCorrectIndex(idx)}
                onRemove={() => removeAnswer(idx)}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={addAnswer}
            disabled={!canAdd}
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-700 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="text-base leading-none">+</span>
            Προσθήκη απάντησης
          </button>
        </section>

        {error && (
          <div className="rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}
      </div>

      <footer className="flex items-center justify-center gap-2 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 rounded-b-xl">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="px-4 py-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 font-medium transition-colors disabled:opacity-50"
        >
          Ακύρωση
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2 rounded-md bg-brand-600 hover:bg-brand-700 disabled:bg-brand-600/50 disabled:cursor-not-allowed text-white font-medium shadow-sm transition-colors"
        >
          {submitting ? 'Αποθήκευση…' : isEdit ? 'Αποθήκευση αλλαγών' : 'Δημιουργία ερώτησης'}
        </button>
      </footer>
    </form>
  )
}

function AnswerRow({ index, value, isCorrect, canRemove, onChange, onSelectCorrect, onRemove }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg border transition-all ${
        isCorrect
          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 ring-1 ring-emerald-200 dark:ring-emerald-900'
          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700'
      } pl-3 pr-2 py-2`}
    >
      <button
        type="button"
        onClick={onSelectCorrect}
        aria-label="Επίλεξε ως σωστή"
        aria-pressed={isCorrect}
        className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          isCorrect
            ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
            : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 hover:border-emerald-400 dark:hover:border-emerald-600'
        }`}
      >
        {isCorrect && <span className="text-xs leading-none">✓</span>}
      </button>
      <span className="text-xs font-medium text-slate-400 dark:text-slate-500 w-5 shrink-0">
        {index + 1}.
      </span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={`Απάντηση ${index + 1}`}
        className="flex-1 bg-transparent px-1 py-1 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
      />
      <button
        type="button"
        onClick={onRemove}
        disabled={!canRemove}
        aria-label="Αφαίρεση απάντησης"
        className="shrink-0 w-8 h-8 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-950/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <span className="text-lg leading-none">×</span>
      </button>
    </div>
  )
}

export default QuestionForm
