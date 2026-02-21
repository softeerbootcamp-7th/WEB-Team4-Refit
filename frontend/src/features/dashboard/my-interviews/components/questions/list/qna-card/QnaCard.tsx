import InterviewCard from '@/features/dashboard/my-interviews/components/interviews/list/interview-card/InterviewCard'
import type { InterviewResultStatus } from '@/features/dashboard/my-interviews/constants/constants'
import type { InterviewType } from '@/types/interview'

type QnaCardProps = {
  resultStatus: InterviewResultStatus
  date: string
  companyName: string
  companyLogoUrl?: string
  jobRole: string
  interviewType: InterviewType
  question: string
  answer: string
  onClick?: () => void
}

export default function QnaCard({ question, answer, onClick, ...cardProps }: QnaCardProps) {
  return (
    <InterviewCard {...cardProps} infoDirection="row" onClick={onClick}>
      <div className="flex h-full flex-col gap-3 rounded-[10px] bg-gray-100 p-3">
        <div className="flex gap-2">
          <span className="body-l-medium text-gray-300">Q.</span>
          <p className="body-l-regular line-clamp-2 flex-1">{question}</p>
        </div>
        <div className="flex gap-2">
          <span className="body-l-medium text-gray-300">A.</span>
          <p className="body-l-regular line-clamp-2 flex-1">{answer}</p>
        </div>
      </div>
    </InterviewCard>
  )
}
