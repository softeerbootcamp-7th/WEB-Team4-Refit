import { NotebookChickIcon } from '@/designs/assets'
import { Button } from '@/designs/components'
import Modal from '@/designs/components/modal'

type RetroCompleteResultModalProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export function RetroCompleteResultModal({ open, onClose, onConfirm }: RetroCompleteResultModalProps) {
  return (
    <Modal open={open} onClose={onClose} showCloseButton={false} size="sm" className="pt-8 pb-6">
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="title-l-semibold text-gray-900">회고가 완료되었어요</p>
          <NotebookChickIcon className="h-37 w-41" />
          <p className="title-s-medium whitespace-pre-line text-gray-500">
            {`작성한 회고는 내 면접 모아보기에서\n확인할 수 있어요.`}
          </p>
        </div>
        <Button variant="fill-gray-800" size="md" className="w-full" onClick={onConfirm}>
          확인
        </Button>
      </div>
    </Modal>
  )
}
