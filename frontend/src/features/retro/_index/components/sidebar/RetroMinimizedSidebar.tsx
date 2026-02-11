import { NoteIcon } from '@/designs/assets'
import { Border, MinimizedSidebarLayout } from '@/designs/components'
import { MinimizedQuestionList } from '@/features/_common/components/sidebar'
import type { IdLabelType } from '@/types/global'

type RetroMinimizedSidebarProps = {
  items: IdLabelType[]
  activeIndex: number
  onItemClick: (index: number) => void
}

export function RetroMinimizedSidebar({ items, activeIndex, onItemClick }: RetroMinimizedSidebarProps) {
  return (
    <MinimizedSidebarLayout>
      <NoteIcon width="24" height="24" className="shrink-0" />
      <Border />
      <MinimizedQuestionList items={items} activeIndex={activeIndex} onItemClick={onItemClick} />
    </MinimizedSidebarLayout>
  )
}
