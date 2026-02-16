import UnrecordedInterviewCard from '@/features/mobile/unrecorded/components/UnrecordedInterviewCard'
import type { DebriefIncompletedCardItem } from '@/features/mobile/unrecorded/hooks'

interface UnrecordedInterviewListProps {
  items: DebriefIncompletedCardItem[]
  isLoading: boolean
  isError: boolean
  onItemClick: (interviewId: string) => void
}

export default function UnrecordedInterviewList({
  items,
  isLoading,
  isError,
  onItemClick,
}: UnrecordedInterviewListProps) {
  if (isLoading) {
    return <div className="body-m-regular px-5 py-8 text-center text-gray-500">로딩 중...</div>
  }

  if (isError) {
    return <div className="body-m-regular px-5 py-8 text-center text-gray-500">데이터를 불러오지 못했습니다.</div>
  }

  if (items.length === 0) {
    return <div className="body-m-regular px-5 py-8 text-center text-gray-500">복기할 면접이 없습니다.</div>
  }

  return (
    <ul className="mt-2 flex flex-col [&_li:last-child_button]:border-b-0">
      {items.map((item) => (
        <li key={item.id}>
          <UnrecordedInterviewCard
            company={item.company}
            title={item.title}
            timeAgo={item.timeAgo}
            logoUrl={item.logoUrl}
            onClick={() => onItemClick(item.id)}
          />
        </li>
      ))}
    </ul>
  )
}
