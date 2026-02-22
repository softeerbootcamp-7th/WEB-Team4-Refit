import { MyPageHeader, MyPageProfileForm, MyPageTermsModal } from '@/features/dashboard/my-page/components'
import { useMyPageProfile } from '@/features/dashboard/my-page/hooks'

export default function MyPage() {
  const { formProps, isTermsModalOpen, closeTermsModal } = useMyPageProfile()

  return (
    <div className="mx-auto w-full max-w-3xl">
      <MyPageHeader />
      <MyPageProfileForm {...formProps} />
      <MyPageTermsModal open={isTermsModalOpen} onClose={closeTermsModal} />
    </div>
  )
}
