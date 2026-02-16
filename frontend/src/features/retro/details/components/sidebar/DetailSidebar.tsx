import { MOCK_INTERVIEW_DETAIL } from '@/constants/example'
import { NoteIcon } from '@/designs/assets'
import { SidebarLayout } from '@/designs/components'
import { InterviewInfoSection, QuestionListSection } from '@/features/_common/components/sidebar'
import type { IdLabelType } from '@/types/global'
import type { QnaSetType } from '@/types/interview'

type DetailSidebarProps = {
  qnaSets: QnaSetType[]
  activeIndex: number
  onItemClick: (index: number) => void
}

export function DetailSidebar({ qnaSets, activeIndex, onItemClick }: DetailSidebarProps) {
  const infoItems = MOCK_INTERVIEW_DETAIL

  const questionItems: IdLabelType[] = [
    ...qnaSets.map(({ qnaSetId, questionText }, index) => ({
      id: qnaSetId,
      label: `${index + 1}. ${questionText}`,
    })),
    { id: -1, label: `${qnaSets.length + 1}. 최종 KPT 회고` },
  ]

  return (
    <SidebarLayout>
      <div className="inline-flex gap-2">
        <NoteIcon width="24" height="24" />
        <span className="body-l-semibold">내 면접 정보</span>
      </div>
      <InterviewResultStatusSection />
      <InterviewInfoSection {...infoItems} />
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

function InterviewResultStatusSection() {
  return (
    <div className="bg-gray-white rounded-lg p-4">
      <div className="flex gap-2">
        <span className="body-s-semibold w-18.5 text-gray-300">결과</span>
        <span className="body-s-medium w-33.75 text-gray-800">합격</span>
      </div>
    </div>
  )
}
