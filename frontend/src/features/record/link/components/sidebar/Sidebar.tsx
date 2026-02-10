import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router'
import { NoteIcon } from '@/shared/assets'
import { Border, ListItemSmall } from '@/shared/components'
import { MinimizedSidebarLayout } from '@/shared/components/sidebar/SidebarLayout'

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
    <MinimizedSidebarLayout>
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
    </MinimizedSidebarLayout>
  )
}

const exampleData = Array.from({ length: 50 }, (_, i) => ({
  questionId: 100 + i,
  question: `${i + 1}번째 더미 질문입니다.`,
}))
