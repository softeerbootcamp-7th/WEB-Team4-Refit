import type { InterviewFilter } from '@/types/interview'
import { MOCK_COMPLETED } from '../../example'
import InterviewCard from './InterviewCard'

type InterviewListSectionProps = {
  filter: InterviewFilter
}

export default function InterviewListSection({ filter }: InterviewListSectionProps) {
  const filteredInterviews = MOCK_COMPLETED.filter((item) => !filter.keyword || item.company.includes(filter.keyword))

  return (
    <section className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-4">
        {filteredInterviews.map((item, i) => (
          <InterviewCard key={i} {...item} />
        ))}
      </div>
    </section>
  )
}
