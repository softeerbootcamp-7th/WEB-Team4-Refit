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
        {pageData.length === 0 ? (
          <ReviewWaitingEmptyCard />
        ) : (
          pageData.map((item) => <ReviewWaitingCard key={item.id} data={item} />)
        )}
      </div>
    </section>
  )
}

function ReviewWaitingEmptyCard() {
  return (
    <div className="col-span-2 flex min-h-75 w-full flex-col items-center justify-center rounded-2xl bg-white p-6 text-center">
      <p className="body-l-semibold text-gray-700">아직 복기 대기 중인 면접이 없어요</p>
      <p className="body-m-medium mt-2 text-gray-400">면접을 완료하면 여기에 표시돼요.</p>
    </div>
  )
}
