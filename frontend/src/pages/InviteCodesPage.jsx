import PanelNavigation from '../components/layout/PanelNavigation'
import InviteCodesViewer from '../components/admin/InviteCodesViewer'

export default function InviteCodesPage() {
  return (
    <div>
      {/* Top Navigation Tabs */}
      <PanelNavigation activeTab="/admin-panel/invite-codes" />

      <InviteCodesViewer />
    </div>
  )
}
