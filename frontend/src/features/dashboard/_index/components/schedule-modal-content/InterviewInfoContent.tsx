import { useMemo } from 'react'
import { useFindCompanies, useGetAllJobCategories, useGetIndustries } from '@/apis'
import { COMPANY_INDUSTRY_JOB_OPTIONS_STALE_TIME } from '@/constants/queryCachePolicy'
import { SearchableCombobox } from '@/ui/components'
import Button from '@/ui/components/button'

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

  const { data: companies, isLoading: isCompaniesLoading } = useFindCompanies(undefined, {
    query: { staleTime: COMPANY_INDUSTRY_JOB_OPTIONS_STALE_TIME },
  })
  const { data: industries, isLoading: isIndustriesLoading } = useGetIndustries({
    query: { staleTime: COMPANY_INDUSTRY_JOB_OPTIONS_STALE_TIME },
  })
  const { data: jobCategories, isLoading: isJobCategoriesLoading } = useGetAllJobCategories({
    query: { staleTime: COMPANY_INDUSTRY_JOB_OPTIONS_STALE_TIME },
  })

  const companyOptions = useMemo(
    () =>
      (companies?.result?.content ?? []).map((item) => ({
        value: item.companyName ?? '',
        label: item.companyName ?? '',
      })),
    [companies?.result?.content],
  )
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
          options={companyOptions}
          value={companyName}
          onChange={(e: { target: { value: string } }) => onChange({ ...values, companyName: e.target.value })}
          required
          searchPlaceholder="검색"
          creatable
          disabled={isCompaniesLoading}
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
