import { InterviewDtoInterviewReviewStatus } from '@/apis'
import { INTERVIEW_REVIEW_STATUS_LABEL } from '@/constants/interviewReviewStatus'
import { INTERVIEW_TYPE_LABEL } from '@/constants/interviews'
import { formatDate } from '@/features/_common/_index/utils/date'
import {
  RESULT_LABEL,
  RESULT_THEME,
  type InterviewResultStatus,
} from '@/features/dashboard/my-interviews/constants/constants'
import type { InterviewFilter, InterviewType } from '@/types/interview'
import { SmallLogoIcon } from '@/ui/assets'
import { Badge, Border } from '@/ui/components'

type InterviewCardProps = {
  interviewReviewStatus?: InterviewFilter['interviewReviewStatus'][number]
  resultStatus: InterviewResultStatus
  date: string
  companyName: string
  companyLogoUrl?: string
  jobRole: string
  interviewType: InterviewType
  infoDirection?: 'row' | 'column'
  children?: React.ReactNode
  onClick?: () => void
}

export default function InterviewCard({
  interviewReviewStatus = InterviewDtoInterviewReviewStatus.DEBRIEF_COMPLETED,
  resultStatus,
  date,
  companyName,
  companyLogoUrl,
  jobRole,
  interviewType,
  infoDirection = 'column',
  children,
  onClick,
}: InterviewCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-gray-white hover:bg-gray-150 flex cursor-pointer flex-col gap-2.5 rounded-2xl p-5 transition-colors"
    >
      <div className="flex items-center gap-2">
        <Badge content={INTERVIEW_REVIEW_STATUS_LABEL[interviewReviewStatus]} type="question-label" theme="gray-100" />
        <Badge content={RESULT_LABEL[resultStatus]} type="question-label" theme={RESULT_THEME[resultStatus]} />
        <span className="body-m-medium text-gray-500">{formatDate(date)} 응시</span>
      </div>
      <Border />
      <div className={infoDirection === 'row' ? 'flex items-center gap-5' : 'flex flex-col gap-2.5'}>
        <div className="title-m-semibold flex items-center gap-3">
          <div className="border-gray-150 flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-full border bg-white">
            {companyLogoUrl ? (
              <img src={companyLogoUrl} alt={companyName} className="h-full w-full rounded-full object-contain" />
            ) : (
              <SmallLogoIcon className="h-4.5 w-4.5 text-gray-400" />
            )}
          </div>
          <span>{companyName}</span>
        </div>
        <div className="body-m-medium text-gray-700">
          {jobRole} <span className="mx-1 text-gray-200">|</span> {INTERVIEW_TYPE_LABEL[interviewType]}
        </div>
      </div>
      {children}
    </div>
  )
}
