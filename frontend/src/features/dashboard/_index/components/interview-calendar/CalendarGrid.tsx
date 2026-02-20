import {
  CalendarCell as AriaCalendarCell,
  CalendarGrid as AriaCalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  type CalendarCellRenderProps,
} from 'react-aria-components'
import {
  DATE_CELL_STYLE,
  type EventColor,
} from '@/features/dashboard/_index/constants/interviewCalendar'
import type { CalendarDate } from '@internationalized/date'

interface CalendarGridProps {
  getEventColor: (date: CalendarDate) => EventColor | undefined
}

export function CalendarGrid({ getEventColor }: CalendarGridProps) {
  return (
    <div className="overflow-hidden rounded-2xl">
      <AriaCalendarGrid className="w-full border-separate border-spacing-px bg-gray-150">
        <CalendarGridHeader className="bg-gray-100">
          {(day) => (
            <CalendarHeaderCell className="caption-l-semibold bg-gray-100 py-3 text-center text-gray-700">
              {day}
            </CalendarHeaderCell>
          )}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(date) => (
            <AriaCalendarCell
              date={date}
              className={({ isOutsideMonth }) =>
                `group box-border flex h-10 w-full flex-col items-center justify-start gap-1 bg-white py-2 ${isOutsideMonth ? 'cursor-default' : 'cursor-pointer'}`
              }
            >
              {(cellState) => (
                <span
                  className={`caption-l-medium flex h-6 w-6 items-center justify-center rounded-full transition-colors ${getDateCellStyle(
                    cellState,
                    cellState.isOutsideMonth ? undefined : getEventColor(cellState.date),
                  )}`}
                >
                  {cellState.formattedDate}
                </span>
              )}
            </AriaCalendarCell>
          )}
        </CalendarGridBody>
      </AriaCalendarGrid>
    </div>
  )
}

function getDateCellStyle(
  cellState: CalendarCellRenderProps,
  eventColor?: EventColor,
): string {
  if (cellState.isSelected) return DATE_CELL_STYLE.selected
  if (eventColor === 'orange') return 'bg-orange-100 text-orange-500'
  if (eventColor === 'gray') return 'bg-gray-100 text-gray-500'
  if (cellState.isToday) return DATE_CELL_STYLE.today
  if (cellState.isOutsideMonth) return DATE_CELL_STYLE.otherMonth
  return DATE_CELL_STYLE.default
}
