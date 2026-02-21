import { useEffect, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPortal } from 'react-dom'
import {
  deleteInterview as deleteInterviewApi,
  getGetDashboardCalendarInterviewsQueryKey,
  getGetDashboardHeadlineQueryKey,
  getGetDebriefIncompletedInterviewsQueryKey,
  getGetUpcomingInterviewsQueryKey,
} from '@/apis'
import type { InterviewDto } from '@/apis'
import { INTERVIEW_REVIEW_STATUS_LABEL } from '@/constants/interviewReviewStatus'
import { INTERVIEW_TYPE_LABEL } from '@/constants/interviews'
import { MoreIcon, SmallLogoIcon } from '@/designs/assets'
import { Badge } from '@/designs/components'
import ConfirmModal from '@/designs/components/modal/ConfirmModal'
import { useMenuPosition } from '@/features/_common/hooks/useMenuPosition'
import { useOnClickOutside } from '@/features/_common/hooks/useOnClickOutside'
import { formatDateTime } from '@/features/_common/utils/date'
import { CalendarInterviewMenu } from './CalendarInterviewMenu'

interface CalendarInterviewCardProps {
  interview: InterviewDto
  onItemClick: (interview: InterviewDto) => void
}

export function CalendarInterviewCard({ interview, onItemClick }: CalendarInterviewCardProps) {
  const interviewTypeLabel =
    INTERVIEW_TYPE_LABEL[interview.interviewType as keyof typeof INTERVIEW_TYPE_LABEL] ?? interview.interviewType
  const interviewReviewStatusLabel = INTERVIEW_REVIEW_STATUS_LABEL[interview.interviewReviewStatus] ?? '기록 전'

  const queryClient = useQueryClient()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const deleteAbortControllerRef = useRef<AbortController | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const { menuPosition, setMenuPosition } = useMenuPosition({
    isOpen: isMenuOpen,
    triggerRef,
    menuRef,
  })
  const cancelDeleteRequest = () => {
    deleteAbortControllerRef.current?.abort()
    deleteAbortControllerRef.current = null
  }
  const { mutate: deleteInterview, isPending: isDeletingInterview } = useMutation({
    mutationFn: ({ interviewId, signal }: { interviewId: number; signal: AbortSignal }) =>
      deleteInterviewApi(interviewId, { signal }),
    onSuccess: () => {
      setIsDeleteConfirmOpen(false)
      void queryClient.invalidateQueries({ queryKey: getGetDashboardCalendarInterviewsQueryKey() })
      void queryClient.invalidateQueries({ queryKey: getGetDashboardHeadlineQueryKey() })
      void queryClient.invalidateQueries({ queryKey: getGetDebriefIncompletedInterviewsQueryKey() })
      void queryClient.invalidateQueries({ queryKey: getGetUpcomingInterviewsQueryKey() })
    },
    onSettled: () => {
      deleteAbortControllerRef.current = null
    },
  })

  useEffect(() => {
    return () => {
      cancelDeleteRequest()
    }
  }, [])

  useOnClickOutside(
    menuRef,
    (event) => {
      const target = event.target as Node
      if (triggerRef.current?.contains(target)) return
      setIsMenuOpen(false)
    },
    isMenuOpen,
  )

  return (
    <li>
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => {
          const target = e.target as Element
          if (target.closest('[data-more-trigger="true"]')) return
          onItemClick(interview)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onItemClick(interview)
          }
        }}
        className="w-full cursor-pointer rounded-lg bg-white p-4 text-left hover:bg-gray-50"
      >
        <div className="mb-1 flex items-center justify-between gap-1.5">
          <div className="mb-2.5 flex min-w-0 items-center gap-2">
            <Badge content={interviewReviewStatusLabel} type="question-label" theme="gray-100" />
            <p className="body-s-medium truncate text-gray-500">{formatDateTime(interview.interviewStartAt)}</p>
          </div>
          <div className="relative shrink-0" data-more-trigger="true">
            <button
              ref={triggerRef}
              type="button"
              data-more-trigger="true"
              onClick={(e) => {
                e.stopPropagation()
                setMenuPosition(null)
                setIsMenuOpen((prev) => !prev)
              }}
              className="flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-200 hover:text-gray-600"
            >
              <MoreIcon className="h-7 w-7" />
            </button>
          </div>
        </div>

        <div className="mb-2 flex items-center gap-1.5">
          <div className="border-gray-150 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border bg-white">
            {interview.companyLogoUrl ? (
              <img src={interview.companyLogoUrl} alt={interview.companyName} className="h-full w-full rounded-full object-contain" />
            ) : (
              <SmallLogoIcon className="h-3.5 w-3.5 text-gray-400" />
            )}
          </div>
          <p className="body-l-bold truncate text-gray-800">{interview.companyName}</p>
        </div>

        <div className="mt-1 flex items-center gap-1.5">
          <span className="body-m-medium text-gray-700">{interview.jobCategoryName}</span>
          <span className="h-3 w-px shrink-0 bg-gray-200" aria-hidden />
          <span className="body-m-medium text-gray-700">{interviewTypeLabel}</span>
        </div>
      </div>
      {isMenuOpen &&
        createPortal(
          <CalendarInterviewMenu
            ref={menuRef}
            menuPosition={menuPosition}
            isDeletingInterview={isDeletingInterview}
            onDeleteClick={(e) => {
              e.stopPropagation()
              setIsMenuOpen(false)
              setIsDeleteConfirmOpen(true)
            }}
          />,
          document.body,
        )}
      <ConfirmModal
        open={isDeleteConfirmOpen}
        onClose={() => {
          if (isDeletingInterview) {
            cancelDeleteRequest()
          }
          setIsDeleteConfirmOpen(false)
        }}
        onOk={() => {
          if (isDeletingInterview) return
          const controller = new AbortController()
          deleteAbortControllerRef.current = controller
          deleteInterview({ interviewId: interview.interviewId, signal: controller.signal })
        }}
        title="면접을 삭제하시겠어요?"
        description="삭제 후에는 되돌릴 수 없어요."
        okText="삭제하기"
        okButtonVariant="fill-gray-800"
        okButtonLoading={isDeletingInterview}
        hasCancelButton={true}
        cancelText="취소"
      />
    </li>
  )
}
