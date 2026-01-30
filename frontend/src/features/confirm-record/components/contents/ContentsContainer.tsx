import { useState } from 'react'
import Badge from '@/shared/Badge'
import { Border } from '@/shared/sidebar/Border'

type QnAType = {
  question: string
  answer: string
}
export const ContentsContainer = ({ data, idx }: { data: QnAType; idx: number }) => {
  const [isActive, setIsActive] = useState(false)

  const handleHardToggleClick = () => {
    setIsActive((prev) => !prev)
  }
  return (
    <div className="bg-gray-white flex flex-col gap-4 rounded-lg p-5">
      <div className="inline-flex flex-wrap gap-2.5">
        <Badge type="question-label" theme="orange-100" content={`${idx}번 질문`} />
        <span className="title-m-semibold">{data.question}</span>
        <Toggle isActive={isActive} onClick={handleHardToggleClick} />
      </div>
      <Border />
      <div>{data.answer}</div>
    </div>
  )
}

const Toggle = ({ isActive, onClick }: { isActive: boolean; onClick: () => void }) => {
  const isTheme = isActive ? 'gray-white-outline' : 'red-50'
  return (
    <Badge
      type="hard-label"
      theme={isTheme}
      content="이 질문 어려웠어요!"
      onClick={onClick}
      className="cursor-pointer"
    />
  )
}
