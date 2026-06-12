// Zustand store for the active test session (questions, answers, flags) with sessionStorage persistence. Used by Test, Results, CourseStart.
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const initialState = {
  courseId: null,
  courseName: '',
  count: 0,
  durationSeconds: null, // null = no timer
  order: 'sequential',
  questions: [],
  currentIndex: 0,
  answers: {},           // { [questionId]: answerId | answerId[] } — array for multi-correct questions
  flaggedIds: new Set(), // questionIds flagged for review
  startedAt: null,
  endedAt: null,
  setIndex: null,        // null for custom test, number (0, 1, 2...) for fixed sets
  totalSets: null,       // total number of sets (systematic only)
}

export const useTestStore = create(
  persist(
    (set) => ({
      ...initialState,

      startSession: ({ courseId, courseName, count, durationSeconds, order, questions, setIndex = null, totalSets = null }) =>
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
          totalSets,
        }),

      // Single-correct questions: store one id, replacing any previous choice.
      selectAnswer: (questionId, answerId) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: answerId },
        })),

      // Multiple-correct questions: toggle an id within an array.
      // When the array empties, the question becomes "unanswered" again.
      toggleAnswer: (questionId, answerId) =>
        set((state) => {
          const cur = state.answers[questionId]
          const arr = Array.isArray(cur) ? cur : cur == null ? [] : [cur]
          const nextArr = arr.includes(answerId)
            ? arr.filter((id) => id !== answerId)
            : [...arr, answerId]
          const next = { ...state.answers }
          if (nextArr.length === 0) delete next[questionId]
          else next[questionId] = nextArr
          return { answers: next }
        }),

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
    }),
    {
      name: 'octopus-test-session',
      storage: createJSONStorage(() => sessionStorage),
      // Only persist data fields (Set serialized as Array)
      partialize: (state) => ({
        courseId: state.courseId,
        courseName: state.courseName,
        count: state.count,
        durationSeconds: state.durationSeconds,
        order: state.order,
        questions: state.questions,
        currentIndex: state.currentIndex,
        answers: state.answers,
        flaggedIds: [...state.flaggedIds],
        startedAt: state.startedAt,
        endedAt: state.endedAt,
        setIndex: state.setIndex,
        totalSets: state.totalSets,
      }),
      // Rehydrate Set from Array
      merge: (persisted, current) => ({
        ...current,
        ...(persisted || {}),
        flaggedIds: new Set(persisted?.flaggedIds || []),
      }),
    }
  )
)
