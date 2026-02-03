import { CaretDownIcon, PlusIcon } from '@/shared/assets'

interface CalendarHeaderProps {
  monthLabel: string
  onPrevMonth: () => void
  onNextMonth: () => void
}

export function CalendarHeader({ monthLabel, onPrevMonth, onNextMonth }: CalendarHeaderProps) {
  return (
    <div className="mb-3.5 flex items-center justify-between px-1">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrevMonth}
          className="flex h-6 w-6 cursor-pointer items-center justify-center text-gray-400 hover:text-gray-800"
          aria-label="이전 달"
        >
          <CaretDownIcon className="h-3 w-3 rotate-90" />
        </button>
        <span className="title-m-semibold text-gray-800">{monthLabel}</span>
        <button
          type="button"
          onClick={onNextMonth}
          className="flex h-6 w-6 cursor-pointer items-center justify-center text-gray-400 hover:text-gray-800"
          aria-label="다음 달"
        >
          <CaretDownIcon className="h-3 w-3 -rotate-90" />
        </button>
      </div>
      <button
        type="button"
        className="flex h-6.5 w-6.5 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white text-gray-400 hover:text-gray-600"
        aria-label="추가"
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  )
}
