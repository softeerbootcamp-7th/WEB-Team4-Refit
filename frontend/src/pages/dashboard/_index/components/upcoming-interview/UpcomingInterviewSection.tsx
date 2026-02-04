import { useUpcomingInterviews } from '../../hooks/useUpcomingInterviews'
import SectionHeader from '../SectionHeader'
import UpcomingInterviewCard from './UpcomingInterviewCard'

export default function UpcomingInterviewSection() {
  const { data, count } = useUpcomingInterviews()

  return (
    <section className="flex flex-col gap-0">
      <SectionHeader title="다가오는 면접" description={`${count}건`} />
      <div className="flex gap-4 pb-4">
        <UpcomingInterviewCard data={data[0]} />
      </div>
    </section>
  )
}
