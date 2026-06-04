// Fetches per-course settings info (set size, timer, totals). Used by useCourseStart and AdminCourse.
import { useCallback, useEffect, useState } from 'react'
import { questionsApi, extractErrorMessage } from '../lib/api'

// Fetches settings info for a course: { totalQuestionCount, setQuestionCount, defaultTimerMinutes }.
// Returns `reload()` (full, with skeletons) and `retry()` (silent, keeps ErrorState visible).
export function useCourseSettings(courseId, fallbackErrorMessage = 'Σφάλμα φόρτωσης') {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    questionsApi.settingsInfo(courseId)
      .then((info) => {
        if (!cancelled) setSettings(info)
      })
      .catch((err) => {
        if (!cancelled) setError(extractErrorMessage(err, fallbackErrorMessage))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [courseId, fallbackErrorMessage, reloadKey])

  const reload = () => setReloadKey((k) => k + 1)

  // Silent retry: keeps ErrorState visible (spinner on button) — no skeleton flash.
  const retry = useCallback(async () => {
    try {
      const info = await questionsApi.settingsInfo(courseId)
      setSettings(info)
      setError(null)
    } catch (err) {
      setError(extractErrorMessage(err, fallbackErrorMessage))
    }
  }, [courseId, fallbackErrorMessage])

  return { settings, loading, error, reload, retry }
}
