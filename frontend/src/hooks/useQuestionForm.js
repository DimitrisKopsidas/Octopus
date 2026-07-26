// State + validation + submit for a question form. Used by QuestionForm.
import { useState } from 'react'
import { extractErrorMessage } from '../lib/api'
import { useCreateQuestion, useUpdateQuestion } from './queries'

export const MIN_ANSWERS = 3
export const MAX_ANSWERS = 10

const TF_ANSWERS = [{ title: 'Σωστό' }, { title: 'Λάθος' }]

function emptyAnswer() {
  return { title: '' }
}

// Detect question type from an existing question (edit mode).
function detectType(q) {
  if (!q) return 'multiple'
  if (q.answers.length === 2) {
    const sorted = [...q.answers].map((a) => a.title.trim().toLowerCase()).sort()
    if (sorted[0] === 'λάθος' && sorted[1] === 'σωστό') return 'truefalse'
  }
  return 'multiple'
}

function initialCorrectSet(question) {
  if (!question) return new Set([0])
  const indices = question.answers
    .map((a, i) => (a.isCorrect ? i : -1))
    .filter((i) => i >= 0)
  return new Set(indices.length > 0 ? indices : [0])
}

// All form state + logic for creating/editing a question.
// Keeps QuestionForm as pure composition.
export function useQuestionForm({ courseId, initialQuestion, onCreated, onUpdated }) {
  const isEdit = Boolean(initialQuestion)

  const [questionType, setQuestionType] = useState(detectType(initialQuestion))
  const [title, setTitle] = useState(initialQuestion?.title || '')
  const [answers, setAnswers] = useState(
    initialQuestion
      ? initialQuestion.answers.map((a) => ({ title: a.title }))
      : [emptyAnswer(), emptyAnswer(), emptyAnswer(), emptyAnswer()]
  )
  const [correctSet, setCorrectSet] = useState(initialCorrectSet(initialQuestion))
  const [error, setError] = useState(null)

  // Both mutations invalidate the course's question list, its settingsInfo and
  // the with-content set on success — the caller no longer refetches by hand.
  const createQuestion = useCreateQuestion(courseId)
  const updateQuestion = useUpdateQuestion(courseId)
  const submitting = createQuestion.isPending || updateQuestion.isPending

  // Image
  const [imageFile, setImageFile] = useState(null)
  const [existingImageUrl, setExistingImageUrl] = useState(initialQuestion?.imageUrl || null)

  function handleImageChange(file) { setImageFile(file) }
  function handleImageRemove() { setImageFile(null); setExistingImageUrl(null) }

  // --- Tab switching ---
  function switchType(type) {
    if (type === questionType) return
    setQuestionType(type)
    setError(null)
    if (type === 'truefalse') {
      setAnswers(TF_ANSWERS.map((a) => ({ ...a })))
      setCorrectSet(new Set([0]))
    } else {
      setAnswers([emptyAnswer(), emptyAnswer(), emptyAnswer(), emptyAnswer()])
      setCorrectSet(new Set())
    }
  }

  // --- Multiple choice helpers ---
  const canAdd = answers.length < MAX_ANSWERS
  const canRemove = answers.length > MIN_ANSWERS

  function updateAnswer(idx, value) {
    setAnswers((prev) => prev.map((a, i) => (i === idx ? { ...a, title: value } : a)))
  }

  function addAnswer() {
    if (!canAdd) return
    setAnswers((prev) => [...prev, emptyAnswer()])
  }

  function removeAnswer(idx) {
    if (!canRemove) return
    setAnswers((prev) => prev.filter((_, i) => i !== idx))
    setCorrectSet((prev) => {
      const next = new Set()
      for (const ci of prev) {
        if (ci === idx) continue
        next.add(ci > idx ? ci - 1 : ci)
      }
      return next
    })
  }

  function toggleCorrect(idx) {
    setCorrectSet((prev) => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  // --- True/false helper ---
  function selectTfCorrect(idx) {
    setCorrectSet(new Set([idx]))
  }

  // --- Validation ---
  function validate() {
    if (!title.trim()) return 'Συμπλήρωσε τίτλο ερώτησης.'
    if (questionType === 'multiple') {
      if (answers.some((a) => !a.title.trim())) return 'Συμπλήρωσε όλες τις απαντήσεις.'
      if (correctSet.size === 0) return 'Επίλεξε τουλάχιστον μία σωστή απάντηση.'
    }
    if (questionType === 'truefalse' && correctSet.size !== 1) {
      return 'Επίλεξε τη σωστή απάντηση.'
    }
    return null
  }

  function resetForNew() {
    setTitle('')
    setError(null)
    setImageFile(null)
    setExistingImageUrl(null)
    if (questionType === 'truefalse') {
      setAnswers(TF_ANSWERS.map((a) => ({ ...a })))
      setCorrectSet(new Set([0]))
    } else {
      setAnswers([emptyAnswer(), emptyAnswer(), emptyAnswer(), emptyAnswer()])
      setCorrectSet(new Set())
    }
  }

  // --- Submit ---
  async function handleSubmit(e) {
    e.preventDefault()
    const validationError = validate()
    if (validationError) { setError(validationError); return }
    setError(null)
    try {
      const answersPayload = answers.map((a, i) => ({
        title: a.title.trim(),
        isCorrect: correctSet.has(i),
      }))
      if (isEdit) {
        // The mutation owns the image reconciliation (upload new / delete cleared).
        await updateQuestion.mutateAsync({
          id: initialQuestion.id,
          payload: {
            title: title.trim(),
            answers: answersPayload,
            imageUrl: existingImageUrl,
          },
          imageFile,
          hadImage: Boolean(initialQuestion.imageUrl),
          keepImageUrl: existingImageUrl,
        })
        onUpdated?.()
      } else {
        await createQuestion.mutateAsync({
          payload: {
            title: title.trim(),
            courseId: Number(courseId),
            answers: answersPayload,
          },
          imageFile,
        })
        resetForNew()
        onCreated?.()
      }
    } catch (err) {
      setError(extractErrorMessage(err, 'Σφάλμα αποθήκευσης.'))
    }
  }

  return {
    isEdit,
    questionType, switchType,
    title, setTitle,
    answers, updateAnswer, addAnswer, removeAnswer, canAdd, canRemove,
    correctSet, toggleCorrect, selectTfCorrect,
    imageFile, existingImageUrl, handleImageChange, handleImageRemove,
    submitting, error,
    handleSubmit,
  }
}
