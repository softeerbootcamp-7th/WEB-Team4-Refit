import { useRef, useState, type Ref } from 'react'
import { QnaSetCard, QnaSetEditForm, StarAnalysisSection } from '@/features/_common/components/qnaSet'
import { RetroWriteCard } from '@/features/retro/_common/components/RetroWriteCard'
import { BookmarkIcon, MoreIcon } from '@/shared/assets'
import { Border, Button } from '@/shared/components'
import { useOnClickOutside } from '@/shared/hooks/useOnClickOutside'
import type { QnaSetType } from '@/types/interview'

type QnaRetroCardProps = {
  ref?: Ref<HTMLDivElement>
  idx: number
  qnaSet: QnaSetType
  isOtherEditing?: boolean
  onEditingIdChange?: (editingId: string | null) => void
}

export function QnaRetroCard({ ref, idx, qnaSet, isOtherEditing, onEditingIdChange }: QnaRetroCardProps) {
  const { qnaSetId, questionText, answerText, qnaSetSelfReviewText, starAnalysis } = qnaSet

  const [isEditing, setIsEditing] = useState(false)

  const [editedQuestion, setEditedQuestion] = useState(questionText)
  const [editedAnswer, setEditedAnswer] = useState(answerText)
  const [editedRetro, setEditedRetro] = useState(qnaSetSelfReviewText)

  const hasStarAnalysis = !!starAnalysis

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(menuRef, () => setIsMenuOpen(false))

  const editingKey = `edit-${qnaSetId}`

  const startEditing = () => {
    setIsEditing(true)
    setIsMenuOpen(false)
    onEditingIdChange?.(editingKey)
  }

  const stopEditing = () => {
    setIsEditing(false)
    onEditingIdChange?.(null)
  }

  const handleSave = (question: string, answer: string) => {
    setEditedQuestion(question)
    setEditedAnswer(answer)
    // editedRetro는 onChange로 이미 업데이트됨
    // TODO: API 호출 (question, answer, editedRetro 한꺼번에 전송)
    stopEditing()
  }

  const handleCancel = () => {
    setEditedRetro(qnaSetSelfReviewText)
    stopEditing()
  }

  const handleDelete = () => {
    setIsMenuOpen(false)
    console.log('삭제 요청', qnaSetId)
  }

  const handleScrap = () => {
    console.log('스크랩', qnaSetId)
  }

  const handleAnalyze = () => {
    console.log('STAR 분석 요청', qnaSetId)
  }

  const containerClassName = `transition-opacity ${isOtherEditing ? 'pointer-events-none opacity-30' : ''}`
  const cardClassName = `relative rounded-lg transition-shadow ${isEditing ? 'border border-gray-300 shadow-md' : ''}`

  return (
    <div ref={ref} className={containerClassName}>
      <div className={cardClassName}>
        {!isEditing && (
          <div className="absolute top-6 right-4 z-10 flex items-center gap-2">
            <button onClick={handleScrap} className="text-gray-400 hover:text-orange-500">
              <BookmarkIcon className="h-5 w-5" />
            </button>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-200 hover:text-gray-600"
              >
                <MoreIcon className="h-7 w-7" />
              </button>
              {isMenuOpen && (
                <div className="absolute top-full right-0 z-10 mt-1 min-w-30 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg ring-1 ring-black/5">
                  <button
                    onClick={startEditing}
                    className="body-s-medium w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50"
                  >
                    수정하기
                  </button>
                  <button
                    onClick={handleDelete}
                    className="body-s-medium w-full px-4 py-2.5 text-left text-red-500 hover:bg-red-50"
                  >
                    삭제하기
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        {isEditing && hasStarAnalysis ? (
          <QnaSetCard
            idx={idx}
            questionText={editedQuestion}
            answerText={editedAnswer}
            badgeTheme="gray-100"
            topRightComponent={
              <div className="flex gap-2">
                <Button size="xs" variant="outline-gray-100" onClick={handleCancel}>
                  취소
                </Button>
                <Button size="xs" variant="outline-orange-100" onClick={() => handleSave(editedQuestion, editedAnswer)}>
                  저장
                </Button>
              </div>
            }
          >
            <StarAnalysisSection starAnalysis={starAnalysis} onAnalyze={handleAnalyze} />
            <Border />
            <RetroWriteCard idx={idx} value={editedRetro} onChange={setEditedRetro} />
          </QnaSetCard>
        ) : isEditing ? (
          <QnaSetEditForm
            idx={idx}
            badgeTheme="gray-100"
            initialQuestion={editedQuestion}
            initialAnswer={editedAnswer}
            onSave={handleSave}
            onCancel={handleCancel}
          >
            <Border />
            <RetroWriteCard idx={idx} value={editedRetro} onChange={setEditedRetro} />
          </QnaSetEditForm>
        ) : (
          <QnaSetCard idx={idx} questionText={editedQuestion} answerText={editedAnswer} badgeTheme="gray-100">
            <StarAnalysisSection starAnalysis={starAnalysis} onAnalyze={handleAnalyze} />
            {editedRetro && (
              <>
                <Border />
                <RetroWriteCard idx={idx} value={editedRetro} />
              </>
            )}
          </QnaSetCard>
        )}
      </div>
    </div>
  )
}
