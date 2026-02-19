import { useState } from 'react'
import { Badge, Button } from '@/designs/components'

type QnaSetEditFormProps = {
  idx: number
  badgeTheme?: 'orange-100' | 'gray-100'
  initialQuestion?: string
  initialAnswer?: string
  onSave: (question: string, answer: string) => void
  onCancel: () => void
  isSaving?: boolean
  children?: React.ReactNode
}

export function QnaSetEditForm({
  idx,
  badgeTheme = 'orange-100',
  initialQuestion = '',
  initialAnswer = '',
  onSave,
  onCancel,
  isSaving = false,
  children,
}: QnaSetEditFormProps) {
  const [question, setQuestion] = useState(initialQuestion)
  const [answer, setAnswer] = useState(initialAnswer)

  const questionLabel = `${idx}번 질문`

  return (
    <div className="bg-gray-white relative flex flex-col gap-4 rounded-lg p-5">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <Badge type="question-label" theme={badgeTheme} content={questionLabel} />
        <div className="flex gap-2">
          <Button size="xs" variant="outline-gray-100" onClick={onCancel} disabled={isSaving}>
            취소
          </Button>
          <Button size="xs" variant="outline-orange-100" onClick={() => onSave(question, answer)} isLoading={isSaving}>
            저장
          </Button>
        </div>
      </div>
      <input
        className="title-s-medium outline-gray-150 flex-1 rounded-lg px-2.5 py-1 outline-1"
        value={question}
        maxLength={200}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="질문을 작성해주세요."
        disabled={isSaving}
      />
      <textarea
        className="body-m-regular outline-gray-150 min-h-40 resize-none rounded-[10px] p-4 outline-1"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="답변을 작성해주세요."
        disabled={isSaving}
      />
      {children}
    </div>
  )
}
