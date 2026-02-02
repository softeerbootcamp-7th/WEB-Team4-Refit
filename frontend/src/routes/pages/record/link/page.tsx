import { RecordSection } from '@/features/confirm-record/components/contents/RecordSection'
import { RecordLinkSidebar } from '@/features/link-record/components/sidebar/Sidebar'

export default function RecordLinkPage() {
  return (
    <div className="grid h-full grid-cols-[80px_1fr]">
      <RecordLinkSidebar />
      <RecordSection />
    </div>
  )
}
