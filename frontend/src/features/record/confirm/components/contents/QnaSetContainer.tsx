import { useState, type Ref } from 'react'
import { QnaSetCard, QnaSetEditForm } from '@/features/_common/components/qna-set'
import { PencilIcon, TrashIcon } from '@/shared/assets'
import type { SimpleQnaType } from '@/types/interview'

type QnaSetContainerProps = {
  ref?: Ref<HTMLDivElement>
  qnaData: SimpleQnaType
  idx: number
  isOtherEditing?: boolean
  onEdit?: (qnaSetId: number, question: string, answer: string) => void
  onDelete?: (qnaSetId: number) => void
  onEditingIdChange?: (editingId: string | null) => void
}

export function QnaSetContainer({
  ref,
  qnaData,
  idx,
  isOtherEditing,
  onEdit,
  onDelete,
  onEditingIdChange,
}: QnaSetContainerProps) {
  const { qnaSetId, questionText, answerText } = qnaData
  const [isEditing, setIsEditing] = useState(false)

  const editingKey = `qna-${qnaSetId}`

  const startEditing = () => {
    setIsEditing(true)
    onEditingIdChange?.(editingKey)
  }

  const stopEditing = () => {
    setIsEditing(false)
    onEditingIdChange?.(null)
  }

  const handleSave = (question: string, answer: string) => {
    stopEditing()
    onEdit?.(qnaSetId, question, answer)
  }

  const handleDelete = () => {
    onDelete?.(qnaSetId)
  }

  const containerClassName = `transition-opacity ${isOtherEditing ? 'pointer-events-none opacity-30' : ''}`
  const cardClassName = `relative rounded-lg transition-shadow ${isEditing ? 'border border-gray-300 shadow-md' : ''}`

  return (
    <div ref={ref} className={containerClassName}>
      <div className={cardClassName}>
        {isEditing ? (
          <QnaSetEditForm
            idx={idx}
            initialQuestion={questionText}
            initialAnswer={answerText}
            onSave={handleSave}
            onCancel={stopEditing}
          />
        ) : (
          <QnaSetCard
            idx={idx}
            questionText={questionText}
            answerText={answerText}
            topRightComponent={
              <div className="flex shrink-0 gap-4 pl-4">
                <button onClick={startEditing}>
                  <PencilIcon />
                </button>
                <button onClick={handleDelete}>
                  <TrashIcon />
                </button>
              </div>
            }
          />
        )}
      </div>
    </div>
  )
}
