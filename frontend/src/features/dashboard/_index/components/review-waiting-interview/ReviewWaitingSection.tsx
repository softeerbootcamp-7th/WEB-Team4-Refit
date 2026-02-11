import { usePagination } from '@/features/_common/hooks/usePagination'
import { useReviewWaitingInterviews } from '../../hooks/useReviewWaitingInterviews'
import SectionHeader from '../SectionHeader'
import ReviewWaitingCard from './ReviewWaitingCard'

const ITEMS_PER_PAGE = 2

export default function ReviewWaitingSection() {
  const { data, count } = useReviewWaitingInterviews()
  const { pageData, handlePrev, handleNext, hasPrev, hasNext } = usePagination(data, ITEMS_PER_PAGE)

  return (
    <section className="flex flex-col gap-0">
      <SectionHeader
        title="복기 대기 중인 면접"
        description={`${count}건`}
        onPrev={hasPrev ? handlePrev : undefined}
        onNext={hasNext ? handleNext : undefined}
      />
      <div className="grid grid-cols-2 gap-4">
        {pageData.map((item) => (
          <ReviewWaitingCard key={item.id} data={item} />
        ))}
      </div>
    </section>
  )
}
