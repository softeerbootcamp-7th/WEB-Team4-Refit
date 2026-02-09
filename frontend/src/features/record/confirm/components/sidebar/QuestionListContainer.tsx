import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ContainerWithHeader, ListItemLarge } from '@/shared/components'

export type QuestionListProps = {
  questionData?: { questionId: number; question: string }[]
}

export const QuestionListContainer = ({ questionData = exampleData }: QuestionListProps) => {
  // TODO: 훅으로 분리하기
  const activeId = useParams().questionId
  const navigate = useNavigate()
  const isActive = useCallback(
    (questionId: number) => {
      return activeId === String(questionId)
    },
    [activeId],
  )
  const handleClick = (id: number) => {
    navigate(`?questionId=${id}`)
  }
  return (
    <ContainerWithHeader title="질문 리스트">
      {questionData.map(({ questionId, question }, index) => (
        <ListItemLarge
          key={questionId}
          content={`${index + 1}. ${question}`}
          active={isActive(questionId)}
          onClick={() => handleClick(questionId)}
        />
      ))}
    </ContainerWithHeader>
  )
}

const exampleData = Array.from({ length: 50 }, (_, i) => ({
  questionId: 100 + i,
  question: `${i + 1}번째 더미 질문입니다.`,
}))
