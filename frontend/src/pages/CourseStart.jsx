// Course landing page: 3-step journey (study/systematic/sandbox). Logic in useCourseStart. Route: /courses/:courseId/start
import { useParams } from 'react-router-dom'
import { useCourseStart } from '../hooks/useCourseStart'
import BackButton from '../components/ui/BackButton'
import CourseStartSkeleton from '../components/course/CourseStartSkeleton'
import CourseInfoCard from '../components/course/CourseInfoCard'
import TipsCard from '../components/course/TipsCard'
import ErrorState from '../components/ui/ErrorState'
import JourneyHero from '../components/course/JourneyHero'
import SystematicStudyPanel from '../components/course/SystematicStudyPanel'
import SandboxPanel from '../components/course/SandboxPanel'
import StudyMaterialPanel from '../components/course/StudyMaterialPanel'
import t from '../content/courseStart.json'

function CourseStart() {
  const { courseId } = useParams()
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
              {activeTab === 'study' && <StudyMaterialPanel courseId={courseId} />}

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
              <CourseInfoCard course={course} questionCount={max} coverage={coveragePercentage} />
              <TipsCard />
            </aside>
          </div>
        </>
      )}
    </div>
  )
}

export default CourseStart
