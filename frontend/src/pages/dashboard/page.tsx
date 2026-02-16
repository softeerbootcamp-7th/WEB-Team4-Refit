import { useEffect, useRef, useState } from 'react'
import DashboardBanner from '@/features/dashboard/_index/components/dashboard-banner/DashboardBanner'
import InterviewCalendar from '@/features/dashboard/_index/components/interview-calendar/InterviewCalendar'
import InterviewScheduleModal from '@/features/dashboard/_index/components/interview-calendar/InterviewScheduleModal'
import PersonalizedQuestionsSection from '@/features/dashboard/_index/components/personalized-questions/PersonalizedQuestionsSection'
import ReviewWaitingSection from '@/features/dashboard/_index/components/review-waiting-interview/ReviewWaitingSection'
import UpcomingInterviewSection from '@/features/dashboard/_index/components/upcoming-interview/UpcomingInterviewSection'
import { ScheduleModalProvider } from '@/features/dashboard/_index/contexts/ScheduleModalProvider'

export default function DashboardPage() {
  const leftColumnRef = useRef<HTMLDivElement>(null)
  const [calendarPanelHeight, setCalendarPanelHeight] = useState<number>()

  useEffect(() => {
    const leftColumn = leftColumnRef.current
    if (!leftColumn) return

    const updatePanelHeight = () => {
      setCalendarPanelHeight(Math.round(leftColumn.getBoundingClientRect().height))
    }

    updatePanelHeight()

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updatePanelHeight)
      return () => window.removeEventListener('resize', updatePanelHeight)
    }

    const observer = new ResizeObserver(() => updatePanelHeight())
    observer.observe(leftColumn)

    return () => observer.disconnect()
  }, [])

  return (
    <ScheduleModalProvider>
      <div className="flex w-full min-w-0 flex-col justify-center gap-10">
        <div className="flex w-full items-start gap-6">
          <div ref={leftColumnRef} className="flex w-225 flex-1 flex-col gap-10">
            <DashboardBanner variant="no_schedule" />
            <UpcomingInterviewSection />
            <ReviewWaitingSection />
          </div>
          <div
            className="bg-gray-150 w-80 shrink-0 overflow-hidden rounded-[20px] px-5 py-7"
            style={calendarPanelHeight != null ? { height: `${calendarPanelHeight}px` } : undefined}
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
