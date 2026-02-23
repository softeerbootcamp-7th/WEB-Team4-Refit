import type { FrequentQnaSetResponse } from '@/apis/generated/refit-api.schemas'
import { INTERVIEW_TYPE_LABEL } from '@/constants/interviews'
import { formatDate } from '@/features/_common/utils/date'
import { Badge, Border } from '@/ui/components'

type TrendQuestionCardProps = {
  item: FrequentQnaSetResponse
}

export default function TrendQuestionCard({ item }: TrendQuestionCardProps) {
  return (
    <article className="bg-gray-white flex min-h-44 flex-col gap-2.5 rounded-2xl p-5">
      <div className="flex items-center gap-2">
        <Badge type="question-label" theme="gray-outline" content={`${INTERVIEW_TYPE_LABEL[item.interviewType]}`} />
        <span className="body-m-medium text-gray-500">{formatDate(item.interviewStartAt)} 응시</span>
      </div>
      <Border />
      <div className="body-m-medium text-gray-700">
        {item.industryName} <span className="mx-1 text-gray-200">|</span> {item.jobCategoryName}
      </div>
      <div className="flex h-full rounded-[10px] bg-gray-100 p-3">
        <div className="flex gap-2">
          <span className="body-l-medium text-gray-300">Q.</span>
          <p className="body-l-regular line-clamp-5 break-all text-gray-800">{item.question}</p>
        </div>
      </div>
    </article>
  )
}
