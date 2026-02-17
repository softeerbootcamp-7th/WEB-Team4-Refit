import QnaCard from '@/features/dashboard/my-interviews/components/questions/list/qna-card/QnaCard'
import type { QuestionFilter } from '@/types/interview'
import { useInfiniteQuestionList } from './useInfiniteQuestionList'

type QuestionListSectionProps = {
  filter: QuestionFilter
}

export default function QuestionListSection({ filter }: QuestionListSectionProps) {
  const { items, loadMoreRef, isInitialLoading, isFetchingNext, isPending, emptyMessage } =
    useInfiniteQuestionList(filter)
  const hasItems = items.length > 0
  const isLoadingMore = hasItems && (isFetchingNext || isPending)

  const renderListContent = () => {
    if (isInitialLoading) {
      return <StatusText message="로딩중..." />
    }
    if (!hasItems) {
      return <StatusText message={emptyMessage} />
    }
    return items.map((item, i) => <QnaCard key={i} {...item} />)
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-4">{renderListContent()}</div>
      {hasItems && (
        <div ref={loadMoreRef} className="body-s-regular py-2 text-center text-gray-400">
          {isLoadingMore ? '불러오는 중...' : ''}
        </div>
      )}
    </section>
  )
}

function StatusText({ message }: { message: string }) {
  return <div className="col-span-2 py-8 text-center text-gray-400">{message}</div>
}
