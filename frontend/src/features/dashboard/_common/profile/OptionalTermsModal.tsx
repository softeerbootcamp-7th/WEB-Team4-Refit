import { useState } from 'react'
import { Button, Checkbox, Modal } from '@/ui/components'
import OptionalTermsContent from './OptionalTermsContent'

type OptionalTermsModalProps = {
  open: boolean
  onClose: () => void
  title: string
  showAgreementAction?: boolean
  onAgree?: () => void
  isAgreePending?: boolean
  agreeButtonLabel?: string
}

const DEFAULT_AGREE_BUTTON_LABEL = '동의하고 모든 데이터 확인하기'

export default function OptionalTermsModal({
  open,
  onClose,
  title,
  showAgreementAction = false,
  onAgree,
  isAgreePending = false,
  agreeButtonLabel = DEFAULT_AGREE_BUTTON_LABEL,
}: OptionalTermsModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="lg"
      isEscapeKeyClosable={true}
      isOutsideClickClosable={true}
    >
      <div className="flex flex-col gap-6">
        <OptionalTermsContent />
        {showAgreementAction && (
          <AgreementAction onAgree={onAgree} isAgreePending={isAgreePending} agreeButtonLabel={agreeButtonLabel} />
        )}
      </div>
    </Modal>
  )
}

type AgreementActionProps = {
  onAgree?: () => void
  isAgreePending: boolean
  agreeButtonLabel: string
}

function AgreementAction({ onAgree, isAgreePending, agreeButtonLabel }: AgreementActionProps) {
  const [checked, setChecked] = useState(false)

  return (
    <div className="flex items-center justify-between gap-4">
      <Checkbox checked={checked} onChange={setChecked} label="데이터 활용에 동의합니다." />
      <Button
        size="sm"
        variant="fill-orange-500"
        disabled={!checked || isAgreePending || !onAgree}
        isLoading={isAgreePending}
        onClick={onAgree}
      >
        {agreeButtonLabel}
      </Button>
    </div>
  )
}
