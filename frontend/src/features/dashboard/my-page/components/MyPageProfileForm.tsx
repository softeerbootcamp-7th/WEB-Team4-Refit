import { Button, Checkbox, Input, NativeCombobox } from '@/ui/components'
import type { FormOption, FormValues, SaveFeedback } from './types'

type MyPageProfileFormProps = {
  values: FormValues
  initialValues: FormValues
  industryOptions: FormOption[]
  jobOptions: FormOption[]
  saveFeedback: SaveFeedback | null
  isPageLoading: boolean
  isSaving: boolean
  isIndustriesLoading: boolean
  isJobCategoriesLoading: boolean
  isSaveDisabled: boolean
  onNicknameChange: (value: string) => void
  onIndustryChange: (value: string) => void
  onJobCategoryChange: (value: string) => void
  onTermsChange: (checked: boolean) => void
  onOpenTermsModal: () => void
  onSave: () => void
}

export default function MyPageProfileForm({
  values,
  initialValues,
  industryOptions,
  jobOptions,
  saveFeedback,
  isPageLoading,
  isSaving,
  isIndustriesLoading,
  isJobCategoriesLoading,
  isSaveDisabled,
  onNicknameChange,
  onIndustryChange,
  onJobCategoryChange,
  onTermsChange,
  onOpenTermsModal,
  onSave,
}: MyPageProfileFormProps) {
  const isFormDisabled = isPageLoading || isSaving
  const isTermsDisabled = isFormDisabled || initialValues.isAgreedToTerms

  return (
    <section className="bg-gray-white border-gray-150 flex flex-col gap-6 rounded-2xl border p-8">
      <Input
        label="닉네임"
        value={values.nickname}
        onChange={(e) => onNicknameChange(e.target.value)}
        placeholder="20자 이내로 입력해 주세요"
        maxLength={20}
        disabled={isFormDisabled}
      />

      <NativeCombobox
        label="산업군"
        value={values.industryId}
        onChange={(e) => onIndustryChange(e.target.value)}
        options={industryOptions}
        placeholder={isIndustriesLoading ? '산업군 목록 불러오는 중...' : '산업군을 선택해 주세요'}
        disabled={isFormDisabled}
      />

      <NativeCombobox
        label="직군"
        value={values.jobCategoryId}
        onChange={(e) => onJobCategoryChange(e.target.value)}
        options={jobOptions}
        placeholder={isJobCategoriesLoading ? '직군 목록 불러오는 중...' : '직군을 선택해 주세요'}
        disabled={isFormDisabled}
      />

      <div className="flex w-full items-center justify-between rounded-xl bg-gray-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={values.isAgreedToTerms}
            onChange={onTermsChange}
            label="[선택] 질문 데이터 활용 약관 동의"
            disabled={isTermsDisabled}
          />
        </div>
        <button
          type="button"
          className="body-s-medium text-gray-500 underline underline-offset-2 hover:text-gray-700"
          onClick={onOpenTermsModal}
        >
          자세히보기
        </button>
      </div>

      {saveFeedback && (
        <p
          className={`body-s-medium ${saveFeedback.tone === 'success' ? 'text-green-400' : 'text-red-400'}`}
          aria-live="polite"
        >
          {saveFeedback.message}
        </p>
      )}

      <div className="flex justify-end">
        <Button
          type="button"
          size="sm"
          variant="fill-orange-500"
          className="w-28"
          disabled={isSaveDisabled}
          isLoading={isSaving}
          onClick={onSave}
        >
          저장하기
        </Button>
      </div>
    </section>
  )
}
