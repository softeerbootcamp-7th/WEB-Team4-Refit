import { NoteIcon } from '@/shared/assets'
import { ContainerWithHeader, ContainerWithoutHeader, ListItemLarge, SidebarLayout } from '@/shared/components'
import { INTERVIEW_TYPE_LABEL } from '@/shared/constants/interviews'
import { formatDateTime } from '@/shared/utils/date'
import type { LabelValueType } from '@/types/global'
import type { QnaSetType } from '@/types/interview'
import { MOCK_INTERVIEW_DETAIL } from '../../example'

type DetailSidebarProps = {
  qnaSets: QnaSetType[]
  activeIndex: number
  onItemClick: (index: number) => void
}

export function DetailSidebar({ qnaSets, activeIndex, onItemClick }: DetailSidebarProps) {
  const interviewInfo = MOCK_INTERVIEW_DETAIL

  return (
    <SidebarLayout>
      <div className="inline-flex gap-2">
        <NoteIcon width="24" height="24" />
        <span className="body-l-semibold">내 면접 정보</span>
      </div>
      <ContainerWithoutHeader>
        <InterviewInfoRow label="기업명" value={interviewInfo.company} />
        <InterviewInfoRow label="일시" value={formatDateTime(interviewInfo.interviewStartAt)} />
        <InterviewInfoRow label="직무" value={interviewInfo.jobRole ?? '-'} />
        <InterviewInfoRow label="면접 유형" value={INTERVIEW_TYPE_LABEL[interviewInfo.interviewType]} />
      </ContainerWithoutHeader>
      <ContainerWithHeader title="회고 리스트">
        {qnaSets.map(({ qnaSetId, questionText }, index) => (
          <ListItemLarge
            key={qnaSetId}
            content={`${index + 1}. ${questionText}`}
            active={activeIndex === index}
            onClick={() => onItemClick(index)}
          />
        ))}
        <ListItemLarge
          content={`${qnaSets.length + 1}. 최종 KPT 회고`}
          active={activeIndex === qnaSets.length}
          onClick={() => onItemClick(qnaSets.length)}
        />
      </ContainerWithHeader>
    </SidebarLayout>
  )
}

const InterviewInfoRow = ({ label, value }: LabelValueType) => {
  return (
    <div className="flex gap-2">
      <label className="body-s-semibold w-18.5 text-gray-300">{label}</label>
      <span className="body-s-medium w-33.75 text-gray-800">{value}</span>
    </div>
  )
}
