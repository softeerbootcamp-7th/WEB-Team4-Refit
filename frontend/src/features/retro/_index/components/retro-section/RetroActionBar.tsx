import { useNavigate } from 'react-router'
import { useRetroContext } from '@/features/retro/_index/contexts'
import { Button } from '@/shared/components'
import { ROUTES } from '@/shared/constants/routes'

export function RetroActionBar() {
  const navigate = useNavigate()
  const { currentIndex, totalCount, updateCurrentIndex } = useRetroContext()
  const isLast = currentIndex === totalCount - 1
  const buttonText = isLast ? '회고 완료' : '다음으로'

  const handleNext = () => {
    // TODO: 회고 저장 API 호출
    updateCurrentIndex(currentIndex + 1)
  }

  const handleComplete = () => {
    // TODO: KPT 저장 API 호출
    navigate(ROUTES.DASHBOARD)
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
