import { Fragment, useState, type RefObject } from 'react'
import { Border, FadeScrollArea } from '@/designs/components'
import type { KptTextsType, QnaSetType } from '@/types/interview'
import { KptDetailCard } from './KptDetailCard'
import { QnaRetroCard } from './QnaRetroCard'

type RetroDetailSectionProps = {
  interviewId: number
  qnaSets: QnaSetType[]
  kptTexts: KptTextsType
  setRef: (index: number, el: HTMLDivElement | null) => void
  scrollContainerRef: RefObject<HTMLDivElement | null>
}

export function RetroDetailSection({
  interviewId,
  qnaSets,
  kptTexts,
  setRef,
  scrollContainerRef,
}: RetroDetailSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  const isOtherEditing = (qnaSetId: number) => {
    if (editingId === null) return false
    return editingId !== `edit-${qnaSetId}`
  }

  const kptIndex = qnaSets.length
  const isKptOtherEditing = editingId !== null && editingId !== 'kpt'

  return (
    <FadeScrollArea ref={scrollContainerRef} withBottomSpacer className="flex flex-col gap-5 rounded-lg pr-2">
      {qnaSets.map((qnaSet, index) => (
        <Fragment key={qnaSet.qnaSetId}>
          <QnaRetroCard
            ref={(el) => setRef(index, el)}
            idx={index + 1}
            qnaSet={qnaSet}
            isOtherEditing={isOtherEditing(qnaSet.qnaSetId)}
            onEditingIdChange={setEditingId}
          />
          <Border />
        </Fragment>
      ))}
      <KptDetailCard
        ref={(el) => setRef(kptIndex, el)}
        interviewId={interviewId}
        kptTexts={kptTexts}
        isOtherEditing={isKptOtherEditing}
        onEditingIdChange={setEditingId}
      />
    </FadeScrollArea>
  )
}
