import { useState, type Ref } from 'react'
import { QnaSetEditForm } from '@/pages/record/_confirm/components/contents/QnaSetEditForm'
import { QnaSetCard } from '@/pages/retro/_index/components/retro-section/QnaSetCard'
import { RetroWriteCard } from '@/pages/retro/_index/components/retro-section/RetroWriteCard'
import { Button } from '@/shared/components'
import type { QnaSetType } from '@/types/interview'

type QnaRetroCardProps = {
  ref?: Ref<HTMLDivElement>
  idx: number
  qnaSet: QnaSetType
  isOtherEditing?: boolean
  onEditingIdChange?: (editingId: string | null) => void
}

export function QnaRetroCard({ ref, idx, qnaSet, isOtherEditing, onEditingIdChange }: QnaRetroCardProps) {
  const { questionText, answerText, qnaSetSelfReviewText, starAnalysis } = qnaSet

  const [editingMode, setEditingMode] = useState<'qna' | 'retro' | null>(null)
  const isEditingQna = editingMode === 'qna'
  const isEditingRetro = editingMode === 'retro'

  const [editedQuestion, setEditedQuestion] = useState(questionText)
  const [editedAnswer, setEditedAnswer] = useState(answerText)
  const [editedRetro, setEditedRetro] = useState(qnaSetSelfReviewText)

  const noStarAnalysis = !starAnalysis

  const startEditing = (mode: 'qna' | 'retro') => {
    setEditingMode(mode)
    onEditingIdChange?.(`${mode}-${qnaSet.qnaSetId}`)
  }

  const stopEditing = () => {
    setEditingMode(null)
    onEditingIdChange?.(null)
  }

  const handleSaveQna = (question: string, answer: string) => {
    setEditedQuestion(question)
    setEditedAnswer(answer)
    stopEditing()
  }

  const handleAnalyze = () => {
    console.log('STAR 분석 요청', qnaSet.qnaSetId)
  }

  return (
    <div
      ref={ref}
      className={`flex flex-col gap-5 transition-opacity ${isOtherEditing ? 'pointer-events-none opacity-30' : ''}`}
    >
      <div
        className={`relative rounded-lg transition-shadow ${isEditingQna ? 'border border-gray-300 shadow-md' : ''}`}
      >
        {!isEditingQna && !isEditingRetro && (
          <div className="absolute top-6 right-4 z-10 flex gap-1">
            {noStarAnalysis && (
              <Button size="xs" variant="fill-gray-150" onClick={() => startEditing('qna')}>
                수정
              </Button>
            )}
            <Button size="xs" variant="fill-orange-100" onClick={() => console.log('스크랩 모달')}>
              스크랩
            </Button>
          </div>
        )}
        {isEditingQna ? (
          <QnaSetEditForm
            idx={idx}
            initialQuestion={editedQuestion}
            initialAnswer={editedAnswer}
            onSave={handleSaveQna}
            onCancel={stopEditing}
          />
        ) : (
          <QnaSetCard
            idx={idx}
            questionText={editedQuestion}
            answerText={editedAnswer}
            starAnalysis={starAnalysis}
            onAnalyze={handleAnalyze}
          />
        )}
      </div>

      <div
        className={`relative rounded-lg transition-shadow ${isEditingRetro ? 'border border-gray-300 shadow-md' : ''}`}
      >
        <div className="absolute top-6 right-4 z-10 flex gap-2">
          {!isEditingQna && !isEditingRetro && (
            <Button size="xs" variant="fill-gray-150" onClick={() => startEditing('retro')}>
              수정
            </Button>
          )}
          {isEditingRetro && (
            <>
              <Button size="xs" variant="outline-gray-100" onClick={stopEditing}>
                취소
              </Button>
              <Button size="xs" variant="outline-orange-100" onClick={stopEditing}>
                저장
              </Button>
            </>
          )}
        </div>
        <RetroWriteCard idx={idx} value={editedRetro} onChange={isEditingRetro ? setEditedRetro : undefined} />
      </div>
    </div>
  )
}
