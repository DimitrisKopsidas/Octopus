// Loading skeleton for CourseCard. Used by Courses page.
import Skeleton from '../ui/Skeleton'

function CourseCardSkeleton() {
  return (
    <div className="flex flex-col h-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-xl" />
      </div>
      <div className="space-y-2 flex-1">
        <Skeleton className="h-6 w-3/4 rounded-lg" />
        <Skeleton className="h-4 w-full rounded-md" />
      </div>
      <div className="space-y-2 pt-1">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-8" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-4 w-16 rounded-md" />
      </div>
    </div>
  )
}

export default CourseCardSkeleton
