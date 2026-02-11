import Button from '@/designs/components/button'
import Modal from '@/designs/components/modal'

interface DeleteFolderModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  folderName: string
}

const DeleteFolderModal = ({ isOpen, onClose, onConfirm, folderName }: DeleteFolderModalProps) => {
  return (
    <Modal open={isOpen} onClose={onClose} title="폴더 삭제" showCloseButton={true}>
      <div className="flex flex-col gap-8">
        <p className="body-l-medium text-gray-600">
          <span className="font-bold text-gray-900">'{folderName}'</span> 폴더를 삭제하시겠습니까?
        </p>
        <div className="flex gap-3">
          <Button className="flex-1" variant="outline-gray-100" size="lg" onClick={onClose}>
            취소
          </Button>
          <Button
            className="flex-1"
            variant="fill-gray-800" // Or red, but standard is often gray/primary. User said "Project styles". I'll use gray-800 or similar based on existing buttons.
            size="lg"
            onClick={onConfirm}
          >
            삭제하기
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteFolderModal
