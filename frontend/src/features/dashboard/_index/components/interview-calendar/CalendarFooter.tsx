import { CalendarStarIcon } from '@/designs/assets'
import { CalendarInterviewCard } from '@/features/dashboard/_index/components/interview-calendar/CalendarInterviewCard'
import type { CalendarInterviewItem } from '@/features/dashboard/_index/hooks/useInterviewCalendar'

interface CalendarFooterProps {
  selectedDate: { year: number; month: number; day: number }
  items: CalendarInterviewItem[]
  isLoading: boolean
  isError: boolean
  onItemClick: (interview: CalendarInterviewItem['interview']) => void
}

export function CalendarFooter({ selectedDate, items, isLoading, isError, onItemClick }: CalendarFooterProps) {
  const selectedDateLabel = `${selectedDate.month + 1}월 ${selectedDate.day}일`

  if (isLoading) {
    return (
      <div className="rounded-[10px] bg-gray-100 px-5 py-4">
        <p className="body-m-medium text-gray-400">면접 일정을 불러오는 중이에요.</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-[10px] bg-gray-100 px-5 py-4">
        <p className="body-m-medium text-gray-400">면접 일정을 불러오지 못했어요.</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-1.5 rounded-[10px] bg-gray-100 px-5 py-6">
        <CalendarStarIcon className="h-8 w-8 text-gray-300" />
        <p className="body-s-medium text-gray-400">{selectedDateLabel}의 면접 정보가 없어요</p>
        <p className="caption-m-medium text-gray-300">+ 버튼으로 면접 일정을 추가해보세요.</p>
      </div>
    )
  }

  return (
    <ul data-calendar-footer-list="true" className="flex h-full min-h-0 flex-col gap-1.5 overflow-y-auto">
      {items.map(({ interview }) => (
        <CalendarInterviewCard key={interview.interviewId} interview={interview} onItemClick={onItemClick} />
      ))}
    </ul>
  )
}
