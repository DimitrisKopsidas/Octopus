// Course landing page: 3-step journey (study/systematic/sandbox). Logic in useCourseStart. Route: /courses/:courseId/start
import { useParams } from 'react-router-dom'
import { Heart, CheckCircle2 } from 'lucide-react'
import { useCourseStart } from '../hooks/useCourseStart'
import { useMe, useCourseProgress, useToggleFavoriteCourse, useTogglePassedCourse } from '../hooks/queries'
import { toast } from '../store/toastStore'
import BackButton from '../components/ui/BackButton'
import CourseStartSkeleton from '../components/course/CourseStartSkeleton'
import CourseInfoCard from '../components/course/CourseInfoCard'
import CourseToggleButton from '../components/course/CourseToggleButton'
import TipsCard from '../components/course/TipsCard'
import ErrorState from '../components/ui/ErrorState'
import JourneyHero from '../components/course/JourneyHero'
import SystematicStudyPanel from '../components/course/SystematicStudyPanel'
import SandboxPanel from '../components/course/SandboxPanel'
import StudyMaterialPanel from '../components/course/StudyMaterialPanel'
import t from '../content/courseStart.json'

function CourseStart() {
  const { courseId } = useParams()
  const { user } = useMe()
  const { progress } = useCourseProgress(courseId)
  const toggleFavorite = useToggleFavoriteCourse()
  const togglePassed = useTogglePassedCourse()

  const isFavorite = Boolean(progress?.isFavorite)
  const isPassed = Boolean(progress?.isPassed)
  const isFavoriteLoading = toggleFavorite.isPending && String(toggleFavorite.variables) === String(courseId)
  const isPassedLoading = togglePassed.isPending && String(togglePassed.variables) === String(courseId)

  const handleFavoriteClick = () => {
    if (!user) {
      toast.info('Συνδέσου για να προσθέσεις μαθήματα στα αγαπημένα.')
      return
    }
    toggleFavorite.mutate(courseId)
  }

  const handlePassedClick = () => {
    if (!user) {
      toast.info('Συνδέσου για να σημειώσεις μαθήματα ως περασμένα.')
      return
    }
    togglePassed.mutate(courseId)
  }

  const {
    course, settings, loading, error, onRetry,
    activeTab, setActiveTab,
    max, SET_SIZE, totalSets, sets, coveragePercentage, completedSets,
    count, setCount, durationSeconds, setDurationSeconds, timerOptions,
    canStart, starting, handleStart, handleStartSet,
  } = useCourseStart(courseId)

  return (
    <div>
      <div className="mb-6">
        <BackButton to="/courses" label={t.backLabel} />
      </div>

      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-200">
            {course ? course.name : t.fallbackTitle.replace('{courseId}', courseId)}
          </h1>
          {course && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t.subheader.replace('{id}', course.id).replace('{semester}', course.semester)}
            </p>
          )}
        </div>

        {course && (
          <div className="flex items-center gap-1 self-start sm:self-auto shrink-0">
            <CourseToggleButton
              icon={Heart}
              tone="red"
              size="lg"
              active={isFavorite}
              pending={isFavoriteLoading}
              onClick={handleFavoriteClick}
              label={isFavorite ? 'Αφαίρεση από τα αγαπημένα' : 'Προσθήκη στα αγαπημένα'}
            />

            {user && (
              <CourseToggleButton
                icon={CheckCircle2}
                tone="brand"
                size="lg"
                active={isPassed}
                pending={isPassedLoading}
                onClick={handlePassedClick}
                label={isPassed ? 'Σήμανση ως μη περασμένο' : 'Σήμανση ως περασμένο'}
              />
            )}
          </div>
        )}
      </div>

      {loading && <CourseStartSkeleton />}

      {error && !loading && (
        <ErrorState message={error} onRetry={onRetry} />
      )}

      {!loading && !error && max === 0 && (
        <div className="rounded-lg bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-1">{t.emptyCourse.title}</p>
          <p className="text-sm text-slate-500 dark:text-slate-500">{t.emptyCourse.hint}</p>
        </div>
      )}

      {!loading && !error && max > 0 && (
        <>
          <JourneyHero activeTab={activeTab} onSelect={setActiveTab} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-2 space-y-6">
              {activeTab === 'study' && <StudyMaterialPanel courseId={courseId} setSize={SET_SIZE} />}

              {activeTab === 'systematic' && (
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
              )}

              {activeTab === 'sandbox' && (
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
              <CourseInfoCard
                course={course}
                questionCount={max}
                coverage={coveragePercentage}
                isFavorite={isFavorite}
                isPassed={isPassed}
              />
              <TipsCard />
            </aside>
          </div>
        </>
      )}
    </div>
  )
}

export default CourseStart
