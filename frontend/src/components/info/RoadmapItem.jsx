// Roadmap list item. Used by Info page.
function RoadmapItem({ emoji, children }) {
  return (
    <li className="flex items-start gap-3">
      <span className="text-lg shrink-0">{emoji}</span>
      <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{children}</span>
    </li>
  )
}

export default RoadmapItem
