import { useState } from 'react'
import Button from '@/shared/Button'
import { FadeScrollArea } from '@/shared/components/FadeScrollArea'
import { CirclePlusIcon } from '@/assets'
import { QnaSetContainer, QnaSetEditForm } from '@/features/confirm-record/components/contents'

export type QnAType = {
  qnaSetId: number
  questionText: string
  answerText: string
}

export function QnaListSection() {
  const [qnaList, setQnaList] = useState<QnAType[]>(initialQnaList)
  const [addMode, setAddMode] = useState(false)

  // TODO: 훅 분리 예정 / 임시 구현
  const handleEdit = (qnaSetId: number, question: string, answer: string) => {
    setQnaList((list) =>
      list.map((q) => (q.qnaSetId === qnaSetId ? { ...q, questionText: question, answerText: answer } : q)),
    )
  }
  const handleDelete = (qnaSetId: number) => {
    setQnaList((list) => list.filter((q) => q.qnaSetId !== qnaSetId))
  }
  const handleAddSave = (question: string, answer: string) => {
    setQnaList((list) => {
      // TODO: API 연동하면서 임시 ID 생성 로직 제거
      const newId = list.length > 0 ? Math.max(...list.map((q) => q.qnaSetId)) + 1 : 1
      return [...list, { qnaSetId: newId, questionText: question, answerText: answer }]
    })
    setAddMode(false)
  }

  return (
    <FadeScrollArea className="-mr-4 space-y-3 pr-4">
      {qnaList.map((qnaData, idx) => (
        <QnaSetContainer
          key={qnaData.qnaSetId}
          qnaData={qnaData}
          idx={idx + 1}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
      {addMode ? (
        <QnaSetEditForm idx={qnaList.length + 1} onSave={handleAddSave} onCancel={() => setAddMode(false)} />
      ) : (
        <div className="flex justify-center">
          <Button variant="outline-orange-100" size="md" radius="full" onClick={() => setAddMode(true)}>
            <CirclePlusIcon className="text-orange-500" />
            질문 추가하기
          </Button>
        </div>
      )}
    </FadeScrollArea>
  )
}

const initialQnaList: QnAType[] = [
  {
    qnaSetId: 1,
    questionText: '짧은 질문입니다.',
    answerText:
      '답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. ',
  },
  {
    qnaSetId: 2,
    questionText: '질문의 길이가 길어 줄을 넘어 두 줄까지 내려가는 경우에는 다음과 같은 형태로 배열됩니다.',
    answerText:
      '답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다.',
  },
  {
    qnaSetId: 3,
    questionText: '질문의 길이가 길어 한 줄을 끝까지 채우는 경우에는 이렇게 배열됩니다.',
    answerText:
      '답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다.',
  },
  {
    qnaSetId: 4,
    questionText: '질문의 길이가 길어 한 줄을 끝까지 채우는 경우에는 이렇게 배열됩니다.',
    answerText:
      '답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다.',
  },
]
