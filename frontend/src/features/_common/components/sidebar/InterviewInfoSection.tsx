import { INTERVIEW_TYPE_LABEL } from '@/constants/interviews'
import { ContainerWithoutHeader } from '@/designs/components'
import { formatDateTime } from '@/features/_common/utils'
import type { LabelValueType } from '@/types/global'
import type { InterviewInfoType } from '@/types/interview'

export function InterviewInfoSection({ company, interviewStartAt, jobRole, interviewType }: InterviewInfoType) {
  const infoItems = [
    { label: '기업명', value: company ?? '-' },
    { label: '일시', value: formatDateTime(interviewStartAt) ?? '-' },
    { label: '직무', value: jobRole ?? '-' },
    { label: '면접 유형', value: INTERVIEW_TYPE_LABEL[interviewType] ?? '-' },
  ]

  return (
    <ContainerWithoutHeader>{infoItems.map(({ label, value }) => InfoRow({ label, value }))}</ContainerWithoutHeader>
  )
}

const InfoRow = ({ label, value }: LabelValueType) => {
  return (
    <div key={label} className="flex gap-2">
      <span className="body-s-semibold w-18.5 text-gray-300">{label}</span>
      <span className="body-s-medium w-33.75 text-gray-800">{value}</span>
    </div>
  )
}
