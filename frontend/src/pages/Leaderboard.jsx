// Leaderboard & Analytics page. Route: /leaderboard
import { useState, useMemo, useEffect } from 'react'
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  BookOpen,
  Flame,
} from 'lucide-react'
import {
  useCourses,
  useLeaderboardPopularCourses,
} from '../hooks/queries'
import CourseSearchCombobox from '../components/leaderboard/CourseSearchCombobox'
import LeaderboardTabContent from '../components/leaderboard/LeaderboardTabContent'
import t from '../content/leaderboard.json'

const TAB_ICONS = {
  users: Trophy,
  byCourse: Medal,
  popularCourses: Flame,
  coursesAvg: TrendingUp,
  helpers: Award,
}

function Leaderboard() {
  const [activeTab, setActiveTab] = useState('users')
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const { data: courses } = useCourses()
  const popularQuery = useLeaderboardPopularCourses()

  // Track courses that have quizzes completed
  const coursesWithQuizzesSet = useMemo(() => {
    if (!popularQuery.data) return new Set()
    return new Set(popularQuery.data.map((p) => p.name))
  }, [popularQuery.data])

  const sortedCourses = useMemo(() => {
    if (!courses) return []
    return [...courses].sort((a, b) => {
      // Prioritize courses with quiz data
      const aHas = coursesWithQuizzesSet.has(a.name) ? 1 : 0
      const bHas = coursesWithQuizzesSet.has(b.name) ? 1 : 0
      if (aHas !== bHas) return bHas - aHas
      return a.name.localeCompare(b.name, 'el')
    })
  }, [courses, coursesWithQuizzesSet])

  // Automatically select the most popular course (which has real quiz data)
  useEffect(() => {
    if (!selectedCourseId && courses && courses.length > 0) {
      if (popularQuery.data && popularQuery.data.length > 0) {
        const topCourseName = popularQuery.data[0].name
        const match = courses.find((c) => c.name === topCourseName)
        if (match) {
          setSelectedCourseId(String(match.id))
          return
        }
      }
      setSelectedCourseId(String(courses[0].id))
    }
  }, [selectedCourseId, courses, popularQuery.data])

  const handleTabChange = (key) => {
    setActiveTab(key)
    if (key === 'byCourse' && !selectedCourseId && sortedCourses.length > 0) {
      setSelectedCourseId(String(sortedCourses[0].id))
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-8 sm:py-10 px-4 sm:px-6 space-y-8 animate-fade-up">
      {/* Header */}
      <div className="text-center sm:text-left space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 text-xs font-semibold">
          <Trophy className="w-3.5 h-3.5" />
          <span>Leaderboard & Analytics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {t.title}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800">
        {Object.entries(t.tabs).map(([key, label]) => {
          const Icon = TAB_ICONS[key] || Trophy
          const isActive = activeTab === key

          return (
            <button
              key={key}
              type="button"
              onClick={() => handleTabChange(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab description + Course selector */}
      <div className="space-y-4">
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          {t.tabDescriptions[activeTab]}
        </p>

        {/* Clean Searchable Course Selector for byCourse tab */}
        {activeTab === 'byCourse' && (
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 text-xs sm:text-sm font-semibold">
              <BookOpen className="w-4 h-4" />
              <span>{t.courseSelect.label}</span>
            </div>

            <CourseSearchCombobox
              courses={sortedCourses}
              selectedCourseId={selectedCourseId}
              onSelectCourse={(id) => setSelectedCourseId(id)}
              coursesWithQuizzesSet={coursesWithQuizzesSet}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <LeaderboardTabContent
        activeTab={activeTab}
        selectedCourseId={selectedCourseId}
      />
    </div>
  )
}

export default Leaderboard
