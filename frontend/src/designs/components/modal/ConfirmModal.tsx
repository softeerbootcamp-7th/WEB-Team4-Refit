import Button, { type VariantType } from '@/designs/components/button'
import Modal from '@/designs/components/modal'

export interface ConfirmModalBaseProps {
  open: boolean
  onClose: () => void
  title?: React.ReactNode
  description?: React.ReactNode
  okText: string
  okButtonVariant?: VariantType
  okButtonDisabled?: boolean
  okButtonLoading?: boolean
  onOk: () => void
  size?: 'sm' | 'md'
  className?: string
  isOutsideClickClosable?: boolean
}

type ConfirmModalStateProps =
  | { hasCancelButton: false; cancelText?: never }
  | { hasCancelButton: true; cancelText: string }
type ConfirmModalProps = ConfirmModalBaseProps & ConfirmModalStateProps

const ConfirmModal = ({
  open,
  onClose,
  title,
  description,
  okText,
  okButtonVariant,
  okButtonDisabled,
  okButtonLoading,
  onOk,
  hasCancelButton,
  cancelText,
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
          {hasCancelButton && (
            <Button variant="fill-gray-150" size="md" onClick={onClose} className="flex-1 shrink-0">
              {cancelText}
            </Button>
          )}
          <Button
            variant={okButtonVariant}
            size="md"
            onClick={onOk}
            disabled={okButtonDisabled}
            isLoading={okButtonLoading}
            className="flex-1 shrink-0"
          >
            {okText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmModal
