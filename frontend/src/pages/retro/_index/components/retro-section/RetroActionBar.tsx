import { useRetroContext } from '@/pages/retro/_index/contexts'
import { Button } from '@/shared/components'

export function RetroActionBar() {
  const { currentIndex, isLast, navigate } = useRetroContext()

  const buttonText = isLast ? '회고 완료' : '다음으로'
  const handleNextClick = () => {
    if (isLast) {
      // KPT 저장 API 호출
      // 다음페이지로 이동
    } else {
      // 회고 저장 API 호출
      navigate(currentIndex + 1)
    }
  }

  return (
    <div className="flex shrink-0 justify-end gap-3">
      <Button variant="fill-orange-500" size="md" className="w-60" onClick={handleNextClick}>
        {buttonText}
      </Button>
    </div>
  )
}
