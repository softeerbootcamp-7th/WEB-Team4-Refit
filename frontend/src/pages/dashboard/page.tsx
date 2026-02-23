import { useGetMyProfileInfo } from '@/apis'
import DashboardBanner from '@/features/dashboard/_index/components/dashboard-banner/DashboardBanner'
import InterviewCalendar from '@/features/dashboard/_index/components/interview-calendar/InterviewCalendar'
import InterviewScheduleModal from '@/features/dashboard/_index/components/interview-calendar/InterviewScheduleModal'
import PersonalizedQuestionsSection from '@/features/dashboard/_index/components/personalized-questions/PersonalizedQuestionsSection'
import ReviewWaitingSection from '@/features/dashboard/_index/components/review-waiting-interview/ReviewWaitingSection'
import UpcomingInterviewSection from '@/features/dashboard/_index/components/upcoming-interview/UpcomingInterviewSection'
import { ScheduleModalProvider } from '@/features/dashboard/_index/contexts/ScheduleModalProvider'
import { useDashboardHeadline } from '@/features/dashboard/_index/hooks/useDashboardHeadline'

export default function DashboardPage() {
  const { variant, titleText, isLoading } = useDashboardHeadline()
  const { data: isAgreedToTerms = false } = useGetMyProfileInfo({
    query: {
      select: (response) => response.result?.isAgreedToTerms ?? false,
    },
  })
  const isTermsLocked = !isAgreedToTerms

  return (
    <ScheduleModalProvider>
      <div className="flex w-full min-w-0 flex-col justify-center gap-10">
        <div className="flex w-full items-stretch gap-6">
          <div className="flex min-h-0 w-225 flex-1 flex-col gap-10">
            <DashboardBanner variant={variant} titleText={titleText} isLoading={isLoading} />
            <ReviewWaitingSection />
            <UpcomingInterviewSection isTermsLocked={isTermsLocked} />
          </div>
          <div className="bg-gray-150 w-80 shrink-0 overflow-hidden rounded-[20px] px-5 py-7">
            <InterviewCalendar />
          </div>
        </div>
        <PersonalizedQuestionsSection isTermsLocked={isTermsLocked} />
      </div>
      <InterviewScheduleModal />
    </ScheduleModalProvider>
  )
}
