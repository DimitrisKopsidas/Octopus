// All server-state access for the app: one useQuery/useMutation hook per concern.
// Replaces the hand-rolled coursesStore cache + per-page useEffect fetching.
//
// Conventions used throughout:
// - `isPending` -> first load, show skeletons.
// - `isFetching` -> any in-flight fetch (including a silent background refetch),
//   which is what powers the old "retry without skeleton flash" behaviour.
// - Errors are mapped to a plain Greek string via toMessage so ErrorState and
//   the toast store keep working unchanged.
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { coursesApi, questionsApi, bundlesApi } from '../lib/api'
import { qk, toMessage } from '../lib/queryClient'

/* ------------------------------------------------------------------ courses */

// Full course catalogue. Shared by /courses, /admin, /courses/:id/start.
export function useCourses(fallbackError = 'Σφάλμα φόρτωσης') {
  const q = useQuery({
    queryKey: qk.courses.list(),
    queryFn: coursesApi.list,
  })
  return { ...q, error: q.error ? toMessage(q.error, fallbackError) : null }
}

// Module-level (stable reference) so TanStack can memoize the transform.
// An inline arrow here would re-run select on every render and hand back a new
// Set each time, invalidating every downstream useMemo that depends on it.
const toIdSet = (data) => new Set(data.map((c) => c.id))

// Ids of courses that actually have questions — drives the "has content" badge
// and the disabled state on course cards. Non-critical: failures stay silent,
// exactly like the old store's swallowed catch.
export function useCoursesWithContent() {
  return useQuery({
    queryKey: qk.courses.withContent(),
    queryFn: coursesApi.listWithContent,
    select: toIdSet,
  })
}

// Convenience: a single course out of the cached list, without a dedicated
// endpoint. Returns null while the list is still loading.
export function useCourse(courseId, fallbackError) {
  const { data, error, isPending, isFetching, refetch } = useCourses(fallbackError)
  const course = data?.find((c) => String(c.id) === String(courseId)) || null
  return { course, error, isPending, isFetching, refetch }
}

/* ---------------------------------------------------------------- questions */

// Per-course quiz settings (totalQuestionCount, setQuestionCount, defaultTimerMinutes).
// Previously useCourseSettings.js — a bespoke useState/useEffect fetcher with no cache.
export function useCourseSettings(courseId, fallbackError = 'Σφάλμα φόρτωσης') {
  const q = useQuery({
    queryKey: qk.questions.settings(courseId),
    queryFn: () => questionsApi.settingsInfo(courseId),
    enabled: courseId != null,
  })
  return { ...q, settings: q.data ?? null, error: q.error ? toMessage(q.error, fallbackError) : null }
}

// Admin question list for one course.
export function useCourseQuestions(courseId, fallbackError = 'Σφάλμα φόρτωσης') {
  const q = useQuery({
    queryKey: qk.questions.byCourse(courseId),
    queryFn: () => questionsApi.listByCourse(courseId),
    enabled: courseId != null,
  })
  return { ...q, questions: q.data ?? [], error: q.error ? toMessage(q.error, fallbackError) : null }
}

/* -------------------------------------------------------------- home stats */

// Landing-page counters. Both are decorative, so errors are swallowed and the
// UI falls back to null (hides the stats band).
export function useHomeStats() {
  const tests = useQuery({
    queryKey: qk.bundles.count(),
    queryFn: bundlesApi.count,
    retry: false,
  })
  const courses = useQuery({
    queryKey: qk.courses.countWithContent(),
    queryFn: coursesApi.countWithContent,
    retry: false,
  })
  return {
    tests: tests.data ?? null,
    courses: courses.data ?? null,
  }
}

/* ------------------------------------------------------------------ writes */

// Central invalidation helper. Every question write touches three things:
//   1. the admin question list for that course
//   2. settingsInfo (totalQuestionCount changes -> set count / sandbox max)
//   3. the with-content id set (a course can gain or lose its first/last question)
// Getting (2) and (3) right by hand was the bug-prone part of the old store.
function useInvalidateCourseContent() {
  const qc = useQueryClient()
  return (courseId) => {
    qc.invalidateQueries({ queryKey: qk.questions.byCourse(courseId) })
    qc.invalidateQueries({ queryKey: qk.questions.settings(courseId) })
    qc.invalidateQueries({ queryKey: qk.courses.withContent() })
    qc.invalidateQueries({ queryKey: qk.courses.countWithContent() })
  }
}

// Create a question, then (optionally) attach its image.
// The image is a second request by design: the filename needs the new question id.
export function useCreateQuestion(courseId) {
  const invalidate = useInvalidateCourseContent()
  return useMutation({
    mutationFn: async ({ payload, imageFile }) => {
      const created = await questionsApi.create(payload)
      if (imageFile && created?.id != null) {
        await questionsApi.uploadImage(created.id, imageFile)
      }
      return created
    },
    onSuccess: () => invalidate(courseId),
  })
}

// Update a question and reconcile its image: upload a newly picked file, or
// delete the existing one if the user cleared it.
export function useUpdateQuestion(courseId) {
  const invalidate = useInvalidateCourseContent()
  return useMutation({
    mutationFn: async ({ id, payload, imageFile, hadImage, keepImageUrl }) => {
      const updated = await questionsApi.update(id, payload)
      if (imageFile) {
        await questionsApi.uploadImage(id, imageFile)
      } else if (hadImage && !keepImageUrl) {
        await questionsApi.deleteImage(id)
      }
      return updated
    },
    onSuccess: () => invalidate(courseId),
  })
}

// Soft-delete (PATCH toggles isActive server-side).
export function useDeleteQuestion(courseId) {
  const invalidate = useInvalidateCourseContent()
  return useMutation({
    mutationFn: (questionId) => questionsApi.remove(questionId),
    onSuccess: () => invalidate(courseId),
  })
}

// Course settings (set size + default timer). Writes the fresh course straight
// into the cached list so the header updates without a refetch, then invalidates
// settingsInfo because setQuestionCount is derived from it.
export function useUpdateCourseSettings(courseId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload) => coursesApi.update(courseId, payload),
    onSuccess: (updated) => {
      qc.setQueryData(qk.courses.list(), (prev) =>
        prev ? prev.map((c) => (c.id === updated.id ? updated : c)) : prev
      )
      qc.invalidateQueries({ queryKey: qk.questions.settings(courseId) })
    },
  })
}
