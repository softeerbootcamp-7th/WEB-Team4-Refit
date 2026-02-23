import { useSignupForm } from '@/features/_common/auth'
import { ROUTES } from '@/routes/routes'
import { Button, Input, NativeCombobox } from '@/ui/components'

export default function MobileSignupPage() {
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
  } = useSignupForm({ redirectTo: ROUTES.MOBILE_UNRECORDED })
  const isFormLocked = isPending

  return (
    <div className="flex h-full flex-col px-5 pb-9">
      <div className="flex-1">
        <h1 className="title-l-bold mt-[18px] mb-10 text-gray-800">회원가입</h1>

        <div className="space-y-10">
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
      </div>

      <div className="mt-8">
        <Button
          variant="fill-orange-500"
          size="md"
          className="w-full"
          disabled={!isFormValid || isOptionsLoading || isPending}
          isLoading={isPending}
          onClick={handleSubmit}
        >
          시작하기
        </Button>
      </div>
    </div>
  )
}
