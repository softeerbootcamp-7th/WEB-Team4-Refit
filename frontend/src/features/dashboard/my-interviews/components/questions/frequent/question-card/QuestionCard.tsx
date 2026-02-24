import { memo } from 'react'
import { INTERVIEW_TYPE_LABEL } from '@/constants/interviews'
import { useInterviewNavigate } from '@/features/_common/_index/hooks/useInterviewNavigation'
import { formatDate } from '@/features/_common/_index/utils/date'
import { ROUTES } from '@/routes/routes'
import { SmallLogoIcon } from '@/ui/assets'
import type { QuestionCardModel } from '../../mappers'

function QuestionCard({ card }: { card: QuestionCardModel }) {
  const navigateWithId = useInterviewNavigate()
  const goToRetroDetailsPage = () => navigateWithId(ROUTES.RETRO_DETAILS, { replace: true })

  return (
    <button
      onClick={goToRetroDetailsPage}
      className="flex cursor-pointer flex-col gap-2 rounded-xl border border-gray-100 p-4 text-left transition-colors hover:bg-gray-100"
    >
      <div className="flex flex-wrap items-center gap-2">
        <div className="border-gray-150 flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-full border bg-white">
          {card.companyLogoUrl ? (
            <img
              src={card.companyLogoUrl}
              alt={card.companyName}
              className="h-full w-full rounded-full object-contain"
            />
          ) : (
            <SmallLogoIcon className="h-4 w-4 text-gray-400" />
          )}
        </div>
        <span className="body-l-semibold">{card.companyName}</span>
        <span className="caption-l-medium text-gray-200">{formatDate(card.date)} 응시</span>
      </div>
      <div className="body-m-medium text-gray-400">
        {card.jobRole} <span className="text-gray-150 mx-1">|</span> {INTERVIEW_TYPE_LABEL[card.interviewType]}
      </div>
      <p className="body-l-medium mt-1 line-clamp-2 break-all">{card.question}</p>
    </button>
  )
}

export default memo(QuestionCard)
