import { useState } from 'react'
import Badge from '@/shared/Badge'
import { Border } from '@/shared/sidebar/Border'

type QnAType = Pick<QnaSetType, 'qnaSetId' | 'questionText' | 'answerText'>

type QnaSetContainerProps = {
  qnaData: QnAType
  idx: number
}

export const QnaSetContainer = ({ qnaData, idx }: QnaSetContainerProps) => {
  return (
    <div className="bg-gray-white flex flex-col gap-4 rounded-lg p-5">
      <div className="inline-flex flex-wrap gap-2.5">
        <Badge type="question-label" theme="orange-100" content={`${idx}번 질문`} />
        <span className="title-m-semibold">{qnaData.questionText}</span>
        <HardQuestionToggle id={qnaData.qnaSetId} />
      </div>
      <Border />
      <div>{qnaData.answerText}</div>
    </div>
  )
}

type toggleType = {
  id: number
}
const HardQuestionToggle = ({ id }: toggleType) => {
  const [isActive, setIsActive] = useState(false)

  const handleHardToggleClick = () => {
    setIsActive((prev) => !prev)
    console.log('이 질문 어려웠어요!', id)
  }

  const theme = isActive ? 'gray-white-outline' : 'red-50'
  return (
    <button type="button" onClick={handleHardToggleClick} className="cursor-pointer">
      <Badge type="hard-label" theme={theme} content="이 질문 어려웠어요!" />
    </button>
  )
}
