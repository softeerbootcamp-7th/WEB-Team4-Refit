import { useRef, useState } from 'react'
import type { InterviewDto } from '@/apis'
import { INTERVIEW_TYPE_LABEL } from '@/constants/interviews'
import { MoreIcon, SmallLogoIcon } from '@/designs/assets'
import { useOnClickOutside } from '@/features/_common/hooks/useOnClickOutside'
import formatDateTime from '@/features/_common/utils/date'

interface CalendarInterviewCardProps {
  interview: InterviewDto
  onItemClick: (interviewId: number) => void
  onEdit?: (interviewId: number) => void
  onDelete?: (interviewId: number) => void
}

export function CalendarInterviewCard({ interview, onItemClick, onEdit, onDelete }: CalendarInterviewCardProps) {
  const interviewTypeLabel =
    INTERVIEW_TYPE_LABEL[interview.interviewType as keyof typeof INTERVIEW_TYPE_LABEL] ?? interview.interviewType

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(menuRef, () => setIsMenuOpen(false), isMenuOpen)

  return (
    <li>
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => {
          const target = e.target as Element
          if (target.closest('[data-more-trigger="true"]')) return
          onItemClick(interview.interviewId)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onItemClick(interview.interviewId)
          }
        }}
        className="w-full cursor-pointer rounded-lg bg-white p-4 text-left hover:bg-gray-50"
      >
        <div className="mb-1 flex items-center justify-between gap-1.5">
          <p className="body-s-medium truncate text-gray-300">{formatDateTime(interview.interviewStartAt)}</p>
          <div ref={menuRef} className="relative shrink-0" data-more-trigger="true">
            <button
              type="button"
              data-more-trigger="true"
              onClick={(e) => {
                e.stopPropagation()
                setIsMenuOpen((prev) => !prev)
              }}
              className="flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-200 hover:text-gray-600"
            >
              <MoreIcon className="h-7 w-7" />
            </button>

            {isMenuOpen && (
              <div
                data-more-trigger="true"
                className="absolute top-full right-0 z-10 mt-1 min-w-30 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg ring-1 ring-black/5"
              >
                <button
                  type="button"
                  data-more-trigger="true"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsMenuOpen(false)
                    onEdit?.(interview.interviewId)
                  }}
                  className="body-s-medium w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50"
                >
                  수정하기
                </button>
                <button
                  type="button"
                  data-more-trigger="true"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsMenuOpen(false)
                    onDelete?.(interview.interviewId)
                  }}
                  className="body-s-medium w-full px-4 py-2.5 text-left text-red-500 hover:bg-red-50"
                >
                  삭제하기
                </button>
              </div>
            )}
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
    </li>
  )
}
