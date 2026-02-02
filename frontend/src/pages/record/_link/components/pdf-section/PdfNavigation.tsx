import { CaretUpIcon } from '@/shared/assets'
import { Button } from '@/shared/components'

type PdfNavigationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function PdfNavigation({ currentPage, totalPages, onPageChange }: PdfNavigationProps) {
  const goToPrev = () => onPageChange(Math.max(1, currentPage - 1))
  const goToNext = () => onPageChange(Math.min(totalPages, currentPage + 1))

  return (
    <div className="flex shrink-0 items-center justify-center gap-4 py-3">
      <Button size="xs" onClick={goToPrev} disabled={currentPage <= 1}>
        <CaretUpIcon className="rotate-270" />
      </Button>
      <span className="body-s-regular text-gray-500">
        {currentPage} / {totalPages}
      </span>
      <Button size="xs" onClick={goToNext} disabled={currentPage >= totalPages}>
        <CaretUpIcon className="rotate-90" />
      </Button>
    </div>
  )
}
