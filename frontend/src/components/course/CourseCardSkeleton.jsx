// Loading skeleton for CourseCard. Used by Courses page.
import Skeleton from '../ui/Skeleton'

function CourseCardSkeleton() {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <div className="mt-auto pt-4 flex justify-end">
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  )
}

export default CourseCardSkeleton
