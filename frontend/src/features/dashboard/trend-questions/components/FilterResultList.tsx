import QnaCard from '@/features/dashboard/my-interviews/components/questions/QnaCard'
import { MOCK_QNA } from '@/features/dashboard/my-interviews/example'
import FilterBadges from '@/features/dashboard/trend-questions/components/FilterBadges'
import type { IndustryJobFilterState } from '@/features/dashboard/trend-questions/hooks/useIndustryJobFilter'

type FilterResultListProps = {
  filter: IndustryJobFilterState
}

export default function FilterResultList({ filter }: FilterResultListProps) {
  const { badges, removeBadge, clearAll } = filter
  const totalCount = MOCK_QNA.length

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        <h2 className="title-s-bold">조건에 맞는 질문 {totalCount}개</h2>
        <FilterBadges badges={badges} onRemove={removeBadge} onClearAll={clearAll} />
      </div>
      {totalCount === 0 ? (
        <div className="bg-gray-white body-l-medium rounded-xl px-6 py-12 text-center text-gray-400">
          검색 결과가 없어요
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {MOCK_QNA.map((item, i) => (
            <QnaCard key={i} {...item} />
          ))}
        </div>
      )}
    </section>
  )
}
