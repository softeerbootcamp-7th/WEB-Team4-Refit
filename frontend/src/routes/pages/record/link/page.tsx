import { RecordContents } from '@/features/confirm-record/components/contents/RecordContents'
import { RecordLinkSidebar } from '@/features/link-record/components/sidebar/Sidebar'

export default function RecordLinkPage() {
  return (
    <div className="grid h-full grid-cols-[80px_1fr]">
      <RecordLinkSidebar />
      <div className="overflow-y-auto">
        <RecordContents />
      </div>
    </div>
  )
}
