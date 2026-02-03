import { useState } from 'react'
import { CalendarFooter } from '@/pages/dashboard/_index/components/interview-calendar/CalendarFooter'
import { CalendarGrid } from '@/pages/dashboard/_index/components/interview-calendar/CalendarGrid'
import { CalendarHeader } from '@/pages/dashboard/_index/components/interview-calendar/CalendarHeader'
import { ScheduleModalContent } from '@/pages/dashboard/_index/components/schedule-modal-content/ScheduleModalContent'
import { useInterviewCalendar } from '@/pages/dashboard/_index/hooks/useInterviewCalendar'
import { Modal } from '@/shared/components'

export default function InterviewCalendar() {
  const [isAddScheduleModalOpen, setIsAddScheduleModalOpen] = useState(false)
  const {
    today,
    viewDate,
    selectedDate,
    calendarDays,
    monthLabel,
    prevMonth,
    nextMonth,
    handleDateClick,
    getEventColor,
  } = useInterviewCalendar()

  return (
    <>
      <aside className="flex w-full shrink-0 flex-col">
        <h2 className="title-s-semibold mb-7.5 text-gray-800">면접 캘린더</h2>
        <CalendarHeader
          monthLabel={monthLabel}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
          onAddClick={() => setIsAddScheduleModalOpen(true)}
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
        <CalendarFooter />
      </aside>
      <Modal open={isAddScheduleModalOpen} onClose={() => setIsAddScheduleModalOpen(false)} title="면접 일정 추가">
        <ScheduleModalContent />
      </Modal>
    </>
  )
}
