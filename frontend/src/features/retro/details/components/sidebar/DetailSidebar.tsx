import { InterviewInfoSection, QuestionListSection } from '@/features/_common/_index/components/sidebar'
import type { IdLabelType } from '@/types/global'
import type { InterviewInfoType, QnaSetType } from '@/types/interview'
import { NoteIcon } from '@/ui/assets'
import { SidebarLayout } from '@/ui/components'
import { InterviewDeleteSection } from './delete-section/InterviewDeleteSection'
import { InterviewResultStatusSection } from './result-status-section/InterviewResultStatusSection'

type DetailSidebarProps = {
  interviewId: number
  interviewInfo: InterviewInfoType
  interviewResultStatus: string
  qnaSets: QnaSetType[]
  activeIndex: number
  onItemClick: (index: number) => void
}

export function DetailSidebar({
  interviewId,
  interviewInfo,
  interviewResultStatus,
  qnaSets,
  activeIndex,
  onItemClick,
}: DetailSidebarProps) {
  const questionItems: IdLabelType[] = [
    ...qnaSets.map(({ qnaSetId, questionText }, index) => ({
      id: qnaSetId,
      label: `${index + 1}. ${questionText}`,
    })),
    { id: -1, label: `${qnaSets.length + 1}. 최종 KPT 회고` },
  ]

  return (
    <SidebarLayout>
      <div className="flex items-center justify-between">
        <div className="inline-flex gap-2">
          <NoteIcon width="24" height="24" />
          <span className="body-l-semibold">내 면접 정보</span>
        </div>
        <InterviewDeleteSection interviewId={interviewId} />
      </div>
      <InterviewResultStatusSection interviewId={interviewId} initialStatus={interviewResultStatus} />
      <InterviewInfoSection {...interviewInfo} />
      <QuestionListSection
        title="회고 리스트"
        items={questionItems}
        activeIndex={activeIndex}
        onItemClick={onItemClick}
        className="overflow-y-auto"
      />
    </SidebarLayout>
  )
}
