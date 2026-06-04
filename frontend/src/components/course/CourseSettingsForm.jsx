// Form to edit a course set size + default timer. Used in AdminCourse settings modal.
import { useState } from 'react'
import { coursesApi, extractErrorMessage } from '../../lib/api'

function CourseSettingsForm({ course, onSaved, onCancel }) {
  const [questionSetSize, setQuestionSetSize] = useState(course?.questionSetSize ?? 25)
  const [defaultTimerMinutes, setDefaultTimerMinutes] = useState(course?.defaultTimerMinutes ?? 30)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!questionSetSize || questionSetSize < 1) {
      setError('Το μέγεθος σετ πρέπει να είναι τουλάχιστον 1.')
      return
    }
    if (!defaultTimerMinutes || defaultTimerMinutes < 5) {
      setError('Ο προεπιλεγμένος χρόνος πρέπει να είναι τουλάχιστον 5 λεπτά.')
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      const updated = await coursesApi.update(course.id, {
        questionSetSize: Number(questionSetSize),
        defaultTimerMinutes: Number(defaultTimerMinutes),
      })
      onSaved?.(updated)
    } catch (err) {
      setError(extractErrorMessage(err, 'Σφάλμα αποθήκευσης.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="px-6 py-5 space-y-5">
        <section>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Μέγεθος σετ ερωτήσεων
          </label>
          <input
            type="number"
            min={1}
            value={questionSetSize}
            onChange={(e) => setQuestionSetSize(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
            Πόσες ερωτήσεις περιέχει κάθε σετ στη Συστηματική Μελέτη. Συνήθως ίσο με τον αριθμό ερωτήσεων της εξέτασης.
          </p>
        </section>

        <section>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Προεπιλεγμένος χρόνος (λεπτά)
          </label>
          <input
            type="number"
            min={5}
            value={defaultTimerMinutes}
            onChange={(e) => setDefaultTimerMinutes(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
            Προτεινόμενος χρόνος για ένα τεστ. Ελάχιστο 5 λεπτά.
          </p>
        </section>

        {error && (
          <div className="rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}
      </div>

      <footer className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 rounded-b-xl">
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
          {submitting ? 'Αποθήκευση…' : 'Αποθήκευση'}
        </button>
      </footer>
    </form>
  )
}

export default CourseSettingsForm
