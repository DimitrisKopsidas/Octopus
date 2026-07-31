import PanelNavigation from '../components/layout/PanelNavigation'
import AuditLogsViewer from '../components/admin/AuditLogsViewer'

export default function AuditLogsPage() {
  return (
    <div>
      {/* Top Navigation Tabs */}
      <PanelNavigation activeTab="/admin-panel/audits" />

      <AuditLogsViewer />
    </div>
  )
}
