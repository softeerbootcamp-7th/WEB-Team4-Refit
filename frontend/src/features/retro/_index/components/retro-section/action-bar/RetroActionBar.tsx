import { Button } from '@/designs/components'

type RetroActionBarProps = {
  currentIndex: number
  totalCount: number
  onNext: () => Promise<void>
  onComplete: () => Promise<void>
  isSaving?: boolean
}

export function RetroActionBar({
  currentIndex,
  totalCount,
  onNext,
  onComplete,
  isSaving = false,
}: RetroActionBarProps) {
  const isLast = currentIndex === totalCount - 1
  const buttonText = isLast ? '회고 완료' : '다음으로'

  const handleButtonClick = isLast ? onComplete : onNext

  return (
    <div className="flex shrink-0 justify-end gap-3">
      <Button
        variant="fill-orange-500"
        size="md"
        className="w-60"
        onClick={handleButtonClick}
        isLoading={isSaving}
      >
        {buttonText}
      </Button>
    </div>
  )
}
