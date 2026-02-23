import { useQueryClient } from '@tanstack/react-query'
import { getGetMyProfileInfoQueryKey, useAgreeToTerms } from '@/apis/generated/user-api/user-api'
import OptionalTermsModal from './OptionalTermsModal'

type OptionalTermsAgreeModalProps = {
  open: boolean
  onClose: () => void
}

export default function OptionalTermsAgreeModal({ open, onClose }: OptionalTermsAgreeModalProps) {
  const queryClient = useQueryClient()
  const { mutate: agreeToTerms, isPending } = useAgreeToTerms({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: getGetMyProfileInfoQueryKey() })
        onClose()
      },
    },
  })

  return (
    <OptionalTermsModal
      open={open}
      onClose={onClose}
      title="선택 약관 동의"
      showAgreementAction
      onAgree={agreeToTerms}
      isAgreePending={isPending}
    />
  )
}
