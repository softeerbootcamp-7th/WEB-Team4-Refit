import ConfirmModal from '@/designs/components/modal/ConfirmModal'

type RetroCompleteConfirmModalProps = {
  open: boolean
  missingRetroNumbers: number[]
  onCancel: () => void
  onConfirm: () => void
}

export function RetroCompleteConfirmModal({
  open,
  missingRetroNumbers,
  onCancel,
  onConfirm,
}: RetroCompleteConfirmModalProps) {
  const description = `${missingRetroNumbers.map((num) => `${num}번`).join(', ')} 회고가 작성되지 않았습니다.\n그래도 완료하시겠습니까?`

  return (
    <ConfirmModal
      open={open}
      onClose={onCancel}
      title="회고 완료 확인"
      description={description}
      hasCancelButton={true}
      cancelText="취소"
      okText="완료하기"
      okButtonVariant="fill-gray-800"
      onOk={onConfirm}
    />
  )
}
