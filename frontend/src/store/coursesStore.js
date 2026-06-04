// Zustand cache store for /courses + with-content. Used by Courses, Admin, AdminCourse, CourseStart.
import { create } from 'zustand'
import { coursesApi, extractErrorMessage } from '../lib/api'

// Caches /courses and /courses/with-content for the lifetime of the SPA session.
// Cleared on full page reload (no persistence — fresh data when user opens tab).
export const useCoursesStore = create((set, get) => ({
  courses: null,           // CourseResponseDto[] | null (null = not yet fetched)
  withContentIds: null,    // Set<courseId> | null
  loading: false,
  loadingWithContent: false,
  error: null,

  // Fetch courses once. Subsequent calls return cached data.
  loadCourses: async () => {
    const state = get()
    if (state.courses != null) return state.courses
    if (state.loading) return null // a concurrent call is already in flight
    set({ loading: true, error: null })
    try {
      const data = await coursesApi.list()
      set({ courses: data, loading: false })
      return data
    } catch (err) {
      set({ loading: false, error: extractErrorMessage(err, 'Σφάλμα φόρτωσης') })
      throw err
    }
  },

  // Silent retry: keeps ErrorState visible (spinner on button) — no skeleton flash.
  retryCourses: async () => {
    const state = get()
    if (state.courses != null) return state.courses
    try {
      const data = await coursesApi.list()
      set({ courses: data, error: null })
      return data
    } catch (err) {
      set({ error: extractErrorMessage(err, 'Σφάλμα φόρτωσης') })
      throw err
    }
  },

  loadWithContent: async () => {
    const state = get()
    if (state.withContentIds != null) return state.withContentIds
    if (state.loadingWithContent) return null
    set({ loadingWithContent: true })
    try {
      const data = await coursesApi.listWithContent()
      const ids = new Set(data.map((c) => c.id))
      set({ withContentIds: ids, loadingWithContent: false })
      return ids
    } catch {
      // badge is non-critical — fail silently
      set({ loadingWithContent: false })
    }
  },

  // Optimistic merge of an updated course (e.g. after settings save).
  applyCourseUpdate: (updated) =>
    set((state) => ({
      courses: state.courses
        ? state.courses.map((c) => (c.id === updated.id ? updated : c))
        : null,
    })),

  // Forget withContent cache so next read refetches (after question add/delete).
  invalidateWithContent: () => set({ withContentIds: null }),
}))
