import { useState } from 'react'
import { HardQuestionToggle, QnaSetDropdownMenu, QnaSetEditForm } from '@/features/confirm-record/components/contents'
import type { QnAType } from '@/features/confirm-record/components/contents'
import Badge from '@/shared/Badge'
import { Border } from '@/shared/sidebar/Border'

type QnaSetContainerProps = {
  qnaData: QnAType
  idx: number
  onEdit?: (qnaSetId: number, question: string, answer: string) => void
  onDelete?: (qnaSetId: number) => void
}

export const QnaSetContainer = ({ qnaData, idx, onEdit, onDelete }: QnaSetContainerProps) => {
  const [editMode, setEditMode] = useState(false)

  const handleSave = (question: string, answer: string) => {
    setEditMode(false)
    onEdit?.(qnaData.qnaSetId, question, answer)
  }
  const handleEdit = () => {
    setEditMode(true)
  }
  const handleDelete = () => {
    onDelete?.(qnaData.qnaSetId)
  }

  if (editMode) {
    return (
      <QnaSetEditForm
        idx={idx}
        initialQuestion={qnaData.questionText}
        initialAnswer={qnaData.answerText}
        onSave={handleSave}
        onCancel={() => setEditMode(false)}
      />
    )
  }

  return (
    <div className="bg-gray-white relative flex flex-col gap-4 rounded-lg p-5">
      <div className="inline-flex flex-wrap items-center gap-2.5">
        <Badge type="question-label" theme="orange-100" content={`${idx}번 질문`} />
        <span className="title-m-semibold">{qnaData.questionText}</span>
        <HardQuestionToggle id={qnaData.qnaSetId} />
        <QnaSetDropdownMenu onEdit={handleEdit} onDelete={handleDelete} />
      </div>
      <Border />
      <div>{qnaData.answerText}</div>
    </div>
  )
}
