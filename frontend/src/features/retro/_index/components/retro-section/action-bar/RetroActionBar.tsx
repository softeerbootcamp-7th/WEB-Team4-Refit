import { Button } from '@/ui/components'

type RetroActionBarProps = {
  currentIndex: number
  totalCount: number
  onPrev: () => Promise<void>
  onNext: () => Promise<void>
  onComplete: () => Promise<void>
  isSaving?: boolean
}

export function RetroActionBar({
  currentIndex,
  totalCount,
  onPrev,
  onNext,
  onComplete,
  isSaving = false,
}: RetroActionBarProps) {
  const isFirst = currentIndex === 0
  const isLast = currentIndex === totalCount - 1

  return (
    <div className="flex shrink-0 justify-end gap-3">
      {!isFirst && (
        <Button variant="outline-gray-white" size="md" className="w-60" onClick={onPrev} isLoading={isSaving}>
          이전으로
        </Button>
      )}
      <Button
        variant="fill-orange-500"
        size="md"
        className="w-60"
        onClick={isLast ? onComplete : onNext}
        isLoading={isSaving}
      >
        {isLast ? '회고 완료' : '다음으로'}
      </Button>
    </div>
  )
}
