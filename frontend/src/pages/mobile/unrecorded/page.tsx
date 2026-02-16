import { useNavigate } from 'react-router'
import { UnrecordedInterviewList } from '@/features/mobile/unrecorded/components'
import { useUnrecordedInterviews } from '@/features/mobile/unrecorded/hooks'
import { ROUTES } from '@/routes/routes'

export default function MobileUnrecordedPage() {
  const navigate = useNavigate()
  const { items, isLoading, isError } = useUnrecordedInterviews()

  const handleItemClick = (interviewId: string) => {
    navigate(ROUTES.MOBILE_RECORD.replace(':interviewId', interviewId))
  }

  return (
    <div className="flex flex-col pb-8">
      <div className="px-5 pt-[18px]">
        <h1 className="title-l-bold text-gray-800">어떤 면접을 기록할까요?</h1>
      </div>
      <UnrecordedInterviewList items={items} isLoading={isLoading} isError={isError} onItemClick={handleItemClick} />
    </div>
  )
}
