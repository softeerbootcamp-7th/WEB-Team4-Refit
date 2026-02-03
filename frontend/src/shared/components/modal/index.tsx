import { useEffect, useRef, useId } from 'react'
import { createPortal } from 'react-dom'
import { CloseIcon } from '@/shared/assets'
import { useOnClickOutside } from '@/shared/hooks/useOnClickOutside'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: React.ReactNode
  children: React.ReactNode
  showCloseButton?: boolean
  className?: string
  closeOnOutsideClick?: boolean
}

const Modal = ({
  open,
  onClose,
  title,
  children,
  showCloseButton = true,
  className = '',
  closeOnOutsideClick = false,
}: ModalProps) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  useOnClickOutside(
    contentRef,
    () => {
      if (closeOnOutsideClick) onClose()
    },
    open,
  )

  useEffect(() => {
    if (!open) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', handleEsc)
    }
  }, [open, onClose])

  if (!open) return null
  const portalRoot = document.getElementById('modal-root') as HTMLElement
  const hasHeader = title != null || showCloseButton

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4 transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
    >
      <div
        ref={contentRef}
        className={`bg-gray-white relative w-full max-w-[480px] rounded-2xl shadow-lg ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-8">
          {hasHeader && (
            <div className="mb-8 flex items-start justify-between gap-4">
              {title != null ? (
                <h2 id={titleId} className="title-xl-bold wrap-break-words text-gray-900">
                  {title}
                </h2>
              ) : (
                <div aria-hidden="true" />
              )}

              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className="-mt-2 -mr-2 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  aria-label="닫기"
                >
                  <CloseIcon className="h-6 w-6" />
                </button>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, portalRoot)
}

export default Modal
