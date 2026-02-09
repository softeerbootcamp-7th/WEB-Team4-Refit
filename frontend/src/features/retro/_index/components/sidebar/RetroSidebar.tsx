import { useRetroContext } from '@/features/retro/_index/contexts'
import { NoteIcon } from '@/shared/assets'
import { ContainerWithHeader, ContainerWithoutHeader, ListItemLarge, SidebarLayout } from '@/shared/components'
import { INTERVIEW_TYPE_LABEL } from '@/shared/constants/interviews'
import { formatDateTime } from '@/shared/utils/date'
import type { LabelValueType } from '@/types/global'
import { MOCK_INTERVIEW_INFO_DATA, MOCK_RETRO_LIST } from '../../example'

export function RetroSidebar() {
  const { currentIndex, updateCurrentIndex } = useRetroContext()
  const { company, jobRole, interviewStartAt, interviewType } = MOCK_INTERVIEW_INFO_DATA

  return (
    <SidebarLayout>
      <div className="inline-flex gap-2">
        <NoteIcon width="24" height="24" />
        <span className="body-l-semibold">내 면접 정보</span>
      </div>
      <ContainerWithoutHeader>
        <InterviewInfoRow label="기업명" value={company} />
        <InterviewInfoRow label="일시" value={formatDateTime(interviewStartAt)} />
        <InterviewInfoRow label="직무" value={jobRole ?? '-'} />
        <InterviewInfoRow label="면접 유형" value={INTERVIEW_TYPE_LABEL[interviewType]} />
      </ContainerWithoutHeader>
      <ContainerWithHeader title="회고 리스트">
        {MOCK_RETRO_LIST.map(({ qnaSetId, questionText }, index) => (
          <ListItemLarge
            key={qnaSetId}
            content={`${index + 1}. ${questionText}`}
            active={currentIndex === index}
            onClick={() => updateCurrentIndex(index)}
          />
        ))}
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
