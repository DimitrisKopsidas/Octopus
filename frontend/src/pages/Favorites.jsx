// Favorites page. Route: /favorites
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useMe, useCourses, useCourseProgressList, useToggleFavoriteCourse, useTogglePassedCourse } from '../hooks/queries'
import CourseCard from '../components/course/CourseCard'
import CourseCardSkeleton from '../components/course/CourseCardSkeleton'
import Skeleton from '../components/ui/Skeleton'
import t from '../content/favorites.json'

function Favorites() {
  const { user, isLoading: loadingUser } = useMe()
  const { data: courses, isLoading: loadingCourses } = useCourses(t.errorLoad)
  const { progressMap, isLoading: loadingProgress } = useCourseProgressList()
  const toggleFavoriteMutation = useToggleFavoriteCourse()
  const togglePassedMutation = useTogglePassedCourse()

  const pendingFavoriteId = toggleFavoriteMutation.isPending ? toggleFavoriteMutation.variables : null
  const pendingPassedId = togglePassedMutation.isPending ? togglePassedMutation.variables : null

  const loading = loadingUser || (user && (loadingCourses || loadingProgress))

  const favoriteCourses = useMemo(() => {
    if (!courses || !progressMap) return []
    return courses
      .filter((c) => Boolean(progressMap[c.id]?.isFavorite))
      .sort((a, b) => {
        if (a.semester !== b.semester) return a.semester - b.semester
        return a.name.localeCompare(b.name, 'el')
      })
  }, [courses, progressMap])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <div className="relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-2xl rounded-3xl p-8 sm:p-10 text-center animate-fade-up">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-500 flex items-center justify-center mx-auto mb-5 shadow-sm">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Απαιτείται Σύνδεση</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Συνδέσου στο λογαριασμό σου για να δεις τα αγαπημένα σου μαθήματα.</p>
          <Link to="/login" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md transition-all">
            Σύνδεση
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <span className="text-rose-500">❤️</span>
          {t.title}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          {t.subtitle}
        </p>
      </div>

      {favoriteCourses.length === 0 ? (
        /* Empty State Card */
        <div className="relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl rounded-3xl p-10 text-center">
          <div className="w-20 h-20 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-500 flex items-center justify-center mx-auto mb-5 shadow-sm">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {t.emptyTitle}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto mb-8">
            {t.emptyMessage}
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-semibold text-sm shadow-lg shadow-brand-600/25 transition-all transform hover:-translate-y-0.5"
          >
            <span>{t.exploreButton}</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteCourses.map((course) => {
            const hasContent = (course.questionCount || 0) > 0
            const disabled = !hasContent
            const progress = progressMap[course.id]
            return (
              <CourseCard
                key={course.id}
                course={course}
                hasContent={hasContent}
                disabled={disabled}
                isFavorite={true}
                isPassed={Boolean(progress?.isPassed)}
                onToggleFavorite={(id) => toggleFavoriteMutation.mutate(id)}
                onTogglePassed={(id) => togglePassedMutation.mutate(id)}
                isFavoriteLoading={String(pendingFavoriteId) === String(course.id)}
                isPassedLoading={String(pendingPassedId) === String(course.id)}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Favorites
