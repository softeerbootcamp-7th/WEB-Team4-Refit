import { useEffect, useRef, useId } from 'react'
import { createPortal } from 'react-dom'
import { useOnClickOutside } from '@/features/_common/hooks/useOnClickOutside'
import { CloseIcon } from '@/shared/assets'

type ModalSize = 'sm' | 'md'

const SIZE_CLASS: Record<ModalSize, string> = {
  sm: 'p-5 pt-6 max-w-96.5',
  md: 'px-6 py-8 max-w-120',
}

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  showCloseButton?: boolean
  size?: ModalSize
  className?: string
  isOutsideClickClosable?: boolean
}

const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  showCloseButton = true,
  className = '',
  size = 'md',
  isOutsideClickClosable = false,
}: ModalProps) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  useOnClickOutside(
    contentRef,
    () => {
      if (isOutsideClickClosable) onClose()
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
  const portalRoot = document.getElementById('modal-root')
  if (!portalRoot) return null
  const hasHeader = title != null || description != null || showCloseButton

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4 transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
    >
      <div
        ref={contentRef}
        className={`bg-gray-white relative w-full rounded-2xl shadow-lg ${SIZE_CLASS[size]} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {hasHeader && (
          <div className="mb-8 flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              {title != null ? (
                <h2 id={titleId} className="title-xl-bold wrap-break-words text-gray-900">
                  {title}
                </h2>
              ) : (
                <div aria-hidden="true" />
              )}
              {description != null && <p className="body-m-regular mt-2 text-gray-500">{description}</p>}
            </div>

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
  )

  return createPortal(modalContent, portalRoot)
}

export default Modal
