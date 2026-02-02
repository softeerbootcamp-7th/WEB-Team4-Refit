import { ContainerWithoutHeader } from '@/shared/components'

type InterviewInfoCardProps = {
  interviewInfoData?: { label: string; value: string }[]
}

const exampleData = [
  { label: '기업명', value: '현차' },
  { label: '일시', value: '2024.08.15 오전 11시' },
  { label: '직무', value: '테스트' },
  { label: '면접 유형', value: '1차 면접' },
]

export const InterviewInfoContainer = ({ interviewInfoData = exampleData }: InterviewInfoCardProps) => {
  return (
    <ContainerWithoutHeader>
      {interviewInfoData.map(({ label, value }, index) => (
        <InfoRow key={index} label={label} value={value} />
      ))}
    </ContainerWithoutHeader>
  )
}

const InfoRow = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex gap-2">
      <label className="body-s-semibold w-18.5 text-gray-300">{label}</label>
      <span className="body-s-medium w-33.75 text-gray-800">{value}</span>
    </div>
  )
}
