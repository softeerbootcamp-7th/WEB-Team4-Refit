import { usePagination } from '@/shared/hooks/usePagination'
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
      <div className="flex gap-4 pb-4">
        {pageData.map((item) => (
          <UpcomingInterviewCard key={item.id} data={item} />
        ))}
      </div>
    </section>
  )
}
