import { useCallback, useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createPortal } from 'react-dom'
import {
  getGetDashboardCalendarInterviewsQueryKey,
  getGetDebriefIncompletedInterviewsQueryKey,
  getGetUpcomingInterviewsQueryKey,
  useDeleteInterview,
} from '@/apis'
import type { InterviewDto } from '@/apis'
import { INTERVIEW_TYPE_LABEL } from '@/constants/interviews'
import { MoreIcon, SmallLogoIcon } from '@/designs/assets'
import { Badge } from '@/designs/components'
import ConfirmModal from '@/designs/components/modal/ConfirmModal'
import formatDateTime from '@/features/_common/utils/date'
import { CalendarInterviewMenu } from './CalendarInterviewMenu'

interface CalendarInterviewCardProps {
  interview: InterviewDto
  onItemClick: (interview: InterviewDto) => void
}

const INTERVIEW_REVIEW_STATUS_LABEL: Record<InterviewDto['interviewReviewStatus'], string> = {
  NOT_LOGGED: '기록 전',
  LOG_DRAFT: '기록 중',
  QNA_SET_DRAFT: '기록 확인',
  SELF_REVIEW_DRAFT: '회고 중',
  DEBRIEF_COMPLETED: '회고 완료',
}

export function CalendarInterviewCard({ interview, onItemClick }: CalendarInterviewCardProps) {
  const interviewTypeLabel =
    INTERVIEW_TYPE_LABEL[interview.interviewType as keyof typeof INTERVIEW_TYPE_LABEL] ?? interview.interviewType
  const interviewReviewStatusLabel = INTERVIEW_REVIEW_STATUS_LABEL[interview.interviewReviewStatus] ?? '기록 전'

  const queryClient = useQueryClient()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const { mutate: deleteInterview, isPending: isDeletingInterview } = useDeleteInterview({
    mutation: {
      onSuccess: () => {
        setIsDeleteConfirmOpen(false)
        void queryClient.invalidateQueries({ queryKey: getGetDashboardCalendarInterviewsQueryKey() })
        void queryClient.invalidateQueries({ queryKey: getGetDebriefIncompletedInterviewsQueryKey() })
        void queryClient.invalidateQueries({ queryKey: getGetUpcomingInterviewsQueryKey() })
      },
    },
  })

  const updateMenuPosition = useCallback(() => {
    const trigger = triggerRef.current
    const menu = menuRef.current
    if (!trigger || !menu) return

    const triggerRect = trigger.getBoundingClientRect()
    const menuWidth = menu.offsetWidth
    const menuHeight = menu.offsetHeight
    const hasSpaceBelow = window.innerHeight - triggerRect.bottom >= menuHeight + 4
    const top = hasSpaceBelow ? triggerRect.bottom + 4 : Math.max(8, triggerRect.top - menuHeight - 4)
    const left = Math.min(Math.max(8, triggerRect.right - menuWidth), window.innerWidth - menuWidth - 8)

    setMenuPosition({ top, left })
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node
      if (triggerRef.current?.contains(target)) return
      if (menuRef.current?.contains(target)) return
      setIsMenuOpen(false)
    }

    const handleReposition = () => updateMenuPosition()

    document.addEventListener('mousedown', handleOutsideClick)
    window.addEventListener('resize', handleReposition)
    window.addEventListener('scroll', handleReposition, true)
    updateMenuPosition()

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      window.removeEventListener('resize', handleReposition)
      window.removeEventListener('scroll', handleReposition, true)
    }
  }, [isMenuOpen, updateMenuPosition])

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
            <p className="body-s-medium truncate text-gray-300">{formatDateTime(interview.interviewStartAt)}</p>
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
          <div className="border-gray-150 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border bg-gray-100">
            <SmallLogoIcon className="h-3.5 w-3.5 text-gray-400" />
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
          if (isDeletingInterview) return
          setIsDeleteConfirmOpen(false)
        }}
        onOk={() => {
          if (isDeletingInterview) return
          deleteInterview({ interviewId: interview.interviewId })
        }}
        title="면접을 삭제하시겠어요?"
        description="삭제 후에는 되돌릴 수 없어요."
        okText="삭제하기"
        okButtonVariant="fill-gray-800"
        hasCancelButton={true}
        cancelText="취소"
      />
    </li>
  )
}
