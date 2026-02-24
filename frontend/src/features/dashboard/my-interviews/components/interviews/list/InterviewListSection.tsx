import { useNavigate } from 'react-router'
import { getInterviewNavigationPath } from '@/constants/interviewReviewStatusRoutes'
import type { InterviewFilter } from '@/types/interview'
import InterviewCard from './interview-card/InterviewCard'
import { useInfiniteInterviewList } from './useInfiniteInterviewList'

type InterviewListSectionProps = {
  filter: InterviewFilter
}

export default function InterviewListSection({ filter }: InterviewListSectionProps) {
  const navigate = useNavigate()
  const { items, loadMoreRef, isInitialLoading, isFetchingNext, isPending, emptyMessage } =
    useInfiniteInterviewList(filter)
  const hasItems = items.length > 0
  const isLoadingMore = hasItems && (isFetchingNext || isPending)

  const renderListContent = () => {
    if (isInitialLoading) {
      return <StatusText message="로딩중..." />
    }
    if (!hasItems) {
      return <StatusText message={emptyMessage} />
    }
    return items.map((item) => (
      <InterviewCard
        key={item.interviewId}
        {...item}
        onClick={() => navigate(getInterviewNavigationPath(item.interviewId, item.interviewReviewStatus))}
      />
    ))
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-4">{renderListContent()}</div>
      {hasItems && (
        <div ref={loadMoreRef} className="body-s-regular py-2 text-center text-gray-400">
          {isLoadingMore ? '불러오는 중...' : ''}
        </div>
      )}
    </section>
  )
}

function StatusText({ message }: { message: string }) {
  return <div className="col-span-3 py-8 text-center text-gray-500">{message}</div>
}
