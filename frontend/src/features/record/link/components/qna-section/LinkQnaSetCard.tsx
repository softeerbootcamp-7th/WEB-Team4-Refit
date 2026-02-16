import type { ReactNode, Ref } from 'react'
import { QnaSetCard } from '@/features/_common/components/qna-set'
import { useHighlightContext } from '@/features/record/link/contexts'
import type { SimpleQnaType } from '@/types/interview'
import { DefaultButton, LinkingButtons, ResetButton } from './LinkButtons'

type CardState = 'linking' | 'linked' | 'idle'

type LinkQnaSetCardProps = {
  ref?: Ref<HTMLDivElement>
  qnaData: SimpleQnaType
  idx: number
}

export function LinkQnaSetCard({ ref, qnaData, idx }: LinkQnaSetCardProps) {
  const {
    hasPdf,
    linkingQnaSetId,
    startLinking,
    cancelLinking,
    highlights,
    removeHighlight,
    pendingSelection,
    saveHighlight,
  } = useHighlightContext()

  const { qnaSetId, questionText, answerText } = qnaData
  const highlight = highlights.get(qnaSetId)
  const state: CardState = linkingQnaSetId === qnaSetId ? 'linking' : highlight ? 'linked' : 'idle'
  const isOtherLinking = linkingQnaSetId !== null && state !== 'linking'

  const handleSave = () => {
    if (pendingSelection) saveHighlight(pendingSelection)
  }

  const cardClassName = [
    state === 'linking' ? 'border border-gray-300 shadow-md' : '',
    isOtherLinking ? 'pointer-events-none opacity-30' : '',
  ].join(' ')

  const badge: Record<CardState, ReactNode> = {
    linking: null,
    linked: <span className="body-s-regular text-orange-500">자기소개서 연결됨</span>,
    idle: null,
  }

  const buttons: Record<CardState, ReactNode> = {
    linking: <LinkingButtons pendingSelection={pendingSelection} onCancel={cancelLinking} onSave={handleSave} />,
    linked: <ResetButton onReset={() => removeHighlight(qnaSetId)} />,
    idle: <DefaultButton hasPdf={hasPdf} onStartLinking={() => startLinking(qnaSetId)} />,
  }

  const preview: Record<CardState, ReactNode> = {
    linking: pendingSelection && (
      <div className="rounded-lg bg-orange-50 p-3">
        <p className="body-s-medium mb-1 text-orange-400">선택된 자기소개서 내용</p>
        <p className="body-s-regular line-clamp-5 whitespace-pre-line text-gray-600">{pendingSelection.text}</p>
      </div>
    ),
    linked: (
      <div className="rounded-lg bg-gray-100 p-3">
        <p className="body-s-medium mb-1 text-gray-400">연결된 자기소개서 내용</p>
        <p className="body-s-regular line-clamp-5 whitespace-pre-line text-gray-600">{highlight?.text}</p>
      </div>
    ),
    idle: null,
  }

  return (
    <QnaSetCard idx={idx} questionText={questionText} answerText={answerText} ref={ref} className={cardClassName}>
      <div className="flex flex-col gap-2">
        <div className="flex items-end justify-between">
          {badge[state]}
          <div className="ml-auto flex gap-2">{buttons[state]}</div>
        </div>
        {preview[state]}
      </div>
    </QnaSetCard>
  )
}
