import { useNavigate } from 'react-router'
import { ROUTES } from '@/routes/routes'
import { Button } from '@/shared/components'

type RetroActionBarProps = {
  currentIndex: number
  totalCount: number
  onIndexChange: (index: number) => void
}

export function RetroActionBar({ currentIndex, totalCount, onIndexChange }: RetroActionBarProps) {
  const navigate = useNavigate()
  const isLast = currentIndex === totalCount - 1
  const buttonText = isLast ? '회고 완료' : '다음으로'

  const handleNext = () => {
    // TODO: 회고 저장 API 호출
    onIndexChange(currentIndex + 1)
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
