import { useState } from 'react'
import { useCreateQnaSet } from '@/apis/generated/interview-api/interview-api'
import { useDeleteQnaSet, useUpdateQnaSet } from '@/apis/generated/qna-set-api/qna-set-api'
import type { SimpleQnaType } from '@/types/interview'

type UseQnaListOptions = {
  interviewId: number
  onEdit?: (qnaSetId: number, question: string, answer: string) => void
  onDelete?: (qnaSetId: number) => void
  onAdd?: (question: string, answer: string) => void
}

export function useQnaList(initialList: SimpleQnaType[], options: UseQnaListOptions) {
  const [qnaList, setQnaList] = useState<SimpleQnaType[]>(initialList)
  const [isAddMode, setIsAddMode] = useState(false)
  const { mutate: updateQnaSet } = useUpdateQnaSet()
  const { mutate: createQnaSet } = useCreateQnaSet()
  const { mutate: deleteQnaSet } = useDeleteQnaSet()

  const handleEdit = (qnaSetId: number, question: string, answer: string) => {
    setQnaList((prev) =>
      prev.map((item) => (item.qnaSetId === qnaSetId ? { ...item, questionText: question, answerText: answer } : item)),
    )
    updateQnaSet({ qnaSetId, data: { questionText: question, answerText: answer } })
    options.onEdit?.(qnaSetId, question, answer)
  }

  const handleDelete = (qnaSetId: number) => {
    const prevList = qnaList
    setQnaList((prev) => prev.filter((item) => item.qnaSetId !== qnaSetId))
    deleteQnaSet(
      { qnaSetId },
      {
        onError: () => {
          setQnaList(prevList)
        },
      },
    )
    options.onDelete?.(qnaSetId)
  }

  const handleAddSave = (question: string, answer: string) => {
    createQnaSet(
      { interviewId: options.interviewId, data: { questionText: question, answerText: answer } },
      {
        onSuccess: (res) => {
          setQnaList((prev) => {
            const fallbackId = prev.length > 0 ? Math.max(...prev.map((item) => item.qnaSetId)) + 1 : 1
            const qnaSetId = res.result?.qnaSetId ?? fallbackId
            return [...prev, { qnaSetId, questionText: question, answerText: answer }]
          })
        },
      },
    )
    setIsAddMode(false)
    options.onAdd?.(question, answer)
  }

  const startAddMode = () => setIsAddMode(true)
  const cancelAddMode = () => setIsAddMode(false)

  return { qnaList, isAddMode, handleEdit, handleDelete, handleAddSave, startAddMode, cancelAddMode }
}
