import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { coursesApi, questionsApi } from '../lib/api'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'
import QuestionForm from '../components/QuestionForm'
import CourseSettingsForm from '../components/CourseSettingsForm'
import BackButton from '../components/BackButton'
import t from '../content/adminCourse.json'

function AdminCourse() {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalState, setModalState] = useState({ open: false, editing: null })
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [courses, questions] = await Promise.all([
        coursesApi.list(),
        questionsApi.listByCourse(courseId),
      ])
      const found = courses.find(c => String(c.id) === String(courseId))
      setCourse(found || null)
      setQuestions(questions)
    } catch (err) {
      setError(err.message || t.errorFallback)
    } finally {
      setLoading(false)
    }
  }, [courseId])

  useEffect(() => { reload() }, [reload])

  function openCreate() {
    setModalState({ open: true, editing: null })
  }

  function openEdit(question) {
    setModalState({ open: true, editing: question })
  }

  function closeModal() {
    setModalState({ open: false, editing: null })
  }

  function requestDelete(question) {
    setDeleteTarget(question)
  }

  function cancelDelete() {
    if (deleting) return
    setDeleteTarget(null)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await questionsApi.remove(deleteTarget.id)
      setQuestions(prev => prev.filter(q => q.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch (err) {
      alert(`${t.delete.failurePrefix} ${err.message || ''}`)
    } finally {
      setDeleting(false)
    }
  }

  const title = course ? course.name : t.fallbackTitle.replace('{courseId}', courseId)

  return (
    <div>
      <div className="mb-6">
        <BackButton to="/admin" label={t.backLabel} />
      </div>

      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {title}
          </h1>
          {course && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t.subheader
                .replace('{id}', course.id)
                .replace('{semester}', course.semester)
                .replace('{count}', questions.length)
                .replace('{setSize}', course.questionSetSize)
                .replace('{timer}', course.defaultTimerMinutes)}
            </p>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            disabled={!course}
            className="px-3 py-2 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:border-brand-400 dark:hover:border-brand-600 hover:text-brand-700 dark:hover:text-brand-300 transition-colors disabled:opacity-50"
          >
            <span aria-hidden="true">⚙</span> {t.settingsButton}
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="px-4 py-2 rounded-md bg-brand-600 hover:bg-brand-700 text-white font-medium transition-colors shadow-sm"
          >
            {t.newQuestionButton}
          </button>
        </div>
      </div>

      {loading && (
        <p className="text-slate-500 dark:text-slate-400">{t.loading}</p>
      )}

      {error && !loading && (
        <div className="rounded-md bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 p-4 text-rose-700 dark:text-rose-300">
          {error}
        </div>
      )}

      {!loading && !error && questions.length === 0 && (
        <div className="rounded-lg bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-1">{t.empty.title}</p>
          <p className="text-sm text-slate-500 dark:text-slate-500">{t.empty.hint}</p>
        </div>
      )}

      <div className="space-y-4">
        {questions.map((q, idx) => (
          <QuestionCard
            key={q.id}
            index={idx + 1}
            question={q}
            onEdit={() => openEdit(q)}
            onDelete={() => requestDelete(q)}
            deleting={deleting && deleteTarget?.id === q.id}
          />
        ))}
      </div>

      <Modal
        open={modalState.open}
        onClose={closeModal}
        title={modalState.editing ? t.modal.editTitle : t.modal.createTitle}
        size="lg"
      >
        <QuestionForm
          courseId={courseId}
          initialQuestion={modalState.editing}
          onCreated={() => { closeModal(); reload() }}
          onUpdated={() => { closeModal(); reload() }}
          onCancel={closeModal}
        />
      </Modal>

      <Modal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title={t.modal.settingsTitle}
        size="md"
      >
        <CourseSettingsForm
          course={course}
          onSaved={(updated) => {
            setCourse(updated)
            setSettingsOpen(false)
          }}
          onCancel={() => setSettingsOpen(false)}
        />
      </Modal>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title={t.delete.title}
        message={
          deleteTarget && (
            <div className="space-y-3">
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {t.delete.promptPrefix}
              </p>
              <p className="text-sm font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-md px-3 py-2">
                «{deleteTarget.title}»
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.delete.warning}
              </p>
            </div>
          )
        }
        confirmLabel={t.delete.confirm}
        cancelLabel={t.delete.cancel}
        variant="danger"
        confirming={deleting}
      />
    </div>
  )
}

function QuestionCard({ index, question, onEdit, onDelete, deleting }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-slate-900 dark:text-white">
          <span className="text-slate-400 dark:text-slate-500 mr-2">{index}.</span>
          {question.title}
        </h3>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onEdit}
            className="text-sm px-2.5 py-1 rounded-md text-brand-700 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/30 font-medium transition-colors"
          >
            {t.questionCard.edit}
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="text-sm px-2.5 py-1 rounded-md text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-medium disabled:opacity-50 transition-colors"
          >
            {deleting ? t.questionCard.deleting : t.questionCard.delete}
          </button>
        </div>
      </div>
      <ul className="space-y-1.5">
        {question.answers.map(a => (
          <li
            key={a.id}
            className={`flex items-center gap-2 text-sm px-3 py-2 rounded-md ${
              a.isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                : 'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border border-transparent'
            }`}
          >
            <span className="text-base">{a.isCorrect ? '✓' : '·'}</span>
            <span>{a.title}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AdminCourse
