import { Calendar as AriaCalendar, I18nProvider } from 'react-aria-components'
import { useNavigate } from 'react-router'
import { getInterviewNavigationPath } from '@/constants/interviewReviewStatusRoutes'
import { CalendarFooter } from '@/features/dashboard/_index/components/interview-calendar/CalendarFooter'
import { CalendarGrid } from '@/features/dashboard/_index/components/interview-calendar/CalendarGrid'
import { CalendarHeader } from '@/features/dashboard/_index/components/interview-calendar/CalendarHeader'
import { useScheduleModal } from '@/features/dashboard/_index/contexts/ScheduleModalContext'
import { useInterviewCalendar } from '@/features/dashboard/_index/hooks/useInterviewCalendar'

export default function InterviewCalendar() {
  const navigate = useNavigate()
  const scheduleModal = useScheduleModal()
  const {
    focusedValue,
    selectedValue,
    selectedDate,
    isLoading,
    isError,
    selectedDateInterviews,
    setFocusedValue,
    setSelectedValue,
    getEventColor,
  } = useInterviewCalendar()

  return (
    <aside className="flex h-full min-h-0 w-full shrink-0 flex-col">
      <h2 className="title-s-semibold mb-7.5 text-gray-800">면접 캘린더</h2>
      <I18nProvider locale="ko-KR-u-ca-gregory">
        <AriaCalendar
          aria-label="면접 캘린더"
          value={selectedValue}
          onChange={setSelectedValue}
          focusedValue={focusedValue}
          onFocusChange={setFocusedValue}
          className="mb-5"
        >
          <CalendarHeader onAddClick={() => scheduleModal?.openModal()} />
          <CalendarGrid getEventColor={getEventColor} />
        </AriaCalendar>
      </I18nProvider>
      <div className="min-h-0 flex-1">
        <CalendarFooter
          selectedDate={selectedDate}
          items={selectedDateInterviews}
          isLoading={isLoading}
          isError={isError}
          onItemClick={(interview) =>
            navigate(getInterviewNavigationPath(interview.interviewId, interview.interviewReviewStatus))
          }
        />
      </div>
    </aside>
  )
}
