import { ListItemSmall } from '@/designs/components'
import type { IdLabelType } from '@/types/global'

type MinimizedQuestionListProps = {
  items: IdLabelType[]
  activeIndex: number
  onItemClick: (index: number) => void
}

export function MinimizedQuestionList({ items, activeIndex, onItemClick }: MinimizedQuestionListProps) {
  return (
    <div className="flex w-full flex-col items-center gap-0.5">
      {items.map(({ id, label }, index) => (
        <ListItemSmall key={id} content={label} active={activeIndex === index} onClick={() => onItemClick(index)} />
      ))}
    </div>
  )
}
