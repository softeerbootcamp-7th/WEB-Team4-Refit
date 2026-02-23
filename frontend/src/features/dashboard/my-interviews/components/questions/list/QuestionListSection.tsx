import { useState } from 'react'
import { useNavigate } from 'react-router'
import { getInterviewNavigationPath } from '@/constants/interviewReviewStatusRoutes'
import RetroDetailModal from '@/features/_common/components/retro-detail-modal/RetroDetailModal'
import QnaCard from '@/features/dashboard/my-interviews/components/questions/list/qna-card/QnaCard'
import type { QuestionFilter } from '@/types/interview'
import { useInfiniteQuestionList } from './useInfiniteQuestionList'
import type { QnaCardItemModel } from '../mappers'

type QuestionListSectionProps = {
  filter: QuestionFilter
}

export default function QuestionListSection({ filter }: QuestionListSectionProps) {
  const navigate = useNavigate()
  const { items, loadMoreRef, isInitialLoading, isFetchingNext, isPending, emptyMessage } =
    useInfiniteQuestionList(filter)
  const [selectedCard, setSelectedCard] = useState<QnaCardItemModel | null>(null)

  const hasItems = items.length > 0
  const isLoadingMore = hasItems && (isFetchingNext || isPending)

  const renderListContent = () => {
    if (isInitialLoading) {
      return <StatusText message="로딩중..." />
    }
    if (!hasItems) {
      return <StatusText message={emptyMessage} />
    }
    return items.map((item) => <QnaCard key={item.qnaSetId} {...item} onClick={() => setSelectedCard(item)} />)
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-4">{renderListContent()}</div>
      {hasItems && (
        <div ref={loadMoreRef} className="body-s-regular py-2 text-center text-gray-400">
          {isLoadingMore ? '불러오는 중...' : ''}
        </div>
      )}
      {selectedCard && (
        <RetroDetailModal
          open={true}
          onClose={() => setSelectedCard(null)}
          interviewId={selectedCard.interviewId}
          qnaSetId={selectedCard.qnaSetId}
          onMoveToDetails={() =>
            navigate(getInterviewNavigationPath(selectedCard.interviewId, selectedCard.interviewReviewStatus))
          }
        />
      )}
    </section>
  )
}

function StatusText({ message }: { message: string }) {
  return <div className="col-span-2 py-8 text-center text-gray-400">{message}</div>
}
