// Data + derivation + start-test logic for the CourseStart page. Used by CourseStart.
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { questionsApi, extractErrorMessage } from '../lib/api'
import { useTestStore } from '../store/testStore'
import { useCourse, useCourseSettings } from './queries'
import { toast } from '../store/toastStore'
import t from '../content/courseStart.json'

const TIMER_PRESET_MINUTES = [null, 10, 15, 30]

// All data, derivation and start-test logic for the CourseStart page.
// Keeps the page itself purely presentational.
export function useCourseStart(courseId) {
  const navigate = useNavigate()
  const startSession = useTestStore((s) => s.startSession)

  const {
    course,
    error: coursesError,
    isPending: coursesPending,
    refetch: refetchCourses,
  } = useCourse(courseId, t.errorLoad)

  const {
    settings,
    error: settingsError,
    isPending: settingsLoading,
    refetch: refetchSettings,
  } = useCourseSettings(courseId, t.errorLoad)

  const [activeTab, setActiveTab] = useState('study')
  const [count, setCount] = useState(10)
  const [durationSeconds, setDurationSeconds] = useState(null)
  const [starting, setStarting] = useState(false)

  // Completed sets will come from the user model (backend) — interface only for now.
  const completedSets = {}

  // Initialize sandbox defaults once settings arrive
  useEffect(() => {
    if (!settings) return
    const total = settings.totalQuestionCount || 0
    if (total > 0) setCount(Math.min(10, total))
    if (settings.defaultTimerMinutes) setDurationSeconds(settings.defaultTimerMinutes * 60)
  }, [settings])

  // Page-load error (settings/courses) hides the page; an action error (failing
  // to fetch questions on start) is shown as a toast so the page stays usable.
  const error = settingsError || coursesError
  const loading = !error && (settingsLoading || coursesPending)

  const max = settings?.totalQuestionCount || 0
  const SET_SIZE = settings?.setQuestionCount || 25
  const canStart = max > 0 && count >= 1 && count <= max
  const totalSets = Math.ceil(max / SET_SIZE)

  const sets = useMemo(
    () =>
      Array.from({ length: totalSets }, (_, i) => ({
        index: i,
        start: i * SET_SIZE + 1,
        end: Math.min((i + 1) * SET_SIZE, max),
        count: Math.min(SET_SIZE, max - i * SET_SIZE),
      })),
    [totalSets, SET_SIZE, max]
  )

  const coveragePercentage = useMemo(() => {
    if (max === 0) return 0
    let covered = 0
    sets.forEach((s) => { if (completedSets[s.index]) covered += s.count })
    return Math.round((covered / max) * 100)
  }, [sets, max])

  const timerOptions = useMemo(() => {
    const minutesSet = new Set(TIMER_PRESET_MINUTES)
    if (settings?.defaultTimerMinutes != null) minutesSet.add(settings.defaultTimerMinutes)
    const minutes = [...minutesSet].sort((a, b) => {
      if (a == null) return -1
      if (b == null) return 1
      return a - b
    })
    return minutes.map((m) => ({
      value: m == null ? null : m * 60,
      label: m == null ? t.sandbox.timerNone : t.sandbox.timerMinutesTemplate.replace('{minutes}', m),
    }))
  }, [settings])

  async function handleStart() {
    if (!canStart || starting) return
    setStarting(true)
    try {
      const questions = await questionsApi.byRandomCount(courseId, count)
      startSession({
        courseId: Number(courseId),
        courseName: course?.name || t.fallbackTitle.replace('{courseId}', courseId),
        count,
        durationSeconds,
        order: 'random',
        questions,
        setIndex: null,
      })
      navigate(`/test/${courseId}`)
    } catch (err) {
      toast.error(extractErrorMessage(err, t.errorStartTest))
      setStarting(false)
    }
  }

  async function handleStartSet(set) {
    if (starting) return
    setStarting(true)
    try {
      const questions = await questionsApi.bySetNum(courseId, set.index)
      const timerSec = settings?.defaultTimerMinutes
        ? settings.defaultTimerMinutes * 60
        : null
      startSession({
        courseId: Number(courseId),
        courseName: course?.name || t.fallbackTitle.replace('{courseId}', courseId),
        count: set.count,
        durationSeconds: timerSec,
        order: 'sequential',
        questions,
        setIndex: set.index,
        totalSets,
      })
      navigate(`/test/${courseId}`)
    } catch (err) {
      toast.error(extractErrorMessage(err, t.errorStartSet))
      setStarting(false)
    }
  }

  // Background refetch: ErrorState stays mounted (spinner on its button) instead
  // of collapsing back to skeletons.
  function onRetry() {
    refetchCourses()
    refetchSettings()
  }

  return {
    course,
    settings,
    loading,
    error,
    onRetry,
    activeTab,
    setActiveTab,
    max,
    SET_SIZE,
    totalSets,
    sets,
    coveragePercentage,
    completedSets,
    count,
    setCount,
    durationSeconds,
    setDurationSeconds,
    timerOptions,
    canStart,
    starting,
    handleStart,
    handleStartSet,
  }
}
