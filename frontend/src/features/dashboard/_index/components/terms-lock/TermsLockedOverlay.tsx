import { useState, type ReactNode } from 'react'
import { Button } from '@/designs/components'
import TermsModal from '@/features/dashboard/trend-questions/components/list/terms-modal/TermsModal'

interface TermsLockedOverlayProps {
  isLocked: boolean
  children: ReactNode
  message?: string
  overlayClassName?: string
}

const DEFAULT_MESSAGE = '선택 약관에 동의하고 모든 데이터를 확인해보세요'

export default function TermsLockedOverlay({
  isLocked,
  children,
  message = DEFAULT_MESSAGE,
  overlayClassName = 'rounded-xl',
}: TermsLockedOverlayProps) {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false)

  if (!isLocked) {
    return children
  }

  return (
    <>
      <div className="relative">
        <div className="pointer-events-none blur-sm">{children}</div>
        <div
          className={`absolute inset-0 z-10 flex items-center justify-center bg-white/40 px-4 text-center ${overlayClassName}`}
        >
          <div className="flex flex-col items-center gap-4">
            <p className="body-l-semibold text-gray-500">{message}</p>
            <Button size="sm" variant="fill-gray-800" onClick={() => setIsTermsModalOpen(true)}>
              약관 동의하기
            </Button>
          </div>
        </div>
      </div>
      <TermsModal open={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} />
    </>
  )
}
