import ConfirmModal from '@/ui/components/modal/ConfirmModal'

interface DeleteFolderModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | boolean | Promise<void | boolean>
  folderName: string
  errorMessage?: string | null
  isSubmitting?: boolean
}

const DeleteFolderModal = ({
  isOpen,
  onClose,
  onConfirm,
  folderName,
  errorMessage,
  isSubmitting = false,
}: DeleteFolderModalProps) => {
  const handleConfirm = async () => {
    const shouldClose = await onConfirm()
    if (shouldClose === false) return

    onClose()
  }

  return (
    <ConfirmModal
      open={isOpen}
      onClose={onClose}
      hasCancelButton={true}
      cancelText="취소"
      title="폴더 삭제"
      description={
        <>
          <span className="font-bold text-gray-900">'{folderName}'</span> 폴더를 삭제하시겠습니까?
          {errorMessage && (
            <span className="body-s-medium mt-2 block text-red-500">{errorMessage}</span>
          )}
        </>
      }
      okText="삭제하기"
      okButtonVariant="fill-gray-800"
      okButtonLoading={isSubmitting}
      onOk={handleConfirm}
    />
  )
}

export default DeleteFolderModal
