import CustomQuestionsSection from '@/pages/dashboard/_index/components/custom-questions/CustomQuestionsSection'
import DashboardBanner from '@/pages/dashboard/_index/components/dashboard-banner/DashboardBanner'
import InterviewCalendar from '@/pages/dashboard/_index/components/interview-calendar/InterviewCalendar'
import InterviewScheduleModal from '@/pages/dashboard/_index/components/interview-calendar/InterviewScheduleModal'
import ReviewWaitingSection from '@/pages/dashboard/_index/components/review-waiting-interview/ReviewWaitingSection'
import UpcomingInterviewSection from '@/pages/dashboard/_index/components/upcoming-interview/UpcomingInterviewSection'
import { ScheduleModalProvider } from '@/pages/dashboard/_index/contexts/ScheduleModalContext'

export default function DashboardPage() {
  return (
    <ScheduleModalProvider>
      <div className="flex w-full min-w-0 justify-center gap-6">
        {/* 메인 영역 */}
        <div className="flex flex-col">
          <div className="mb-10">
            <DashboardBanner variant="no_schedule" />
          </div>
          <div className="flex flex-1 flex-col gap-20">
            <UpcomingInterviewSection />
            <ReviewWaitingSection />
            <CustomQuestionsSection />
          </div>
        </div>
        {/* 면접 캘린더 영역 */}
        <div className="bg-gray-150 sticky w-80 shrink-0 self-start rounded-[20px] px-5 py-7">
          <InterviewCalendar />
        </div>
      </div>
      <InterviewScheduleModal />
    </ScheduleModalProvider>
  )
}
