import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router'
import { NoteIcon } from '@/assets'
import { Border, ListItemSmall, SidebarLayout } from '@/shared/sidebar'

export const RecordLinkSidebar = () => {
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
    <SidebarLayout size="small">
      <NoteIcon width="24" height="24" className="shrink-0" />
      <Border />
      <div className="flex w-full flex-col items-center gap-0.5">
        {exampleData.map(({ questionId }, index) => (
          <ListItemSmall
            key={questionId}
            content={`${index + 1}번`}
            active={isActive(questionId)}
            onClick={() => handleClick(questionId)}
          />
        ))}
      </div>
    </SidebarLayout>
  )
}

const exampleData = Array.from({ length: 50 }, (_, i) => ({
  questionId: 100 + i,
  question: `${i + 1}번째 더미 질문입니다.`,
}))
