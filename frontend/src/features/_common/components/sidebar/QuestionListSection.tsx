import { ContainerWithHeader, ListItemLarge } from '@/designs/components'
import type { IdLabelType } from '@/types/global'

type QuestionListSectionProps = {
  title: string
  items: IdLabelType[]
  activeIndex: number
  onItemClick: (index: number) => void
  className?: string
}

export function QuestionListSection({ title, items, activeIndex, onItemClick, className }: QuestionListSectionProps) {
  return (
    <ContainerWithHeader title={title} className={className}>
      {items.map(({ id, label }, index) => (
        <ListItemLarge key={id} content={label} active={activeIndex === index} onClick={() => onItemClick(index)} />
      ))}
    </ContainerWithHeader>
  )
}
