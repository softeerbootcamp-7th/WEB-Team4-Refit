import {
  DATE_CELL_STYLE,
  WEEKDAYS,
  type EventColor,
} from '@/features/dashboard/_index/constants/interviewCalendar'

interface CalendarGridProps {
  today: Date
  viewDate: { year: number; month: number }
  selectedDate: { year: number; month: number; day: number }
  calendarDays: { day: number; isCurrentMonth: boolean }[]
  onDateClick: (day: number, isCurrentMonth: boolean) => void
  getEventColor: (day: number) => EventColor | undefined
}

export function CalendarGrid({
  today,
  viewDate,
  selectedDate,
  calendarDays,
  onDateClick,
  getEventColor,
}: CalendarGridProps) {
  return (
    <div className="overflow-hidden rounded-2xl">
      <div className="border-gray-150 grid grid-cols-7 border-b bg-gray-100">
        {WEEKDAYS.map((w) => (
          <div key={w.label} className="caption-l-semibold py-3 text-center text-gray-700">
            {w.label}
          </div>
        ))}
      </div>
      <div className="bg-gray-150 grid grid-cols-7 gap-px">
        {calendarDays.map((date, idx) => (
          <CalendarDay
            key={idx}
            date={date}
            today={today}
            viewDate={viewDate}
            selectedDate={selectedDate}
            onClick={() => onDateClick(date.day, date.isCurrentMonth)}
            eventColor={date.isCurrentMonth ? getEventColor(date.day) : undefined}
          />
        ))}
      </div>
    </div>
  )
}

interface CalendarDayProps {
  date: { day: number; isCurrentMonth: boolean }
  today: Date
  viewDate: { year: number; month: number }
  selectedDate: { year: number; month: number; day: number }
  onClick: () => void
  eventColor?: EventColor
}

function getDateCellStyle(
  date: { day: number; isCurrentMonth: boolean },
  today: Date,
  viewDate: { year: number; month: number },
  selectedDate: { year: number; month: number; day: number },
  eventColor?: EventColor,
): string {
  const isSelected =
    date.isCurrentMonth &&
    date.day === selectedDate.day &&
    viewDate.month === selectedDate.month &&
    viewDate.year === selectedDate.year

  const isToday =
    date.isCurrentMonth &&
    date.day === today.getDate() &&
    viewDate.month === today.getMonth() &&
    viewDate.year === today.getFullYear()

  if (isSelected) return DATE_CELL_STYLE.selected
  if (eventColor === 'orange') return 'bg-orange-100 text-orange-500'
  if (eventColor === 'gray') return 'bg-gray-100 text-gray-500'
  if (isToday) return DATE_CELL_STYLE.today
  if (!date.isCurrentMonth) return DATE_CELL_STYLE.otherMonth
  return DATE_CELL_STYLE.default
}

function CalendarDay({ date, today, viewDate, selectedDate, eventColor, onClick }: CalendarDayProps) {
  const dateStyleClass = getDateCellStyle(date, today, viewDate, selectedDate, eventColor)
  const isCurrentMonth = date.isCurrentMonth

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group box-border flex h-10 w-full flex-col items-center justify-start gap-1 bg-white py-2 ${!isCurrentMonth ? 'cursor-default' : 'cursor-pointer'}`}
    >
      <span
        className={`caption-l-medium flex h-6 w-6 items-center justify-center rounded-full transition-colors ${dateStyleClass}`}
      >
        {date.day}
      </span>
    </button>
  )
}
