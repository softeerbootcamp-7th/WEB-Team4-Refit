import CloseSidebar from '@/features/record-check/components/sidebar/CloseSidebar'
import OpenSidebar from '@/features/record-check/components/sidebar/OpenSidebar'

export default function Page() {
  return (
    <div className="relative">
      <CloseSidebar />
      <OpenSidebar />
      <div>MyInterviews</div>
    </div>
  )
}
