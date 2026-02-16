import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useDeleteInterview } from '@/apis/generated/interview-api/interview-api'

export function useDraftDelete(onDeleteSuccess: (id: number) => void) {
  const queryClient = useQueryClient()
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null)

  const { mutate: deleteInterview, isPending: isDeleting } = useDeleteInterview({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: ['/interview/my/draft'] })
        void queryClient.invalidateQueries({ queryKey: ['my-interviews', 'interview-list'] })
      },
    },
  })

  const handleConfirmDelete = () => {
    if (pendingDeleteId === null) return
    deleteInterview(
      { interviewId: pendingDeleteId },
      {
        onSuccess: () => {
          onDeleteSuccess(pendingDeleteId)
          setPendingDeleteId(null)
        },
      },
    )
  }

  return {
    pendingDeleteId,
    setPendingDeleteId,
    isDeleting,
    handleConfirmDelete,
  }
}
