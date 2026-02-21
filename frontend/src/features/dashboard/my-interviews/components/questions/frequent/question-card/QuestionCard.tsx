import { memo } from 'react'
import { INTERVIEW_TYPE_LABEL } from '@/constants/interviews'
import { formatDate } from '@/features/_common/utils/date'
import type { QuestionCardModel } from '../../mappers'

function QuestionCard({ card }: { card: QuestionCardModel }) {
  return (
    <div className="flex cursor-pointer flex-col gap-2 rounded-xl border border-gray-100 p-4 transition-colors hover:bg-gray-100">
      <div className="flex flex-wrap items-center gap-2">
        {card.companyLogoUrl ? (
          <img src={card.companyLogoUrl} alt={card.company} className="h-7.5 w-7.5 rounded-full object-cover" />
        ) : (
          <div className="h-7.5 w-7.5 rounded-full bg-gray-300" />
        )}
        <span className="body-l-semibold">{card.company}</span>
        <span className="caption-l-medium text-gray-200">{formatDate(card.date)} 응시</span>
      </div>
      <div className="body-m-medium text-gray-400">
        {card.jobRole} <span className="text-gray-150 mx-1">|</span> {INTERVIEW_TYPE_LABEL[card.interviewType]}
      </div>
      <p className="body-l-medium mt-1 line-clamp-2 break-all">{card.question}</p>
    </div>
  )
}

export default memo(QuestionCard)
