import ConfirmModal from '@/designs/components/modal/ConfirmModal'

type RetroCompleteConfirmModalProps = {
  open: boolean
  missingRetroNumbers: number[]
  missingKptItems: string[]
  onCancel: () => void
  onConfirm: () => void
}

export function RetroCompleteConfirmModal({
  open,
  missingRetroNumbers,
  missingKptItems,
  onCancel,
  onConfirm,
}: RetroCompleteConfirmModalProps) {
  const parts: string[] = []
  if (missingRetroNumbers.length > 0) {
    parts.push(missingRetroNumbers.map((num) => `${num}번`).join(', ') + ' 회고')
  }
  if (missingKptItems.length > 0) {
    parts.push(`KPT ${missingKptItems.join(', ')}` + ' 회고')
  }
  const description = `${parts.join(', ')}가\n작성되지 않았습니다.\n그래도 완료하시겠습니까?`

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
