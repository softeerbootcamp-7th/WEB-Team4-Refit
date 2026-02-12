import { useState, type Ref } from 'react'
import { Button } from '@/designs/components'
import { QnaSetCard } from '@/features/_common/components/qna-set'
import { useHighlightContext } from '@/features/record/link/contexts'
import type { SimpleQnaType } from '@/types/interview'

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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const { qnaSetId, questionText, answerText } = qnaData

  const isActive = linkingQnaSetId === qnaSetId
  const isOtherLinking = linkingQnaSetId !== null && !isActive
  const highlight = highlights.get(qnaSetId)
  const hasHighlight = !!highlight

  const handleReset = () => {
    removeHighlight(qnaSetId)
    setIsPreviewOpen(false)
  }

  const handleSave = () => {
    if (pendingSelection) saveHighlight(pendingSelection)
  }

  const cardClassName = [
    isActive ? 'border border-gray-300 shadow-md' : '',
    isOtherLinking ? 'pointer-events-none opacity-30' : '',
  ].join(' ')

  return (
    <QnaSetCard idx={idx} questionText={questionText} answerText={answerText} ref={ref} className={cardClassName}>
      <div className="flex items-center justify-between">
        {hasHighlight && <span className="body-s-regular text-orange-500">자기소개서 연결됨</span>}
        <div className="ml-auto flex gap-2">
          {isActive && (
            <LinkingButtons pendingSelection={pendingSelection} onCancel={cancelLinking} onSave={handleSave} />
          )}
          {!isActive && hasHighlight && (
            <LinkedButtons
              isPreviewOpen={isPreviewOpen}
              onReset={handleReset}
              onTogglePreview={() => setIsPreviewOpen((v) => !v)}
            />
          )}
          {!isActive && !hasHighlight && (
            <DefaultButton hasPdf={hasPdf} onStartLinking={() => startLinking(qnaSetId)} />
          )}
        </div>
      </div>
      {isPreviewOpen && hasHighlight && (
        <div className="rounded-lg bg-gray-100 p-3">
          <p className="body-s-medium mb-1 text-gray-400">연결된 자기소개서 내용</p>
          <p className="body-s-regular line-clamp-5 whitespace-pre-line text-gray-600">{highlight.text}</p>
        </div>
      )}
    </QnaSetCard>
  )
}

type LinkingButtonsProps = {
  pendingSelection: unknown
  onCancel: () => void
  onSave: () => void
}

function LinkingButtons({ pendingSelection, onCancel, onSave }: LinkingButtonsProps) {
  return (
    <>
      <Button variant="outline-gray-100" size="xs" onClick={onCancel}>
        취소
      </Button>
      <Button variant="fill-orange-500" size="xs" disabled={!pendingSelection} onClick={onSave}>
        연결 저장
      </Button>
    </>
  )
}

type LinkedButtonsProps = {
  isPreviewOpen: boolean
  onReset: () => void
  onTogglePreview: () => void
}

function LinkedButtons({ isPreviewOpen, onReset, onTogglePreview }: LinkedButtonsProps) {
  return (
    <>
      <Button size="xs" variant="outline-gray-100" onClick={onReset}>
        초기화
      </Button>
      <Button size="xs" variant="outline-orange-100" onClick={onTogglePreview}>
        {isPreviewOpen ? '닫기' : '연결 확인하기'}
      </Button>
    </>
  )
}

type DefaultButtonProps = {
  hasPdf: boolean
  onStartLinking: () => void
}

function DefaultButton({ hasPdf, onStartLinking }: DefaultButtonProps) {
  return (
    <Button size="xs" variant="outline-orange-100" disabled={!hasPdf} onClick={onStartLinking}>
      {hasPdf ? '자기소개서 연결하기' : '자기소개서를 먼저 업로드해주세요'}
    </Button>
  )
}
