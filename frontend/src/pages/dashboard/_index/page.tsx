import DashboardBanner from '@/pages/dashboard/_index/components/dashboard-banner/DashboardBanner'
import InterviewCalendar from '@/pages/dashboard/_index/components/interview-calendar/InterviewCalendar'
import ReviewWaitingSection from '@/pages/dashboard/_index/components/review-waiting-interview/ReviewWaitingSection'
import UpcomingInterviewSection from '@/pages/dashboard/_index/components/upcoming-interview/UpcomingInterviewSection'

export default function DashboardPage() {
  return (
    <div className="mx-auto flex items-start">
      <main className="min-w-0 flex-1 px-6 py-7">
        <div className="mx-auto flex max-w-6xl flex-col gap-10">
          <DashboardBanner variant="no_schedule" />
          <UpcomingInterviewSection />
          <ReviewWaitingSection />
        </div>
      </main>
      <aside className="bg-gray-150 sticky top-0 min-h-[calc(100vh-60px)] w-[320px] shrink-0 rounded-tl-[20px] px-5 py-7">
        <InterviewCalendar />
      </aside>
    </div>
  )
}
