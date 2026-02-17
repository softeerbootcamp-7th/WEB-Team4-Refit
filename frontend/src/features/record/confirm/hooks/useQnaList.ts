import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getGetInterviewFullQueryKey, useCreateQnaSet } from '@/apis/generated/interview-api/interview-api'
import { useDeleteQnaSet, useUpdateQnaSet } from '@/apis/generated/qna-set-api/qna-set-api'

const ERROR_MESSAGES = {
  EDIT: '질문/답변 저장에 실패했습니다. 잠시 후 다시 시도해주세요.',
  DELETE: '질문 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.',
  ADD: '질문 추가에 실패했습니다. 잠시 후 다시 시도해주세요.',
} as const

type UseQnaListOptions = {
  interviewId: number
}

export function useQnaList(options: UseQnaListOptions) {
  const queryClient = useQueryClient()
  const [isAddMode, setIsAddMode] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const { mutateAsync: updateQnaSet, isPending: isEditing } = useUpdateQnaSet()
  const { mutateAsync: createQnaSet, isPending: isCreating } = useCreateQnaSet()
  const { mutateAsync: deleteQnaSet, isPending: isDeleting } = useDeleteQnaSet()

  const invalidateInterviewFull = () =>
    queryClient.invalidateQueries({
      queryKey: getGetInterviewFullQueryKey(options.interviewId),
    })

  const handleEdit = async (qnaSetId: number, question: string, answer: string) => {
    setActionError(null)
    try {
      await updateQnaSet({ qnaSetId, data: { questionText: question, answerText: answer } })
      void invalidateInterviewFull()
    } catch {
      setActionError(ERROR_MESSAGES.EDIT)
    }
  }

  const handleDelete = async (qnaSetId: number) => {
    if (isDeleting) return
    setActionError(null)
    try {
      await deleteQnaSet({ qnaSetId })
      void invalidateInterviewFull()
    } catch {
      setActionError(ERROR_MESSAGES.DELETE)
    }
  }

  const handleAddSave = async (question: string, answer: string) => {
    setActionError(null)
    try {
      await createQnaSet({ interviewId: options.interviewId, data: { questionText: question, answerText: answer } })
      setIsAddMode(false)
      void invalidateInterviewFull()
    } catch {
      setActionError(ERROR_MESSAGES.ADD)
    }
  }

  const startAddMode = () => setIsAddMode(true)
  const cancelAddMode = () => {
    if (isCreating) return
    setIsAddMode(false)
  }

  return {
    isAddMode,
    isCreating,
    isEditing,
    isDeleting,
    actionError,
    handleEdit,
    handleDelete,
    handleAddSave,
    startAddMode,
    cancelAddMode,
  }
}
