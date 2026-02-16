import { INTERVIEW_TYPE_LABEL } from '@/constants/interviews'
import { Badge, Border } from '@/designs/components'
import {
  RESULT_LABEL,
  RESULT_THEME,
  type InterviewResultStatus,
} from '@/features/dashboard/my-interviews/constants/constants'
import type { InterviewType } from '@/types/interview'

type InterviewCardProps = {
  resultStatus: InterviewResultStatus
  date: string
  company: string
  jobRole: string
  interviewType: InterviewType
  infoDirection?: 'row' | 'column'
  children?: React.ReactNode
}

export default function InterviewCard({
  resultStatus,
  date,
  company,
  jobRole,
  interviewType,
  infoDirection = 'column',
  children,
}: InterviewCardProps) {
  return (
    <div className="bg-gray-white flex cursor-pointer flex-col gap-2.5 rounded-2xl p-5 transition-colors hover:bg-gray-100">
      <div className="flex items-center gap-2">
        <Badge content={RESULT_LABEL[resultStatus]} type="question-label" theme={RESULT_THEME[resultStatus]} />
        <span className="body-m-medium text-gray-500">{date}</span>
      </div>
      <Border />
      <div className={infoDirection === 'row' ? 'flex items-center gap-5' : 'flex flex-col gap-2.5'}>
        <div className="title-m-semibold flex items-center gap-3">
          <img src="" alt={company} className="h-8.5 w-8.5 rounded-full bg-gray-300" />
          <span>{company}</span>
        </div>
        <div className="body-m-medium text-gray-700">
          {jobRole} <span className="mx-1 text-gray-200">|</span> {INTERVIEW_TYPE_LABEL[interviewType]}
        </div>
      </div>
      {children}
    </div>
  )
}
