import { useRetroContext } from '@/pages/retro/_index/contexts'
import { Button } from '@/shared/components'

export function RetroActionBar() {
  const { currentIndex, totalCount, updateCurrentIndex } = useRetroContext()
  const isLast = currentIndex === totalCount - 1
  const buttonText = isLast ? '회고 완료' : '다음으로'

  const handleNext = () => {
    // TODO: 회고 저장 API 호출
    updateCurrentIndex(currentIndex + 1)
  }

  const handleComplete = () => {
    // TODO: KPT 저장 API 호출 + 다음 페이지로 이동
  }

  const handleButtonClick = isLast ? handleComplete : handleNext

  return (
    <div className="flex shrink-0 justify-end gap-3">
      <Button variant="fill-orange-500" size="md" className="w-60" onClick={handleButtonClick}>
        {buttonText}
      </Button>
    </div>
  )
}
