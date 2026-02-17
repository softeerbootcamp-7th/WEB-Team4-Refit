import { useEffect, useRef, useState } from 'react'
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
  const leftColumnRef = useRef<HTMLDivElement | null>(null)
  const [leftColumnHeight, setLeftColumnHeight] = useState<number | null>(null)

  useEffect(() => {
    const target = leftColumnRef.current
    if (!target) return

    const updateHeight = () => {
      setLeftColumnHeight(target.getBoundingClientRect().height)
    }

    updateHeight()
    const resizeObserver = new ResizeObserver(updateHeight)
    resizeObserver.observe(target)

    return () => resizeObserver.disconnect()
  }, [])

  return (
    <ScheduleModalProvider>
      <div className="flex w-full min-w-0 flex-col justify-center gap-10">
        <div className="flex w-full items-stretch gap-6">
          <div ref={leftColumnRef} className="flex w-225 min-h-0 flex-1 flex-col gap-10">
            <DashboardBanner variant={variant} titleText={titleText} isLoading={isLoading} />
            <ReviewWaitingSection />
            <UpcomingInterviewSection />
          </div>
          <div
            className="bg-gray-150 w-80 shrink-0 overflow-hidden rounded-[20px] px-5 py-7"
            style={leftColumnHeight ? { height: `${leftColumnHeight}px` } : undefined}
          >
            <InterviewCalendar />
          </div>
        </div>
        <PersonalizedQuestionsSection />
      </div>
      <InterviewScheduleModal />
    </ScheduleModalProvider>
  )
}
