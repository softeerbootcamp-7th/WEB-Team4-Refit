import { NoteIcon } from '@/designs/assets'
import { SidebarLayout } from '@/designs/components'
import { InterviewInfoSection, QuestionListSection } from '@/features/_common/components/sidebar'
import type { IdLabelType } from '@/types/global'
import type { InterviewInfoType } from '@/types/interview'

type RecordConfirmSidebarProps = {
  infoItems: InterviewInfoType
  questionItems: IdLabelType[]
  activeIndex: number
  onItemClick: (index: number) => void
}

export function RecordConfirmSidebar({
  infoItems,
  questionItems,
  activeIndex,
  onItemClick,
}: RecordConfirmSidebarProps) {
  return (
    <SidebarLayout>
      <div className="inline-flex gap-2">
        <NoteIcon width="24" height="24" />
        <span className="body-l-semibold">내 면접 정보</span>
      </div>
      <InterviewInfoSection {...infoItems} />
      <QuestionListSection
        title="질문 리스트"
        items={questionItems}
        activeIndex={activeIndex}
        onItemClick={onItemClick}
      />
    </SidebarLayout>
  )
}
