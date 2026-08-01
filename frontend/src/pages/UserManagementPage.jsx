import PanelNavigation from '../components/layout/PanelNavigation'
import UserManagementViewer from '../components/admin/UserManagementViewer'

export default function UserManagementPage() {
  return (
    <div>
      {/* Top Navigation Tabs */}
      <PanelNavigation activeTab="/admin-panel/users" />

      <UserManagementViewer />
    </div>
  )
}
