import { RecordSection } from '@/features/confirm-record/components/contents/RecordSection'
import { RecordConfirmSidebar } from '@/features/confirm-record/components/sidebar/Sidebar'

export default function RecordConfirmPage() {
  return (
    <div className="grid h-full grid-cols-[320px_1fr]">
      <RecordConfirmSidebar />
      <RecordSection />
    </div>
  )
}
