import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getGetInterviewFullQueryKey, useCreateQnaSet } from '@/apis/generated/interview-api/interview-api'
import { useDeletePdfHighlighting, useDeleteQnaSet, useUpdateQnaSet } from '@/apis/generated/qna-set-api/qna-set-api'
import { getApiErrorCode } from '@/features/_common/utils/error'

const ERROR_MESSAGES = {
  EDIT: '질문/답변 저장에 실패했습니다. 잠시 후 다시 시도해주세요.',
  DELETE: '질문 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.',
  ADD: '질문 추가에 실패했습니다. 잠시 후 다시 시도해주세요.',
} as const

type UseQnaListOptions = {
  interviewId: number
}

const QNA_DELETE_FAILED_PDF_HIGHLIGHTING_EXISTS = 'QNA_DELETE_FAILED_PDF_HIGHLIGHTING_EXISTS'

export function useQnaList(options: UseQnaListOptions) {
  const queryClient = useQueryClient()
  const [isAddMode, setIsAddMode] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [deleteConfirmQnaSetId, setDeleteConfirmQnaSetId] = useState<number | null>(null)
  const { mutateAsync: updateQnaSet, isPending: isEditing } = useUpdateQnaSet()
  const { mutateAsync: createQnaSet, isPending: isCreating } = useCreateQnaSet()
  const { mutateAsync: deleteQnaSet, isPending: isDeletingQnaSet } = useDeleteQnaSet()
  const { mutateAsync: deletePdfHighlighting, isPending: isDeletingPdfHighlighting } = useDeletePdfHighlighting()

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
    if (isDeletingQnaSet || isDeletingPdfHighlighting) return
    setActionError(null)
    try {
      await deleteQnaSet({ qnaSetId })
      void invalidateInterviewFull()
    } catch (error) {
      if (getApiErrorCode(error) === QNA_DELETE_FAILED_PDF_HIGHLIGHTING_EXISTS) {
        setDeleteConfirmQnaSetId(qnaSetId)
        return
      }
      setActionError(ERROR_MESSAGES.DELETE)
    }
  }

  const cancelDeleteWithHighlight = () => setDeleteConfirmQnaSetId(null)

  const confirmDeleteWithHighlight = async () => {
    if (deleteConfirmQnaSetId === null) return
    if (isDeletingQnaSet || isDeletingPdfHighlighting) return

    setActionError(null)
    try {
      await deletePdfHighlighting({ qnaSetId: deleteConfirmQnaSetId })
      await deleteQnaSet({ qnaSetId: deleteConfirmQnaSetId })
      setDeleteConfirmQnaSetId(null)
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
    isDeleting: isDeletingQnaSet || isDeletingPdfHighlighting,
    actionError,
    isDeleteWithHighlightConfirmOpen: deleteConfirmQnaSetId !== null,
    isDeleteWithHighlightConfirmPending: isDeletingQnaSet || isDeletingPdfHighlighting,
    handleEdit,
    handleDelete,
    cancelDeleteWithHighlight,
    confirmDeleteWithHighlight,
    handleAddSave,
    startAddMode,
    cancelAddMode,
  }
}
