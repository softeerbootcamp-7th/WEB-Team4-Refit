import { useEffect, useRef, useCallback } from 'react'
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
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  // 리스트 길이 변화에 맞춰 ref 배열 크기 조정
  useEffect(() => {
    if (itemRefs.current.length !== items.length) {
      itemRefs.current = Array(items.length).fill(null)
    }
  }, [items.length])

  // activeIndex 변경 시 해당 아이템으로 스크롤
  useEffect(() => {
    const ref = itemRefs.current[activeIndex]
    if (ref) {
      ref.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [activeIndex])

  const setItemRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      itemRefs.current[index] = el
    },
    [],
  )

  return (
    <ContainerWithHeader title={title} className={`overflow-y-auto ${className}`}>
      {items.map(({ id, label }, index) => (
        <div key={id} ref={setItemRef(index)}>
          <ListItemLarge content={label} active={activeIndex === index} onClick={() => onItemClick(index)} />
        </div>
      ))}
    </ContainerWithHeader>
  )
}
