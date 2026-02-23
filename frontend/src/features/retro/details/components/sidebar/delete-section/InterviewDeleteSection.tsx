import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useDeleteInterview } from '@/apis/generated/interview-api/interview-api'
import { useOnClickOutside } from '@/features/_common/_index/hooks/useOnClickOutside'
import { ROUTES } from '@/routes/routes'
import { MoreIcon } from '@/ui/assets'
import ConfirmModal from '@/ui/components/modal/ConfirmModal'

type InterviewDeleteSectionProps = {
  interviewId: number
}

export function InterviewDeleteSection({ interviewId }: InterviewDeleteSectionProps) {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const goBackOrDashboard = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }
    navigate(ROUTES.DASHBOARD_MY_INTERVIEWS, { replace: true })
  }

  const { mutate: deleteInterview, isPending: isDeletingInterview } = useDeleteInterview({
    mutation: {
      onSuccess: goBackOrDashboard,
    },
  })

  useOnClickOutside(menuRef, () => setIsMenuOpen(false), isMenuOpen)

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="rounded-md text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
        >
          <MoreIcon className="h-7 w-7" />
        </button>
        {isMenuOpen && (
          <div className="absolute top-full right-0 z-10 mt-1 min-w-30 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg ring-1 ring-black/5">
            <button
              type="button"
              disabled={isDeletingInterview}
              onClick={() => {
                setIsMenuOpen(false)
                setIsDeleteConfirmOpen(true)
              }}
              className="body-s-medium w-full px-4 py-2.5 text-left text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              삭제하기
            </button>
          </div>
        )}
      </div>
      <ConfirmModal
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onOk={() => {
          if (isDeletingInterview) return
          deleteInterview({ interviewId })
        }}
        title="면접을 삭제하시겠어요?"
        description="삭제 후에는 되돌릴 수 없어요."
        okText="삭제하기"
        okButtonVariant="fill-gray-800"
        okButtonLoading={isDeletingInterview}
        hasCancelButton={true}
        cancelText="취소"
      />
    </>
  )
}
