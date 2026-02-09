import { useState } from 'react'
import { useHighlightContext } from '@/features/record/link/contexts'
import { Badge, Button, Border } from '@/shared/components'
import type { QnAType } from './QnaListSection'

type LinkQnaSetCardProps = {
  qnaData: QnAType
  idx: number
}

export function LinkQnaSetCard({ qnaData, idx }: LinkQnaSetCardProps) {
  const { hasPdf, linkingQnaSetId, startLinking, cancelLinking, highlights, removeHighlight, pendingSelection, saveHighlight } =
    useHighlightContext()
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const isLinking = linkingQnaSetId === qnaData.qnaSetId
  const isOtherLinking = linkingQnaSetId !== null && !isLinking
  const highlight = highlights.get(qnaData.qnaSetId)
  const hasHighlight = !!highlight

  const handleReset = () => {
    removeHighlight(qnaData.qnaSetId)
    setIsPreviewOpen(false)
  }

  const handleSave = () => {
    if (pendingSelection) saveHighlight(pendingSelection)
  }

  const renderActionButtons = () => {
    if (isLinking) {
      return (
        <>
          <Button variant="outline-gray-100" size="xs" onClick={cancelLinking}>
            취소
          </Button>
          <Button variant="fill-orange-500" size="xs" disabled={!pendingSelection} onClick={handleSave}>
            연결 저장
          </Button>
        </>
      )
    }

    if (hasHighlight) {
      return (
        <>
          <Button size="xs" variant="outline-gray-100" onClick={handleReset}>
            초기화
          </Button>
          <Button size="xs" variant="outline-orange-100" onClick={() => setIsPreviewOpen((v) => !v)}>
            {isPreviewOpen ? '닫기' : '연결 확인하기'}
          </Button>
        </>
      )
    }

    return (
      <Button size="xs" variant="outline-orange-100" disabled={!hasPdf} onClick={() => startLinking(qnaData.qnaSetId)}>
        {hasPdf ? '자기소개서 연결하기' : '자기소개서를 먼저 업로드해주세요'}
      </Button>
    )
  }

  return (
    <div
      className={`bg-gray-white relative flex flex-col gap-4 rounded-lg p-5 transition-opacity ${
        isLinking ? 'border border-gray-300 shadow-md' : ''
      } ${isOtherLinking ? 'pointer-events-none opacity-30' : ''}`}
    >
      <div className="inline-flex flex-wrap items-center gap-2.5">
        <Badge type="question-label" theme="orange-100" content={`${idx}번 질문`} />
        <span className="title-m-semibold">{qnaData.questionText}</span>
      </div>
      <Border />
      <p className="body-m-regular">{qnaData.answerText}</p>
      <div className="flex items-center justify-between">
        {hasHighlight && <span className="body-s-regular text-orange-500">자기소개서 연결됨</span>}
        <div className="ml-auto flex gap-2">{renderActionButtons()}</div>
      </div>
      {isPreviewOpen && hasHighlight && (
        <div className="rounded-lg bg-gray-100 p-3">
          <p className="body-s-medium mb-1 text-gray-400">연결된 자기소개서 내용</p>
          <p className="body-s-regular line-clamp-5 whitespace-pre-line text-gray-600">{highlight.text}</p>
        </div>
      )}
    </div>
  )
}
