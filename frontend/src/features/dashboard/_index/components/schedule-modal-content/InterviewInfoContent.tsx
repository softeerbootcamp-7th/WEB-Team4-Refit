import { useMemo } from 'react'
import { useGetAllJobCategories, useGetIndustries } from '@/apis'
import { SearchableCombobox } from '@/designs/components'
import Button from '@/designs/components/button'

const FORM_OPTIONS_STALE_TIME = 5 * 60 * 1000

const COMPANY_OPTIONS: { value: string; label: string }[] = [
  { value: '카카오', label: '카카오' },
  { value: '네이버', label: '네이버' },
  { value: '쿠팡', label: '쿠팡' },
  { value: '토스', label: '토스' },
  { value: '라인', label: '라인' },
  { value: '삼성전자', label: '삼성전자' },
  { value: '현대자동차', label: '현대자동차' },
  { value: 'LG전자', label: 'LG전자' },
  { value: 'SK', label: 'SK' },
]

export interface InterviewInfoFormValues {
  companyName: string
  industryId: string
  jobCategoryId: string
  jobRole: string
}

export interface InterviewInfoContentProps {
  values: InterviewInfoFormValues
  onChange: (values: InterviewInfoFormValues) => void
  onNext: () => void
}

export function InterviewInfoContent({ values, onChange, onNext }: InterviewInfoContentProps) {
  const { companyName, industryId, jobCategoryId } = values

  const { data: industries, isLoading: isIndustriesLoading } = useGetIndustries({
    query: { staleTime: FORM_OPTIONS_STALE_TIME },
  })
  const { data: jobCategories, isLoading: isJobCategoriesLoading } = useGetAllJobCategories({
    query: { staleTime: FORM_OPTIONS_STALE_TIME },
  })

  const industryOptions = useMemo(
    () =>
      (industries?.result ?? []).map((item) => ({
        value: String(item.industryId),
        label: item.industryName,
      })),
    [industries?.result],
  )
  const jobCategoryOptions = useMemo(
    () =>
      (jobCategories?.result ?? []).map((item) => ({
        value: String(item.jobCategoryId),
        label: item.jobCategoryName,
      })),
    [jobCategories?.result],
  )

  const handleJobCategoryChange = (nextJobCategoryId: string) => {
    const selected = jobCategoryOptions.find((option) => option.value === nextJobCategoryId)
    onChange({
      ...values,
      jobCategoryId: nextJobCategoryId,
      jobRole: selected?.label ?? '',
    })
  }

  const isFormValid = companyName.trim() !== '' && industryId !== '' && jobCategoryId !== ''

  return (
    <>
      <div className="flex flex-col gap-6">
        <SearchableCombobox
          label="회사명"
          placeholder="회사명을 선택해 주세요"
          options={COMPANY_OPTIONS}
          value={companyName}
          onChange={(e: { target: { value: string } }) => onChange({ ...values, companyName: e.target.value })}
          required
          searchPlaceholder="Search"
          creatable
        />
        <SearchableCombobox
          label="산업군"
          placeholder="산업군을 선택해 주세요"
          options={industryOptions}
          value={industryId}
          onChange={(e: { target: { value: string } }) => onChange({ ...values, industryId: e.target.value })}
          required
          searchPlaceholder="검색"
          disabled={isIndustriesLoading}
        />
        <SearchableCombobox
          label="직무"
          placeholder="직무를 선택해 주세요"
          options={jobCategoryOptions}
          value={jobCategoryId}
          onChange={(e: { target: { value: string } }) => handleJobCategoryChange(e.target.value)}
          required
          searchPlaceholder="검색"
          disabled={isJobCategoriesLoading}
        />
      </div>
      <Button
        type="button"
        variant="fill-gray-800"
        size="md"
        className="mt-8 w-full"
        disabled={!isFormValid}
        onClick={onNext}
      >
        다음 단계
      </Button>
    </>
  )
}
