import { forwardRef } from 'react'
import type { MouseEvent } from 'react'

interface CalendarInterviewMenuProps {
  menuPosition: { top: number; left: number } | null
  isDeletingInterview: boolean
  onDeleteClick: (event: MouseEvent<HTMLButtonElement>) => void
}

export const CalendarInterviewMenu = forwardRef<HTMLDivElement, CalendarInterviewMenuProps>(
  ({ menuPosition, isDeletingInterview, onDeleteClick }, ref) => (
    <div
      ref={ref}
      data-more-trigger="true"
      className="fixed z-[1000] min-w-30 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg ring-1 ring-black/5"
      style={{
        top: menuPosition?.top ?? 0,
        left: menuPosition?.left ?? 0,
        visibility: menuPosition ? 'visible' : 'hidden',
      }}
    >
      <button
        type="button"
        data-more-trigger="true"
        disabled={isDeletingInterview}
        onClick={onDeleteClick}
        className="body-s-medium w-full px-4 py-2.5 text-left text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        삭제하기
      </button>
    </div>
  ),
)

CalendarInterviewMenu.displayName = 'CalendarInterviewMenu'
