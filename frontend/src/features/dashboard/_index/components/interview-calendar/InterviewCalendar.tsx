import { useState } from 'react'
import { CalendarFooter } from '@/features/dashboard/_index/components/interview-calendar/CalendarFooter'
import { CalendarGrid } from '@/features/dashboard/_index/components/interview-calendar/CalendarGrid'
import { CalendarHeader } from '@/features/dashboard/_index/components/interview-calendar/CalendarHeader'
import { ScheduleModalContent } from '@/features/dashboard/_index/components/schedule-modal-content/ScheduleModalContent'
import {
  SCHEDULE_MODAL_STEP_CONFIG,
  type ScheduleModalStep,
} from '@/features/dashboard/_index/constants/interviewCalendar'
import { useInterviewCalendar } from '@/features/dashboard/_index/hooks/useInterviewCalendar'
import { Modal } from '@/shared/components'

export default function InterviewCalendar() {
  const [isAddScheduleModalOpen, setIsAddScheduleModalOpen] = useState(false)
  const [scheduleStep, setScheduleStep] = useState<ScheduleModalStep>('info')
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

  const handleModalClose = () => {
    setIsAddScheduleModalOpen(false)
    setScheduleStep('info')
  }

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
      <Modal
        open={isAddScheduleModalOpen}
        onClose={handleModalClose}
        title={SCHEDULE_MODAL_STEP_CONFIG[scheduleStep].title}
        description={SCHEDULE_MODAL_STEP_CONFIG[scheduleStep].description}
      >
        <ScheduleModalContent step={scheduleStep} onStepChange={setScheduleStep} onSubmit={handleModalClose} />
      </Modal>
    </>
  )
}
