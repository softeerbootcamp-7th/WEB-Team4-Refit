import type { ReactNode } from 'react'
import { CaretUpIcon } from '@/designs/assets'
import { Button } from '@/designs/components'

const ZOOM_STEPS = [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]

type PdfNavigationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  zoom: number
  onZoomChange: (zoom: number) => void
  actions?: ReactNode
}

export function PdfNavigation({
  currentPage,
  totalPages,
  onPageChange,
  zoom,
  onZoomChange,
  actions,
}: PdfNavigationProps) {
  const goToPrev = () => onPageChange(Math.max(1, currentPage - 1))
  const goToNext = () => onPageChange(Math.min(totalPages, currentPage + 1))

  const currentStepIndex = ZOOM_STEPS.findIndex((s) => s >= zoom)
  const zoomIn = () => {
    const nextIndex = Math.min(ZOOM_STEPS.length - 1, currentStepIndex + 1)
    onZoomChange(ZOOM_STEPS[nextIndex])
  }
  const zoomOut = () => {
    const prevIndex = Math.max(0, (currentStepIndex === -1 ? ZOOM_STEPS.length : currentStepIndex) - 1)
    onZoomChange(ZOOM_STEPS[prevIndex])
  }
  const resetZoom = () => onZoomChange(1)

  return (
    <div className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-center py-3">
      <div />
      <div className="flex items-center gap-4">
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
      <div className="flex items-center justify-end gap-3">
        <div className="flex items-center gap-1">
          <Button size="xs" onClick={zoomOut} disabled={zoom <= ZOOM_STEPS[0]}>
            -
          </Button>
          <Button size="xs" onClick={resetZoom}>
            {Math.round(zoom * 100)}%
          </Button>
          <Button size="xs" onClick={zoomIn} disabled={zoom >= ZOOM_STEPS[ZOOM_STEPS.length - 1]}>
            +
          </Button>
        </div>
        {actions}
      </div>
    </div>
  )
}
