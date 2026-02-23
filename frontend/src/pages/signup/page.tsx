import { useSignupForm } from '@/features/_common/auth'
import { ROUTES } from '@/routes/routes'
import { Logo } from '@/ui/assets'
import { Button, Input, NativeCombobox } from '@/ui/components'

export default function SignupPage() {
  const {
    nickname,
    setNickname,
    industry,
    setIndustry,
    industryOptions,
    isIndustryOptionsLoading,
    job,
    setJob,
    jobOptions,
    isJobOptionsLoading,
    isFormValid,
    isOptionsLoading,
    isPending,
    handleSubmit,
  } = useSignupForm({ redirectTo: ROUTES.DASHBOARD })
  const isFormLocked = isPending

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 py-8 sm:px-6 sm:py-12">
      <div className="bg-gray-white w-full max-w-120 overflow-hidden rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] sm:rounded-3xl">
        <div className="border-gray-150 flex items-center gap-2 border-b px-6 py-4 sm:px-8 sm:py-5">
          <Logo className="h-6 w-auto text-orange-500 sm:h-7" aria-label="리핏 로고" />
        </div>

        <div className="flex flex-col px-6 py-6 sm:px-8 sm:py-8">
          <h1 className="headline-s-bold mb-2 text-gray-900">기본 정보 입력</h1>
          <p className="body-m-regular mb-8 text-gray-600">주로 지원하시는 산업과 직군을 입력해주세요.</p>

          <div className="flex flex-col gap-5">
            <Input
              label="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="20자 이내로 입력해주세요"
              maxLength={20}
              disabled={isFormLocked}
              required
            />
            <NativeCombobox
              label="관심 산업군"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              options={industryOptions}
              placeholder={isIndustryOptionsLoading ? '산업군 목록 불러오는 중...' : '주로 지원하는 산업군'}
              disabled={isIndustryOptionsLoading || isFormLocked}
              required
            />
            <NativeCombobox
              label="관심 직군"
              value={job}
              onChange={(e) => setJob(e.target.value)}
              options={jobOptions}
              placeholder={isJobOptionsLoading ? '직군 목록 불러오는 중...' : '주로 지원하는 직군'}
              disabled={isJobOptionsLoading || isFormLocked}
              required
            />
          </div>

          <Button
            type="button"
            variant="fill-orange-500"
            size="lg"
            className="mt-8 w-full"
            disabled={!isFormValid || isOptionsLoading || isPending}
            isLoading={isPending}
            onClick={handleSubmit}
          >
            시작하기
          </Button>
        </div>
      </div>
    </div>
  )
}
