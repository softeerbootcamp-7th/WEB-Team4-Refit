import { useState } from 'react'
import { useUpdateQnaSet } from '@/apis/generated/qna-set-api/qna-set-api'
import type { SimpleQnaType } from '@/types/interview'

type UseQnaListOptions = {
  onEdit?: (qnaSetId: number, question: string, answer: string) => void
  onDelete?: (qnaSetId: number) => void
  onAdd?: (question: string, answer: string) => void
}

export function useQnaList(initialList: SimpleQnaType[], options: UseQnaListOptions = {}) {
  const [qnaList, setQnaList] = useState<SimpleQnaType[]>(initialList)
  const [isAddMode, setIsAddMode] = useState(false)
  const { mutate: updateQnaSet } = useUpdateQnaSet()

  const handleEdit = (qnaSetId: number, question: string, answer: string) => {
    setQnaList((prev) =>
      prev.map((item) => (item.qnaSetId === qnaSetId ? { ...item, questionText: question, answerText: answer } : item)),
    )
    updateQnaSet({ qnaSetId, data: { questionText: question, answerText: answer } })
    options.onEdit?.(qnaSetId, question, answer)
  }

  const handleDelete = (qnaSetId: number) => {
    setQnaList((prev) => prev.filter((item) => item.qnaSetId !== qnaSetId))
    options.onDelete?.(qnaSetId)
  }

  const handleAddSave = (question: string, answer: string) => {
    setQnaList((prev) => {
      // TODO: API 연동 시 서버 응답의 ID로 교체
      const nextId = prev.length > 0 ? Math.max(...prev.map((item) => item.qnaSetId)) + 1 : 1
      return [...prev, { qnaSetId: nextId, questionText: question, answerText: answer }]
    })
    setIsAddMode(false)
    options.onAdd?.(question, answer)
  }

  const startAddMode = () => setIsAddMode(true)
  const cancelAddMode = () => setIsAddMode(false)

  return { qnaList, isAddMode, handleEdit, handleDelete, handleAddSave, startAddMode, cancelAddMode }
}
