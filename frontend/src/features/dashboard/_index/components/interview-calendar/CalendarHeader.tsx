import { Button, Heading, useLocale } from 'react-aria-components'
import { CaretDownIcon, PlusIcon } from '@/ui/assets'

interface CalendarHeaderProps {
  onAddClick: () => void
}

export function CalendarHeader({ onAddClick }: CalendarHeaderProps) {
  const { direction } = useLocale()

  return (
    <div className="mb-3.5 flex items-center justify-between px-1">
      <div className="flex items-center gap-2">
        <Button
          slot="previous"
          className="flex h-6 w-6 cursor-pointer items-center justify-center text-gray-400 hover:text-gray-800"
          aria-label="이전 달"
        >
          <CaretDownIcon className={`h-3 w-3 ${direction === 'rtl' ? '-rotate-90' : 'rotate-90'}`} />
        </Button>
        <Heading className="title-m-semibold text-gray-800" />
        <Button
          slot="next"
          className="flex h-6 w-6 cursor-pointer items-center justify-center text-gray-400 hover:text-gray-800"
          aria-label="다음 달"
        >
          <CaretDownIcon className={`h-3 w-3 ${direction === 'rtl' ? 'rotate-90' : '-rotate-90'}`} />
        </Button>
      </div>
      <button
        type="button"
        onClick={onAddClick}
        className="flex h-6.5 w-6.5 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white text-gray-400 hover:text-gray-600"
        aria-label="추가"
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  )
}
