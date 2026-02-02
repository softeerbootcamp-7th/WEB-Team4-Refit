import { useState } from 'react'
import { Badge, Button, Border } from '@/shared/components'

interface QnaSetEditFormProps {
  idx: number
  initialQuestion?: string
  initialAnswer?: string
  onSave: (question: string, answer: string) => void
  onCancel: () => void
}

// TODO: 최소/최대 글자 수 제한 추가
export function QnaSetEditForm({
  idx,
  initialQuestion = '',
  initialAnswer = '',
  onSave,
  onCancel,
}: QnaSetEditFormProps) {
  const [question, setQuestion] = useState(initialQuestion)
  const [answer, setAnswer] = useState(initialAnswer)

  return (
    <div className="bg-gray-white relative flex flex-col gap-4 rounded-lg p-5">
      <div className="inline-flex flex-wrap items-center gap-2.5">
        <Badge type="question-label" theme="orange-100" content={`${idx}번 질문`} />
        <input
          className="title-m-semibold focus-visible:outline-gray-150 flex-1 rounded-lg bg-gray-100 px-2.5 py-1 focus:outline-1"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="질문을 작성해주세요."
        />
      </div>
      <Border />
      <textarea
        className="body-m-regular focus-visible:outline-gray-150 min-h-40 resize-none rounded-[10px] bg-gray-100 p-4 focus-visible:outline-1"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="답변을 작성해주세요."
      />
      <div className="flex justify-end gap-2">
        <Button size="xs" variant="outline-gray-100" onClick={onCancel}>
          취소
        </Button>
        <Button size="xs" variant="outline-orange-100" onClick={() => onSave(question, answer)}>
          저장
        </Button>
      </div>
    </div>
  )
}
