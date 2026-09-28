import { useState, useMemo, useEffect, useRef } from 'react'
import { BookOpen } from 'lucide-react'
import {
  useLeaderboardUsersAvg,
  useLeaderboardByCourse,
  useLeaderboardPopularCourses,
  useLeaderboardCoursesAvg,
  useLeaderboardHelpersTotalQuestions,
  useMe,
} from '../../hooks/queries'
import ErrorState from '../ui/ErrorState'
import Skeleton from '../ui/Skeleton'
import Pagination from '../ui/Pagination'
import Podium from './Podium'
import LeaderboardList from './LeaderboardList'
import LeaderboardUserCard from './LeaderboardUserCard'
import { isCurrentUserRow } from './leaderboardUtils'
import t from '../../content/leaderboard.json'

function LeaderboardTabContent({ activeTab, selectedCourseId }) {
  const { user } = useMe()
  const [page, setPage] = useState(1)
  const listRef = useRef(null)

  const usersAvgQuery = useLeaderboardUsersAvg()
  const byCourseQuery = useLeaderboardByCourse(selectedCourseId)
  const popularQuery = useLeaderboardPopularCourses()
  const coursesAvgQuery = useLeaderboardCoursesAvg()
  const helpersQuery = useLeaderboardHelpersTotalQuestions()

  // Reset page when switching tab or changing selected course
  useEffect(() => {
    setPage(1)
  }, [activeTab, selectedCourseId])

  const currentQuery = useMemo(() => {
    switch (activeTab) {
      case 'users':
        return usersAvgQuery
      case 'byCourse':
        return byCourseQuery
      case 'popularCourses':
        return popularQuery
      case 'coursesAvg':
        return coursesAvgQuery
      case 'helpers':
        return helpersQuery
      default:
        return usersAvgQuery
    }
  }, [activeTab, usersAvgQuery, byCourseQuery, popularQuery, coursesAvgQuery, helpersQuery])

  if (activeTab === 'byCourse' && !selectedCourseId) {
    return (
      <div className="text-center py-12 px-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
        <BookOpen className="w-10 h-10 text-brand-500 mx-auto mb-3 opacity-80" />
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {t.empty.noCourseSelected}
        </p>
      </div>
    )
  }

  if (currentQuery.isPending) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-14 w-full rounded-xl" />
      </div>
    )
  }

  if (currentQuery.error) {
    return (
      <ErrorState
        title={t.errorLoad}
        message={currentQuery.error}
        onRetry={() => currentQuery.refetch()}
      />
    )
  }

  const items = currentQuery.data || []
  const PAGE_SIZE = 10
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const startIndex = (safePage - 1) * PAGE_SIZE
  const paginatedItems = items.slice(startIndex, startIndex + PAGE_SIZE)

  // Find logged-in user position if in user-oriented tabs
  const isUserTab = activeTab === 'users' || activeTab === 'byCourse' || activeTab === 'helpers'
  const currentUserRankIndex = isUserTab && user ? items.findIndex((r) => isCurrentUserRow(r, user, activeTab)) : -1
  const currentUserRank = currentUserRankIndex !== -1 ? currentUserRankIndex + 1 : null
  const currentUserRow = currentUserRankIndex !== -1 ? items[currentUserRankIndex] : null

  // Only show the podium/bases on helpers (and users) and on page 1! Exclude courses (popular and coursesAvg).
  const showPodium = (activeTab === 'helpers' || activeTab === 'users') && items.length > 0 && safePage === 1

  const handleGoToPage = (targetPage) => {
    setPage(targetPage)
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div ref={listRef} className="space-y-6 scroll-mt-20">
      {/* Current user rank indicator or unauthenticated prompt */}
      <LeaderboardUserCard
        user={user}
        isUserTab={isUserTab}
        currentUserRank={currentUserRank}
        currentUserRow={currentUserRow}
        total={total}
        safePage={safePage}
        totalPages={totalPages}
        pageSize={PAGE_SIZE}
        tab={activeTab}
        onGoToUserPage={handleGoToPage}
      />

      {showPodium && <Podium items={items} tab={activeTab} />}

      <LeaderboardList
        items={paginatedItems}
        tab={activeTab}
        startIndex={startIndex}
        currentUserRankIndex={currentUserRankIndex}
        currentUserRow={currentUserRow}
        currentUserRank={currentUserRank}
        pageSize={PAGE_SIZE}
        onGoToPage={handleGoToPage}
      />

      <Pagination
        page={safePage}
        totalPages={totalPages}
        onChange={handleGoToPage}
        prevLabel={t.pagination?.prev || 'Προηγούμενο'}
        nextLabel={t.pagination?.next || 'Επόμενο'}
        pageTemplate={t.pagination?.pageTemplate || 'Σελίδα {current} από {total}'}
      />
    </div>
  )
}

export default LeaderboardTabContent
