import { MinimizedQuestionList } from '@/features/_common/components/sidebar'
import type { IdLabelType } from '@/types/global'
import { NoteIcon } from '@/ui/assets'
import { Border, MinimizedSidebarLayout } from '@/ui/components'

type RecordLinkSidebarProps = {
  items: IdLabelType[]
  activeIndex: number
  onItemClick: (index: number) => void
}

export function RecordLinkSidebar({ items, activeIndex, onItemClick }: RecordLinkSidebarProps) {
  return (
    <MinimizedSidebarLayout>
      <NoteIcon width="24" height="24" className="shrink-0" />
      <Border />
      <MinimizedQuestionList items={items} activeIndex={activeIndex} onItemClick={onItemClick} />
    </MinimizedSidebarLayout>
  )
}
