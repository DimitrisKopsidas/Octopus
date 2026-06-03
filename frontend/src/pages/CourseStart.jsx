import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { questionsApi } from '../lib/api'
import { useCoursesStore } from '../store/coursesStore'
import { useTestStore } from '../store/testStore'
import { useCourseSettings } from '../hooks/useCourseSettings'
import { toast } from '../store/toastStore'
import BackButton from '../components/ui/BackButton'
import CourseStartSkeleton from '../components/course/CourseStartSkeleton'
import CourseInfoCard from '../components/course/CourseInfoCard'
import TipsCard from '../components/course/TipsCard'
import ErrorState from '../components/ui/ErrorState'
import SystematicStudyPanel from '../components/course/SystematicStudyPanel'
import SandboxPanel from '../components/course/SandboxPanel'
import t from '../content/courseStart.json'

const TIMER_PRESET_MINUTES = [null, 5, 10, 15, 30]

function CourseStart() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const startSession = useTestStore((s) => s.startSession)

  const courses = useCoursesStore((s) => s.courses)
  const coursesError = useCoursesStore((s) => s.error)
  const loadCourses = useCoursesStore((s) => s.loadCourses)
  const course = useMemo(
    () => courses?.find((c) => String(c.id) === String(courseId)) || null,
    [courses, courseId]
  )

  const { settings, loading: settingsLoading, error: settingsError, reload: reloadSettings } =
    useCourseSettings(courseId, t.errorLoad)

  const [activeTab, setActiveTab] = useState('systematic')
  const [count, setCount] = useState(10)
  const [durationSeconds, setDurationSeconds] = useState(null)
  const [starting, setStarting] = useState(false)

  // Completed sets will come from the user model (backend) — interface only for now.
  const completedSets = {}

  useEffect(() => { loadCourses().catch(() => {}) }, [loadCourses])

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
  const loading = !error && (settingsLoading || courses == null)

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
      toast.error(err.message || t.errorStartTest)
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
      })
      navigate(`/test/${courseId}`)
    } catch (err) {
      toast.error(err.message || t.errorStartSet)
      setStarting(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <BackButton to="/courses" label={t.backLabel} />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {course ? course.name : t.fallbackTitle.replace('{courseId}', courseId)}
        </h1>
        {course && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.subheader.replace('{id}', course.id).replace('{semester}', course.semester)}
          </p>
        )}
      </div>

      {loading && <CourseStartSkeleton />}

      {error && !loading && (
        <ErrorState
          message={error}
          onRetry={() => { loadCourses().catch(() => {}); reloadSettings() }}
        />
      )}

      {!loading && !error && max === 0 && (
        <div className="rounded-lg bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-1">{t.emptyCourse.title}</p>
          <p className="text-sm text-slate-500 dark:text-slate-500">{t.emptyCourse.hint}</p>
        </div>
      )}

      {!loading && !error && max > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2 space-y-6">
            <div className="flex border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-1 gap-1">
              <TabButton active={activeTab === 'systematic'} onClick={() => setActiveTab('systematic')}>
                {t.tabs.systematic}
              </TabButton>
              <TabButton active={activeTab === 'sandbox'} onClick={() => setActiveTab('sandbox')}>
                {t.tabs.sandbox}
              </TabButton>
            </div>

            {activeTab === 'systematic' ? (
              <SystematicStudyPanel
                total={max}
                setSize={SET_SIZE}
                totalSets={totalSets}
                sets={sets}
                completedSets={completedSets}
                defaultTimerMinutes={settings?.defaultTimerMinutes}
                coveragePercentage={coveragePercentage}
                starting={starting}
                onStartSet={handleStartSet}
              />
            ) : (
              <SandboxPanel
                max={max}
                count={count}
                setCount={setCount}
                durationSeconds={durationSeconds}
                setDurationSeconds={setDurationSeconds}
                timerOptions={timerOptions}
                coveragePercentage={coveragePercentage}
                starting={starting}
                canStart={canStart}
                onStart={handleStart}
              />
            )}
          </div>

          <aside className="space-y-4">
            <CourseInfoCard course={course} questionCount={max} coverage={coveragePercentage} />
            <TipsCard />
          </aside>
        </div>
      )}
    </div>
  )
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 text-center py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
        active
          ? 'bg-brand-600 text-white shadow-sm'
          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40'
      }`}
    >
      {children}
    </button>
  )
}

export default CourseStart
