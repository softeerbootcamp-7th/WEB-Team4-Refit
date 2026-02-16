import { NoteIcon } from '@/designs/assets'
import { SidebarLayout } from '@/designs/components'
import { InterviewInfoSection } from '@/features/_common/components/sidebar'
import type { InterviewInfoType } from '@/types/interview'

type RecordSidebarProps = {
  infoItems: InterviewInfoType
}

export function RecordSidebar({ infoItems }: RecordSidebarProps) {
  return (
    <SidebarLayout>
      <div className="inline-flex gap-2">
        <NoteIcon width="24" height="24" />
        <span className="body-l-semibold">내 면접 정보</span>
      </div>
      <InterviewInfoSection {...infoItems} />
      <div className="rounded-xl bg-gray-100 px-4 py-3">
        <p className="body-s-regular text-gray-600">
          화면에서 내가 말하는 내용을 바로 확인할 수 있어요!
        </p>
      </div>
    </SidebarLayout>
  )
}
