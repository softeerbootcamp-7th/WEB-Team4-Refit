import { usePagination } from '@/features/_common/hooks/usePagination'
import { useUpcomingInterviews } from '../../hooks/useUpcomingInterviews'
import SectionHeader from '../SectionHeader'
import UpcomingInterviewCard from './UpcomingInterviewCard'

const ITEMS_PER_PAGE = 1

export default function UpcomingInterviewSection() {
  const { data, count } = useUpcomingInterviews()
  const { pageData, handlePrev, handleNext, hasPrev, hasNext } = usePagination(data, ITEMS_PER_PAGE)

  return (
    <section className="flex flex-col gap-0">
      <SectionHeader
        title="다가오는 면접"
        description={`${count}건`}
        onPrev={hasPrev ? handlePrev : undefined}
        onNext={hasNext ? handleNext : undefined}
      />
      <div className="flex gap-4">
        {pageData.length === 0 ? (
          <UpcomingInterviewEmptyCard />
        ) : (
          pageData.map((item) => <UpcomingInterviewCard key={item.id} data={item} />)
        )}
      </div>
    </section>
  )
}

function UpcomingInterviewEmptyCard() {
  return (
    <div className="flex min-h-[300px] w-full flex-col items-center justify-center rounded-2xl bg-white p-6 text-center">
      <p className="body-l-semibold text-gray-700">아직 다가오는 면접 일정이 없어요</p>
      <p className="body-m-medium mt-2 text-gray-400">우측 캘린더에서 면접 일정을 추가하세요.</p>
    </div>
  )
}
