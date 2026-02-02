import { RecordSection } from '@/pages/record/_confirm/components/contents/RecordSection'
import { RecordLinkSidebar } from '@/pages/record/_link/components/sidebar/Sidebar'

export default function RecordLinkPage() {
  return (
    <div className="grid h-full grid-cols-[80px_1fr]">
      <RecordLinkSidebar />
      <RecordSection />
    </div>
  )
}
