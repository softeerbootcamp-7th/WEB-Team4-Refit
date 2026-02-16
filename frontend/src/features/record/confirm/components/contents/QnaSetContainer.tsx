import { useState, type Ref } from 'react'
import { PencilIcon, TrashIcon } from '@/designs/assets'
import ConfirmModal from '@/designs/components/modal/ConfirmModal'
import { QnaSetCard, QnaSetEditForm } from '@/features/_common/components/qna-set'
import type { SimpleQnaType } from '@/types/interview'

type QnaSetContainerProps = {
  ref?: Ref<HTMLDivElement>
  qnaData: SimpleQnaType
  idx: number
  isOtherEditing?: boolean
  isDeleting?: boolean
  onEdit?: (qnaSetId: number, question: string, answer: string) => void
  onDelete?: (qnaSetId: number) => void
  onEditingIdChange?: (editingId: string | null) => void
}

export function QnaSetContainer({
  ref,
  qnaData,
  idx,
  isOtherEditing,
  isDeleting = false,
  onEdit,
  onDelete,
  onEditingIdChange,
}: QnaSetContainerProps) {
  const { qnaSetId, questionText, answerText } = qnaData
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)

  const editingKey = `qna-${qnaSetId}`

  const startEditing = () => {
    setIsEditing(true)
    onEditingIdChange?.(editingKey)
  }

  const stopEditing = () => {
    setIsEditing(false)
    onEditingIdChange?.(null)
  }

  const handleSave = async (question: string, answer: string) => {
    try {
      await onEdit?.(qnaSetId, question, answer)
      stopEditing()
    } catch {
      // 에러 처리
    }
  }

  const handleDelete = () => {
    if (isDeleting) return
    setIsDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (isDeleting) return
    try {
      await onDelete?.(qnaSetId)
      setIsDeleteConfirmOpen(false)
    } catch {
      // 에러 처리
    }
  }

  const containerClassName = `transition-opacity ${isOtherEditing || isDeleting ? 'pointer-events-none opacity-30' : ''}`
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
      <ConfirmModal
        open={isDeleteConfirmOpen}
        onClose={() => {
          if (isDeleting) return
          setIsDeleteConfirmOpen(false)
        }}
        hasCancelButton={true}
        cancelText="취소"
        title={`질문을 정말\n삭제하시겠어요?`}
        okText="삭제하기"
        okButtonVariant="fill-gray-800"
        // TODO: 속성 추가되면 추가
        //okButtonLoading={isDeleting}
        onOk={handleConfirmDelete}
      />
    </div>
  )
}
