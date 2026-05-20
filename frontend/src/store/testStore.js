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
  startedAt: null,
  endedAt: null,
}

export const useTestStore = create((set) => ({
  ...initialState,

  startSession: ({ courseId, courseName, count, durationSeconds, order, questions }) =>
    set({
      courseId,
      courseName,
      count,
      durationSeconds,
      order,
      questions,
      currentIndex: 0,
      answers: {},
      startedAt: Date.now(),
      endedAt: null,
    }),

  selectAnswer: (questionId, answerId) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: answerId },
    })),

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

  reset: () => set(initialState),
}))
