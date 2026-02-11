import type { RefObject } from 'react'
import { FadeScrollArea } from '@/designs/components'
import type { SimpleQnaType } from '@/types/interview'
import { LinkQnaSetCard } from './LinkQnaSetCard'

type QnaListSectionProps = {
  qnaList: SimpleQnaType[]
  setRef: (index: number, el: HTMLDivElement | null) => void
  scrollContainerRef: RefObject<HTMLDivElement | null>
}

export function QnaListSection({ qnaList, setRef, scrollContainerRef }: QnaListSectionProps) {
  return (
    <FadeScrollArea ref={scrollContainerRef} className="space-y-3 pr-2">
      {qnaList.map((qnaData, idx) => (
        <LinkQnaSetCard key={qnaData.qnaSetId} ref={(el) => setRef(idx, el)} qnaData={qnaData} idx={idx + 1} />
      ))}
    </FadeScrollArea>
  )
}
