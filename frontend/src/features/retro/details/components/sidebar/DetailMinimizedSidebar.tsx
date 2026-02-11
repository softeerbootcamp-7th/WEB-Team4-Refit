import { MinimizedQuestionList } from '@/features/_common/components/sidebar'
import { NoteIcon } from '@/shared/assets'
import { Border, MinimizedSidebarLayout } from '@/shared/components'
import type { IdLabelType } from '@/types/global'
import type { QnaSetType } from '@/types/interview'

type DetailMinimizedSidebarProps = {
  qnaSets: QnaSetType[]
  activeIndex: number
  onItemClick: (index: number) => void
}

export function DetailMinimizedSidebar({ qnaSets, activeIndex, onItemClick }: DetailMinimizedSidebarProps) {
  const items: IdLabelType[] = [
    ...qnaSets.map(({ qnaSetId }, index) => ({
      id: qnaSetId,
      label: `${index + 1}번`,
    })),
    { id: -1, label: 'KPT' },
  ]

  return (
    <MinimizedSidebarLayout>
      <NoteIcon width="24" height="24" className="shrink-0" />
      <Border />
      <MinimizedQuestionList items={items} activeIndex={activeIndex} onItemClick={onItemClick} />
    </MinimizedSidebarLayout>
  )
}
