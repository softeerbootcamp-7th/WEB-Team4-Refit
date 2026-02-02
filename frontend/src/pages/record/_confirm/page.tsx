import { RecordSection } from '@/pages/record/_confirm/components/contents/RecordSection'
import { RecordConfirmSidebar } from '@/pages/record/_confirm/components/sidebar/Sidebar'

export default function RecordConfirmPage() {
  return (
    <div className="grid h-full grid-cols-[320px_1fr]">
      <RecordConfirmSidebar />
      <RecordSection />
    </div>
  )
}
