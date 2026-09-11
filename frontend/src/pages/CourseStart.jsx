// Course landing page: 3-step journey (study/systematic/sandbox). Logic in useCourseStart. Route: /courses/:courseId/start
import { useParams } from 'react-router-dom'
import { Heart, CheckCircle2, Loader2 } from 'lucide-react'
import { useCourseStart } from '../hooks/useCourseStart'
import { useMe, useCourseProgress, useToggleFavoriteCourse, useTogglePassedCourse } from '../hooks/queries'
import { toast } from '../store/toastStore'
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
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={handleFavoriteClick}
              disabled={isFavoriteLoading}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border shadow-sm transition-all duration-150 cursor-pointer disabled:cursor-wait ${
                isFavorite
                  ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-rose-300 dark:hover:border-rose-800 hover:text-rose-600 dark:hover:text-rose-400'
              }`}
            >
              {isFavoriteLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
              ) : (
                <Heart
                  className={`w-4 h-4 transition-transform hover:scale-110 ${
                    isFavorite ? 'fill-rose-500 text-rose-500' : ''
                  }`}
                />
              )}
              <span>{isFavorite ? 'Αγαπημένο' : 'Στα Αγαπημένα'}</span>
            </button>

            {user && (
              <button
                type="button"
                onClick={handlePassedClick}
                disabled={isPassedLoading}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border shadow-sm transition-all duration-150 cursor-pointer disabled:cursor-wait ${
                  isPassed
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-300 dark:hover:border-emerald-800 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
              >
                {isPassedLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                ) : (
                  <CheckCircle2
                    className={`w-4 h-4 transition-transform hover:scale-110 ${
                      isPassed ? 'text-emerald-500 fill-emerald-100 dark:fill-emerald-950' : ''
                    }`}
                  />
                )}
                <span>{isPassed ? 'Περασμένο' : 'Σήμανση ως Περασμένο'}</span>
              </button>
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
