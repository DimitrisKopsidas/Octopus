import { create } from 'zustand'

const initialState = {
  courseId: null,
  courseName: '',
  count: 0,
  durationSeconds: null, // null = no timer
  order: 'sequential',   // reserved for future random support
  questions: [],
  currentIndex: 0,
  answers: {},           // { [questionId]: answerId }
  flaggedIds: new Set(), // questionIds flagged for review
  startedAt: null,
  endedAt: null,
  setIndex: null,        // null for custom test, number (0, 1, 2...) for fixed sets
}

export const useTestStore = create((set) => ({
  ...initialState,

  startSession: ({ courseId, courseName, count, durationSeconds, order, questions, setIndex = null }) =>
    set({
      courseId,
      courseName,
      count,
      durationSeconds,
      order,
      questions,
      currentIndex: 0,
      answers: {},
      flaggedIds: new Set(),
      startedAt: Date.now(),
      endedAt: null,
      setIndex,
    }),

  selectAnswer: (questionId, answerId) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: answerId },
    })),

  clearAnswer: (questionId) =>
    set((state) => {
      if (state.answers[questionId] == null) return {}
      const next = { ...state.answers }
      delete next[questionId]
      return { answers: next }
    }),

  toggleFlag: (questionId) =>
    set((state) => {
      const next = new Set(state.flaggedIds)
      if (next.has(questionId)) next.delete(questionId)
      else next.add(questionId)
      return { flaggedIds: next }
    }),

  goNext: () =>
    set((state) => ({
      currentIndex: Math.min(state.currentIndex + 1, state.questions.length - 1),
    })),

  goPrev: () =>
    set((state) => ({
      currentIndex: Math.max(state.currentIndex - 1, 0),
    })),

  goTo: (index) =>
    set((state) => ({
      currentIndex: Math.max(0, Math.min(index, state.questions.length - 1)),
    })),

  finish: () => set({ endedAt: Date.now() }),

  reset: () => set({ ...initialState, flaggedIds: new Set() }),
}))
