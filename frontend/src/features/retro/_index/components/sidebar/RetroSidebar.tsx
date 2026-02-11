import { InterviewInfoSection, QuestionListSection } from '@/features/_common/components/sidebar'
import { NoteIcon } from '@/shared/assets'
import { SidebarLayout } from '@/shared/components'
import type { IdLabelType } from '@/types/global'
import type { InterviewInfoType } from '@/types/interview'

type RetroSidebarProps = {
  interviewInfo: InterviewInfoType
  items: IdLabelType[]
  activeIndex: number
  onItemClick: (index: number) => void
}

export function RetroSidebar({ interviewInfo, items, activeIndex, onItemClick }: RetroSidebarProps) {
  return (
    <SidebarLayout>
      <div className="inline-flex gap-2">
        <NoteIcon width="24" height="24" />
        <span className="body-l-semibold">내 면접 정보</span>
      </div>
      <InterviewInfoSection {...interviewInfo} />
      <QuestionListSection title="회고 리스트" items={items} activeIndex={activeIndex} onItemClick={onItemClick} />
    </SidebarLayout>
  )
}
