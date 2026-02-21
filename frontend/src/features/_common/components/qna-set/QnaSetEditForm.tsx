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

const MAX_QUESTION_LENGTH = 200
const MAX_ANSWER_LENGTH = 10000

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
  const isQuestionEmpty = question.trim() === ''
  const isSaveDisabled = isSaving || isQuestionEmpty
  const handleSave = () => {
    if (isSaveDisabled) return
    onSave(question, answer)
  }

  return (
    <div className="bg-gray-white relative flex flex-col gap-4 rounded-lg p-5">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <Badge type="question-label" theme={badgeTheme} content={questionLabel} />
        <div className="flex gap-2">
          <Button size="xs" variant="outline-gray-100" onClick={onCancel} disabled={isSaving}>
            취소
          </Button>
          <Button
            size="xs"
            variant="outline-orange-100"
            onClick={handleSave}
            isLoading={isSaving}
            disabled={isSaveDisabled}
          >
            저장
          </Button>
        </div>
      </div>
      <div className="relative">
        <input
          className="title-s-medium outline-gray-150 w-full rounded-lg py-1 pr-17 pl-2.5 outline-1"
          value={question}
          maxLength={MAX_QUESTION_LENGTH}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="질문을 작성해주세요."
          disabled={isSaving}
        />
        <span className="body-s-regular pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-300">
          {question.length}/{MAX_QUESTION_LENGTH}
        </span>
      </div>
      <div className="relative">
        <textarea
          className="body-m-regular outline-gray-150 min-h-40 w-full resize-none rounded-[10px] p-4 outline-1"
          value={answer}
          maxLength={MAX_ANSWER_LENGTH}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="답변을 작성해주세요."
          disabled={isSaving}
        />
        <span className="body-s-regular bg-gray-white/80 pointer-events-none absolute right-3 bottom-4 rounded px-2 text-gray-300">
          {answer.length}/{MAX_ANSWER_LENGTH}
        </span>
      </div>
      {children}
    </div>
  )
}
