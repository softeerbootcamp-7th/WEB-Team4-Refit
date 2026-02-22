import { OptionalTermsModal } from '@/features/dashboard/_common/profile'
import { MyPageHeader, MyPageProfileForm } from '@/features/dashboard/my-page/components'
import { useMyPageProfile } from '@/features/dashboard/my-page/hooks'

export default function MyPage() {
  const { formProps, isTermsModalOpen, closeTermsModal } = useMyPageProfile()

  return (
    <div className="mx-auto w-full max-w-3xl">
      <MyPageHeader />
      <MyPageProfileForm {...formProps} />
      <OptionalTermsModal open={isTermsModalOpen} onClose={closeTermsModal} title="선택 약관" isEscapeKeyClosable={false} />
    </div>
  )
}
