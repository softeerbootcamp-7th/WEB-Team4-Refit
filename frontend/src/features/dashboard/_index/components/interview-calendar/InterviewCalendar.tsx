import { Calendar as AriaCalendar, I18nProvider } from 'react-aria-components'
import { useNavigate } from 'react-router'
import { getInterviewNavigationPath } from '@/constants/interviewReviewStatusRoutes'
import { CalendarFooter } from '@/features/dashboard/_index/components/interview-calendar/CalendarFooter'
import { CalendarGrid } from '@/features/dashboard/_index/components/interview-calendar/CalendarGrid'
import { CalendarHeader } from '@/features/dashboard/_index/components/interview-calendar/CalendarHeader'
import { useScheduleModal } from '@/features/dashboard/_index/contexts/ScheduleModalContext'
import { useInterviewCalendar } from '@/features/dashboard/_index/hooks/useInterviewCalendar'

const DEFAULT_INTERVIEW_TIME = '10:00'

const toDateInputValue = (date: { year: number; month: number; day: number }) => {
  const yyyy = String(date.year)
  const mm = String(date.month + 1).padStart(2, '0')
  const dd = String(date.day).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const isPastDate = (date: { year: number; month: number; day: number }) => {
  const selected = new Date(date.year, date.month, date.day)
  selected.setHours(0, 0, 0, 0)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return selected.getTime() <= today.getTime()
}

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
  const selectedDateInputValue = toDateInputValue(selectedDate)
  const isPastSelectedDate = isPastDate(selectedDate)

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
          items={selectedDateInterviews}
          isLoading={isLoading}
          isError={isError}
          onItemClick={(interview) =>
            navigate(getInterviewNavigationPath(interview.interviewId, interview.interviewReviewStatus))
          }
          onEmptyActionClick={() =>
            scheduleModal?.openModal({
              interviewDate: selectedDateInputValue,
              interviewTime: DEFAULT_INTERVIEW_TIME,
              pastOnly: isPastSelectedDate,
            })
          }
        />
      </div>
    </aside>
  )
}
