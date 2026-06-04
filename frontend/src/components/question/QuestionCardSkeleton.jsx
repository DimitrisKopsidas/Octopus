// Loading skeleton for QuestionCard. Used by AdminCourse.
import Skeleton from '../ui/Skeleton'

function QuestionCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <Skeleton className="h-5 w-2/3" />
        <div className="flex items-center gap-1 shrink-0">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-3/4" />
      </div>
    </div>
  )
}

export default QuestionCardSkeleton
