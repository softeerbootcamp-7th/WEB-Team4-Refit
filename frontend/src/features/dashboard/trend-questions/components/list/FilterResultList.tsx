import { useState } from 'react'
import { Button } from '@/designs/components'
import FilterBadges from '@/features/dashboard/trend-questions/components/filter/filter-badges/FilterBadges'
import type { IndustryJobFilterState } from '@/features/dashboard/trend-questions/hooks/useIndustryJobFilter'
import TrendQuestionCard from './question-card/TrendQuestionCard'
import TermsModal from './terms-modal/TermsModal'
import { useTrendFrequentQuestions } from './useTrendFrequentQuestions'

type FilterResultListProps = {
  filter: IndustryJobFilterState
  isBlurred?: boolean
}

export default function FilterResultList({ filter, isBlurred = false }: FilterResultListProps) {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false)
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
          <>
            <div className="pointer-events-none blur-sm">
              <DummyCardList />
            </div>
            <BlurOverlay onAgreeClick={() => setIsTermsModalOpen(true)} />
          </>
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
      <TermsModal open={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} />
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
        <article key={i} className="bg-gray-white flex min-h-44 flex-col gap-2.5 rounded-2xl p-5">
          <div className="flex items-center gap-2">
            <span className="body-m-medium text-gray-300">{DUMMY_PLACEHOLDER}</span>
          </div>
          <div className="h-px bg-gray-100" />
          <div className="body-m-medium text-gray-300">{DUMMY_PLACEHOLDER}</div>
          <div className="flex h-full rounded-[10px] bg-gray-100 p-3">
            <div className="flex gap-2">
              <span className="body-l-medium text-gray-300">Q.</span>
              <p className="body-l-regular text-gray-300">{DUMMY_PLACEHOLDER}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

function BlurOverlay({ onAgreeClick }: { onAgreeClick: () => void }) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/40 px-4 text-center">
      <div className="flex flex-col items-center gap-4">
        <p className="body-l-semibold text-gray-500">나의 질문 공개에 동의하고 관심 직무의 빈출 질문을 알아보세요!</p>
        <Button size="sm" variant="fill-gray-800" onClick={onAgreeClick}>
          동의하고 질문 확인하기
        </Button>
      </div>
    </div>
  )
}
