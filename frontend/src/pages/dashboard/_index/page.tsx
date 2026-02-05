import DashboardBanner from '@/pages/dashboard/_index/components/dashboard-banner/DashboardBanner'
import InterviewCalendar from '@/pages/dashboard/_index/components/interview-calendar/InterviewCalendar'
import InterviewScheduleModal from '@/pages/dashboard/_index/components/interview-calendar/InterviewScheduleModal'
import PersonalizedQuestionsSection from '@/pages/dashboard/_index/components/personalized-questions/PersonalizedQuestionsSection'
import ReviewWaitingSection from '@/pages/dashboard/_index/components/review-waiting-interview/ReviewWaitingSection'
import UpcomingInterviewSection from '@/pages/dashboard/_index/components/upcoming-interview/UpcomingInterviewSection'
import { ScheduleModalProvider } from '@/pages/dashboard/_index/contexts/ScheduleModalContext'

export default function DashboardPage() {
  return (
    <ScheduleModalProvider>
      <div className="flex w-full min-w-0 flex-col justify-center gap-10">
        <div className="flex w-full gap-10">
          <div className="flex w-225 flex-1 flex-col gap-10">
            <DashboardBanner variant="no_schedule" />
            <UpcomingInterviewSection />
            <ReviewWaitingSection />
          </div>
          <div className="bg-gray-150 w-80 shrink-0 rounded-[20px] px-5 py-7">
            <InterviewCalendar />
          </div>
        </div>
        <PersonalizedQuestionsSection />
      </div>
      <InterviewScheduleModal />
    </ScheduleModalProvider>
  )
}
