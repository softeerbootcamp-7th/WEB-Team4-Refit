import { RecordContents } from '@/features/confirm-record/components/contents/RecordContents'
import { RecordConfirmSidebar } from '@/features/confirm-record/components/sidebar/Sidebar'

export default function RecordConfirmPage() {
  return (
    <div className="grid h-full grid-cols-[320px_1fr]">
      <RecordConfirmSidebar />
      <RecordContents />
    </div>
  )
}
