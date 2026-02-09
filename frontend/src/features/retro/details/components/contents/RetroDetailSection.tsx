import { Fragment, useState, type RefObject } from 'react'
import { Border, FadeScrollArea } from '@/shared/components'
import type { QnaSetType } from '@/types/interview'
import { KptDetailCard } from './KptDetailCard'
import { QnaRetroCard } from './QnaRetroCard'

type RetroDetailSectionProps = {
  qnaSets: QnaSetType[]
  setRef: (index: number, el: HTMLDivElement | null) => void
  scrollContainerRef: RefObject<HTMLDivElement | null>
}

export function RetroDetailSection({ qnaSets, setRef, scrollContainerRef }: RetroDetailSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  return (
    <FadeScrollArea ref={scrollContainerRef} className="flex flex-col gap-5 rounded-lg pr-2">
      {qnaSets.map((qnaSet, index) => (
        <Fragment key={qnaSet.qnaSetId}>
          <QnaRetroCard
            key={qnaSet.qnaSetId}
            ref={(el) => setRef(index, el)}
            idx={index + 1}
            qnaSet={qnaSet}
            isOtherEditing={
              editingId !== null && editingId !== `qna-${qnaSet.qnaSetId}` && editingId !== `retro-${qnaSet.qnaSetId}`
            }
            onEditingIdChange={(id) => setEditingId(id)}
          />
          <Border />
        </Fragment>
      ))}
      <KptDetailCard
        ref={(el) => setRef(qnaSets.length, el)}
        isOtherEditing={editingId !== null && editingId !== 'kpt'}
        onEditingIdChange={setEditingId}
      />
    </FadeScrollArea>
  )
}
