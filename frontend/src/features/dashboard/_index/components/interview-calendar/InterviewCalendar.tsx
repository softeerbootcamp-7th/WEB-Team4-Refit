import { useNavigate } from 'react-router'
import { CalendarFooter } from '@/features/dashboard/_index/components/interview-calendar/CalendarFooter'
import { CalendarGrid } from '@/features/dashboard/_index/components/interview-calendar/CalendarGrid'
import { CalendarHeader } from '@/features/dashboard/_index/components/interview-calendar/CalendarHeader'
import { useScheduleModal } from '@/features/dashboard/_index/contexts/ScheduleModalContext'
import { useInterviewCalendar } from '@/features/dashboard/_index/hooks/useInterviewCalendar'
import { ROUTES } from '@/routes/routes'

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
    <aside className="flex w-full shrink-0 flex-col">
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
      <CalendarFooter
        selectedDate={selectedDate}
        items={selectedDateInterviews}
        isLoading={isLoading}
        isError={isError}
        onItemClick={(interviewId) => navigate(ROUTES.RECORD.replace(':interviewId', String(interviewId)))}
      />
    </aside>
  )
}
