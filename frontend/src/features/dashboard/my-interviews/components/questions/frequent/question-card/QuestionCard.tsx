import { memo } from 'react'
import { INTERVIEW_TYPE_LABEL } from '@/constants/interviews'
import { SmallLogoIcon } from '@/designs/assets'
import { formatDate } from '@/features/_common/utils/date'
import type { QuestionCardModel } from '../../mappers'

function QuestionCard({ card }: { card: QuestionCardModel }) {
  return (
    <div className="flex cursor-pointer flex-col gap-2 rounded-xl border border-gray-100 p-4 transition-colors hover:bg-gray-100">
      <div className="flex flex-wrap items-center gap-2">
        {card.companyLogoUrl ? (
          <img src={card.companyLogoUrl} alt={card.companyName} className="h-7.5 w-7.5 rounded-full object-cover" />
        ) : (
          <div className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-full border border-gray-150 bg-white">
            <SmallLogoIcon className="h-4 w-4 text-gray-400" />
          </div>
        )}
        <span className="body-l-semibold">{card.companyName}</span>
        <span className="caption-l-medium text-gray-200">{formatDate(card.date)} 응시</span>
      </div>
      <div className="body-m-medium text-gray-400">
        {card.jobRole} <span className="text-gray-150 mx-1">|</span> {INTERVIEW_TYPE_LABEL[card.interviewType]}
      </div>
      <p className="body-l-medium mt-1 line-clamp-2">{card.question}</p>
    </div>
  )
}

export default memo(QuestionCard)
