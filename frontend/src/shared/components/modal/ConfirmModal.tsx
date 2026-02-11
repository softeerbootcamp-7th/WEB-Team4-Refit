import Button, { type VariantType } from '@/shared/components/button'
import Modal from '@/shared/components/modal'

export interface ConfirmModalProps {
  open: boolean
  title?: React.ReactNode
  description?: React.ReactNode
  hasCloseButton?: boolean
  closeText?: string
  onClose: () => void
  okText: string
  okButtonVariant?: VariantType
  onOk: () => void
  size?: 'sm' | 'md'
  className?: string
  isOutsideClickClosable?: boolean
}

const ConfirmModal = ({
  open,
  title,
  description,
  hasCloseButton = true,
  closeText = '취소',
  onClose,
  okText = '확인',
  okButtonVariant = 'fill-orange-500',
  onOk,
  size = 'sm',
  className = '',
  isOutsideClickClosable = false,
}: ConfirmModalProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      isOutsideClickClosable={isOutsideClickClosable}
      className={className}
      showCloseButton={false}
      size={size}
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <div className="flex w-full flex-col items-center gap-3">
          <span className="title-l-semibold">{title}</span>
          <span className="title-s-medium text-gray-500">{description}</span>
        </div>
        <div className="flex w-full flex-1 shrink-0 gap-3">
          {hasCloseButton && (
            <Button variant="fill-gray-150" size="md" onClick={onClose} className="flex-1 shrink-0">
              {closeText}
            </Button>
          )}
          <Button variant={okButtonVariant} size="md" onClick={onOk} className="flex-1 shrink-0">
            {okText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmModal
