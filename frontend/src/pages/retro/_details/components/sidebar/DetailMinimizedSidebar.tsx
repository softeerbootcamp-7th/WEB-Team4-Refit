import { NoteIcon } from '@/shared/assets'
import { Border, ListItemSmall, SidebarLayout } from '@/shared/components'
import type { QnaSetType } from '@/types/interview'

type DetailMinimizedSidebarProps = {
  qnaSets: QnaSetType[]
  activeIndex: number
  onItemClick: (index: number) => void
}

export function DetailMinimizedSidebar({ qnaSets, activeIndex, onItemClick }: DetailMinimizedSidebarProps) {
  return (
    <SidebarLayout isMinimized>
      <NoteIcon width="24" height="24" className="shrink-0" />
      <Border />
      <div className="flex w-full flex-col items-center gap-0.5">
        {qnaSets.map(({ qnaSetId }, index) => (
          <ListItemSmall
            key={qnaSetId}
            content={`${index + 1}번`}
            active={activeIndex === index}
            onClick={() => onItemClick(index)}
          />
        ))}
        <ListItemSmall
          content="KPT"
          active={activeIndex === qnaSets.length}
          onClick={() => onItemClick(qnaSets.length)}
        />
      </div>
    </SidebarLayout>
  )
}
