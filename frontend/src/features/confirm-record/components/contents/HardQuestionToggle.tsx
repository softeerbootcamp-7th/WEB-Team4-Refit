import { useState } from 'react'
import Badge from '@/shared/Badge'

type HardQuestionToggleProps = {
  id: number
  defaultActive?: boolean
}

export const HardQuestionToggle = ({ id, defaultActive = false }: HardQuestionToggleProps) => {
  const [isActive, setIsActive] = useState(defaultActive)

  const handleHardToggleClick = () => {
    setIsActive((prev) => !prev)
    console.log('이 질문 어려웠어요!', id)
  }

  const theme = isActive ? 'red-50' : 'gray-white-outline'
  return (
    <button type="button" onClick={handleHardToggleClick} className="cursor-pointer">
      <Badge type="hard-label" theme={theme} content="이 질문 어려웠어요!" />
    </button>
  )
}
