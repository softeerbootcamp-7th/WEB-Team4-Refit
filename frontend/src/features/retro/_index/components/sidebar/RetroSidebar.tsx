import { NoteIcon } from '@/designs/assets'
import { SidebarLayout } from '@/designs/components'
import { InterviewInfoSection, QuestionListSection } from '@/features/_common/components/sidebar'
import type { IdLabelType } from '@/types/global'
import type { InterviewInfoType } from '@/types/interview'

type RetroSidebarProps = {
  interviewInfo: InterviewInfoType
  items: IdLabelType[]
  activeIndex: number
  onItemClick: (index: number) => void
}

export function RetroSidebar({ interviewInfo, items, activeIndex, onItemClick }: RetroSidebarProps) {
  // TODO: 사이드바 클릭하면 이전 값과 비교하여 변화 있을 때 updateQnaSet (회고 입력 결과 저장 API 호출)
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
