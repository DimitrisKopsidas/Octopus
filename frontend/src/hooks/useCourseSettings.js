import { useEffect, useState } from 'react'
import { questionsApi } from '../lib/api'

// Fetches settings info for a course: { totalQuestionCount, setQuestionCount, defaultTimerMinutes }.
export function useCourseSettings(courseId, fallbackErrorMessage = 'Σφάλμα φόρτωσης') {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    questionsApi.settingsInfo(courseId)
      .then((info) => {
        if (!cancelled) setSettings(info)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || fallbackErrorMessage)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [courseId, fallbackErrorMessage])

  return { settings, loading, error }
}
