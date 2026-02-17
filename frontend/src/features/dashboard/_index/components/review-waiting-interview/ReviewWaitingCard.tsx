import { useNavigate } from 'react-router'
import type { InterviewDto } from '@/apis'
import type { InterviewReviewStatusLabel } from '@/constants/interviewReviewStatus'
import { getInterviewNavigationPath } from '@/constants/interviewReviewStatusRoutes'
import { SmallLogoIcon } from '@/designs/assets'
import { Badge } from '@/designs/components'
import Button from '@/designs/components/button'

export interface ReviewWaitingData {
  id: number
  reviewStatus: InterviewDto['interviewReviewStatus']
  status: InterviewReviewStatusLabel
  elapsedText: string
  companyName: string
  industry: string
  jobCategory: string
  interviewType: string
}

interface ReviewWaitingCardProps {
  data: ReviewWaitingData
}

export default function ReviewWaitingCard({ data }: ReviewWaitingCardProps) {
  const navigate = useNavigate()

  const handleNavigate = () => {
    navigate(getInterviewNavigationPath(data.id, data.reviewStatus))
  }

  return (
    <div className="flex w-full flex-col rounded-2xl bg-white p-6">
      <div className="mb-4 flex items-center gap-2">
        <Badge content={data.status} type="question-label" />
        <span className="body-m-medium text-gray-500">{data.elapsedText}</span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="border-gray-150 flex h-8 w-8 items-center justify-center rounded-full border bg-white text-gray-400">
            <SmallLogoIcon className="h-4 w-4 text-gray-400" />
          </div>
          <h3 className="title-s-semibold text-gray-800">{data.companyName}</h3>
          <span className="body-m-medium text-gray-400">{data.industry}</span>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-1.5">
          <span className="body-m-medium text-gray-700">{data.jobCategory}</span>
          <span className="h-3 w-px shrink-0 bg-gray-300" aria-hidden />
          <span className="body-m-medium text-gray-700">{data.interviewType}</span>
        </div>
      </div>

      <Button
        variant="fill-orange-100"
        size="sm"
        className="w-full font-semibold"
        onClick={handleNavigate}
      >
        해당 면접으로 이동하기
      </Button>
    </div>
  )
}
