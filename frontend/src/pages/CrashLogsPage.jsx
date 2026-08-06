import PanelNavigation from '../components/layout/PanelNavigation'
import CrashLogsViewer from '../components/admin/CrashLogsViewer'

export default function CrashLogsPage() {
  return (
    <div>
      {/* Top Navigation Tabs */}
      <PanelNavigation activeTab="/admin-panel/crashes" />

      <CrashLogsViewer />
    </div>
  )
}
