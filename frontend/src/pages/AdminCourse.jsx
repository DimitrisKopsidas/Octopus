// Admin page for one course: question list + create/edit/delete + settings modals. Route: /admin/courses/:courseId
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { questionsApi, extractErrorMessage } from '../lib/api'
import { useCoursesStore } from '../store/coursesStore'
import Modal from '../components/ui/Modal'
import ConfirmModal from '../components/ui/ConfirmModal'
import BackButton from '../components/ui/BackButton'
import QuestionForm from '../components/question/QuestionForm'
import QuestionCard from '../components/question/QuestionCard'
import QuestionCardSkeleton from '../components/question/QuestionCardSkeleton'
import ErrorState from '../components/ui/ErrorState'
import CourseSettingsForm from '../components/course/CourseSettingsForm'
import { toast } from '../store/toastStore'
import t from '../content/adminCourse.json'

function AdminCourse() {
  const { courseId } = useParams()

  const courses = useCoursesStore((s) => s.courses)
  const loadCourses = useCoursesStore((s) => s.loadCourses)
  const applyCourseUpdate = useCoursesStore((s) => s.applyCourseUpdate)
  const invalidateWithContent = useCoursesStore((s) => s.invalidateWithContent)

  const course = useMemo(
    () => courses?.find((c) => String(c.id) === String(courseId)) || null,
    [courses, courseId]
  )

  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalState, setModalState] = useState({ open: false, editing: null })
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => { loadCourses().catch(() => {}) }, [loadCourses])

  // Full reload: shows loading skeletons (used on first mount).
  const reloadQuestions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await questionsApi.listByCourse(courseId)
      setQuestions(data)
    } catch (err) {
      setError(extractErrorMessage(err, t.errorFallback))
    } finally {
      setLoading(false)
    }
  }, [courseId])

  // Silent retry: keeps ErrorState visible (spinner on button) — no skeleton flash.
  const retryQuestions = useCallback(async () => {
    try {
      const data = await questionsApi.listByCourse(courseId)
      setQuestions(data)
      setError(null)
    } catch (err) {
      setError(extractErrorMessage(err, t.errorFallback))
    }
  }, [courseId])

  useEffect(() => { reloadQuestions() }, [reloadQuestions])

  const openCreate = () => setModalState({ open: true, editing: null })
  const openEdit = (question) => setModalState({ open: true, editing: question })
  const closeModal = () => setModalState({ open: false, editing: null })
  const requestDelete = (question) => setDeleteTarget(question)
  const cancelDelete = () => { if (!deleting) setDeleteTarget(null) }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await questionsApi.remove(deleteTarget.id)
      setQuestions(prev => prev.filter(q => q.id !== deleteTarget.id))
      setDeleteTarget(null)
      invalidateWithContent()
      toast.success(t.toast.questionDeleted)
    } catch (err) {
      toast.error(`${t.delete.failurePrefix} ${extractErrorMessage(err, '')}`)
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
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
        <div role="status" aria-label={t.loading} className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <QuestionCardSkeleton key={i} />)}
        </div>
      )}

      {error && !loading && (
        <ErrorState message={error} onRetry={retryQuestions} />
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
          onCreated={() => { reloadQuestions(); invalidateWithContent(); toast.success(t.toast.questionCreated) }}
          onUpdated={() => { closeModal(); reloadQuestions(); toast.success(t.toast.questionUpdated) }}
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
            applyCourseUpdate(updated)
            setSettingsOpen(false)
            toast.success(t.toast.settingsSaved)
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
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.delete.warning}</p>
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

export default AdminCourse
