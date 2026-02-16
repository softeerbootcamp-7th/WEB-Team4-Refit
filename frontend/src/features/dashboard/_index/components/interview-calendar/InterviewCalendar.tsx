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
    today,
    viewDate,
    selectedDate,
    calendarDays,
    monthLabel,
    isLoading,
    isError,
    selectedDateInterviews,
    prevMonth,
    nextMonth,
    handleDateClick,
    getEventColor,
  } = useInterviewCalendar()

  return (
    <aside className="flex h-full min-h-0 w-full shrink-0 flex-col">
      <h2 className="title-s-semibold mb-7.5 text-gray-800">면접 캘린더</h2>
      <CalendarHeader
        monthLabel={monthLabel}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
        onAddClick={() => scheduleModal?.openModal()}
      />
      <div className="mb-5">
        <CalendarGrid
          today={today}
          viewDate={viewDate}
          selectedDate={selectedDate}
          calendarDays={calendarDays}
          onDateClick={handleDateClick}
          getEventColor={getEventColor}
        />
      </div>
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
