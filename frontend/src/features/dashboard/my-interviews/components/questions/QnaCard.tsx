import InterviewCard from '@/features/dashboard/my-interviews/components/interviews/InterviewCard'

type QnaCardProps = {
  resultStatus: 'wait' | 'pass' | 'fail'
  date: string
  company: string
  jobRole: string
  interviewType: string
  question: string
  answer: string
}

export default function QnaCard({ question, answer, ...cardProps }: QnaCardProps) {
  return (
    <InterviewCard {...cardProps} infoDirection="row">
      <div className="flex flex-col gap-3 rounded-[10px] bg-gray-100 p-3">
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
