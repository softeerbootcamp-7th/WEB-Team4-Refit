import TermsLockedOverlay from '@/features/dashboard/_index/components/terms-lock/TermsLockedOverlay'
import FilterBadges from '@/features/dashboard/trend-questions/components/filter/filter-badges/FilterBadges'
import type { IndustryJobFilterState } from '@/features/dashboard/trend-questions/hooks/useIndustryJobFilter'
import TrendQuestionCard from './question-card/TrendQuestionCard'
import { useTrendFrequentQuestions } from './useTrendFrequentQuestions'

type FilterResultListProps = {
  filter: IndustryJobFilterState
  isBlurred?: boolean
}

export default function FilterResultList({ filter, isBlurred = false }: FilterResultListProps) {
  const { badges, removeBadge, clearAll } = filter
  const { loadMoreRef, frequentQuestions, totalCount, isPending, isFetchingNextPage } = useTrendFrequentQuestions({
    industryIds: filter.industryIds,
    jobCategoryIds: filter.jobCategoryIds,
    isBlurred,
  })
  const isLoading = isPending
  const isEmpty = totalCount === 0
  const showInfiniteLoading = !isBlurred && isFetchingNextPage

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        <h2 className="title-s-bold">조건에 맞는 질문 {totalCount}개</h2>
        <FilterBadges badges={badges} onRemove={removeBadge} onClearAll={clearAll} />
      </div>
      <div className="relative">
        {isBlurred ? (
          <TermsLockedOverlay isLocked={isBlurred}>
            <DummyCardList />
          </TermsLockedOverlay>
        ) : (
          <ListContent
            isLoading={isLoading}
            isEmpty={isEmpty}
            showInfiniteLoading={showInfiniteLoading}
            frequentQuestions={frequentQuestions}
            loadMoreRef={loadMoreRef}
          />
        )}
      </div>
    </section>
  )
}

function StatusMessage({ text }: { text: string }) {
  return <div className="bg-gray-white body-l-medium rounded-xl px-6 py-12 text-center text-gray-400">{text}</div>
}

type ListContentProps = {
  isLoading: boolean
  isEmpty: boolean
  frequentQuestions: Parameters<typeof TrendQuestionCard>[0]['item'][]
  loadMoreRef: React.RefObject<HTMLDivElement | null>
  showInfiniteLoading: boolean
}

function ListContent({ isLoading, isEmpty, frequentQuestions, loadMoreRef, showInfiniteLoading }: ListContentProps) {
  if (isLoading) return <StatusMessage text="로딩중..." />
  if (isEmpty) return <StatusMessage text="검색 결과가 없어요" />

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {frequentQuestions.map((item, i) => (
          <TrendQuestionCard key={`${item.question ?? ''}-${i}`} item={item} />
        ))}
      </div>
      <div ref={loadMoreRef} className="h-1" aria-hidden />
      {showInfiniteLoading && <div className="body-m-medium py-4 text-center text-gray-400">더 불러오는 중...</div>}
    </>
  )
}

const DUMMY_PLACEHOLDER = '약관 동의가 필요합니다'

function DummyCardList() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: 4 }, (_, i) => (
        <TrendQuestionCard
          key={`dummy-${i}`}
          item={{
            question: DUMMY_PLACEHOLDER,
            industryName: DUMMY_PLACEHOLDER,
            jobCategoryName: DUMMY_PLACEHOLDER,
            interviewType: 'FIRST',
            interviewStartAt: DUMMY_PLACEHOLDER,
          }}
        />
      ))}
    </div>
  )
}
