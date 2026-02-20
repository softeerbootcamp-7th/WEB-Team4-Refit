import { PencilIcon } from '@/designs/assets'
import { Button } from '@/designs/components'

type LinkingButtonsProps = {
  pendingSelection: unknown
  onCancel: () => void
  onSave: () => void
}

export function LinkingButtons({ pendingSelection, onCancel, onSave }: LinkingButtonsProps) {
  return (
    <>
      <Button variant="outline-gray-100" size="xs" onClick={onCancel}>
        취소
      </Button>
      <Button variant="fill-orange-500" size="xs" disabled={!pendingSelection} onClick={onSave}>
        연결 저장
      </Button>
    </>
  )
}

type ResetButtonProps = {
  onReset: () => void
}

export function ResetButton({ onReset }: ResetButtonProps) {
  return (
    <Button size="xs" variant="outline-gray-100" onClick={onReset}>
      초기화
    </Button>
  )
}

type DefaultButtonProps = {
  hasPdf: boolean
  onStartLinking: () => void
}

export function DefaultButton({ hasPdf, onStartLinking }: DefaultButtonProps) {
  return (
    <Button size="xs" variant="outline-orange-100" disabled={!hasPdf} onClick={onStartLinking}>
      <PencilIcon className="text-orange-500" />
      {hasPdf ? '자기소개서 연결하기' : '자기소개서를 먼저 업로드해주세요'}
    </Button>
  )
}
