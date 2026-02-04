import { SearchableCombobox } from '@/shared/components'
import Button from '@/shared/components/button'

const INDUSTRY_OPTIONS: { value: string; label: string }[] = [
  { value: 'it', label: 'IT / 소프트웨어' },
  { value: 'finance', label: '금융' },
  { value: 'manufacturing', label: '제조' },
  { value: 'ecommerce', label: '이커머스' },
  { value: 'media', label: '미디어' },
  { value: 'healthcare', label: '의료 / 헬스케어' },
  { value: 'education', label: '교육' },
  { value: 'other', label: '기타' },
]

const COMPANY_WITH_INDUSTRY: {
  value: string
  label: string
  industryValue: string
  industryLabel: string
}[] = [
  { value: 'kakao', label: '카카오', industryValue: 'it', industryLabel: 'IT / 소프트웨어' },
  { value: 'naver', label: '네이버', industryValue: 'it', industryLabel: 'IT / 소프트웨어' },
  { value: 'coupang', label: '쿠팡', industryValue: 'ecommerce', industryLabel: '이커머스' },
  { value: 'toss', label: '토스', industryValue: 'finance', industryLabel: '금융' },
  { value: 'line', label: '라인', industryValue: 'it', industryLabel: 'IT / 소프트웨어' },
  { value: 'samsung', label: '삼성전자', industryValue: 'manufacturing', industryLabel: '제조' },
  { value: 'hyundai', label: '현대자동차', industryValue: 'manufacturing', industryLabel: '제조' },
  { value: 'lg', label: 'LG전자', industryValue: 'manufacturing', industryLabel: '제조' },
  { value: 'sk', label: 'SK', industryValue: 'manufacturing', industryLabel: '제조' },
  { value: 'other', label: '기타', industryValue: 'other', industryLabel: '기타' },
]

const COMPANY_OPTIONS = COMPANY_WITH_INDUSTRY.map(({ value, label }) => ({ value, label }))

const JOB_TITLE_OPTIONS: { value: string; label: string }[] = [
  { value: 'frontend', label: '프론트엔드 개발' },
  { value: 'backend', label: '백엔드 개발' },
  { value: 'fullstack', label: '풀스택 개발' },
  { value: 'mobile', label: '모바일 개발' },
  { value: 'design', label: '디자인' },
  { value: 'product', label: '프로덕트' },
  { value: 'marketing', label: '마케팅' },
  { value: 'data', label: '데이터' },
  { value: 'other', label: '기타' },
]

export interface InterviewInfoFormValues {
  companyName: string
  industry: string
  jobTitle: string
}

export interface InterviewInfoContentProps {
  values: InterviewInfoFormValues
  onChange: (values: InterviewInfoFormValues) => void
  onNext: () => void
}

export function InterviewInfoContent({ values, onChange, onNext }: InterviewInfoContentProps) {
  const { companyName, industry, jobTitle } = values

  const handleCompanyChange = (e: { target: { value: string } }) => {
    const value = e.target.value
    const pair = COMPANY_WITH_INDUSTRY.find((c) => c.value === value)
    onChange({
      ...values,
      companyName: value,
      industry: pair ? pair.industryValue : '',
    })
  }

  const isIndustryFromList = COMPANY_WITH_INDUSTRY.some((c) => c.value === companyName)
  const isFormValid = companyName.trim() !== '' && industry.trim() !== '' && jobTitle.trim() !== ''

  return (
    <>
      <div className="flex flex-col gap-6">
        <SearchableCombobox
          label="회사명"
          placeholder="회사명을 선택해 주세요"
          options={COMPANY_OPTIONS}
          value={companyName}
          onChange={handleCompanyChange}
          required
          searchPlaceholder="Search"
          creatable
        />
        <SearchableCombobox
          label="산업군"
          placeholder="산업군을 선택해 주세요"
          options={INDUSTRY_OPTIONS}
          value={industry}
          onChange={(e: { target: { value: string } }) => onChange({ ...values, industry: e.target.value })}
          required
          searchPlaceholder="검색"
          disabled={isIndustryFromList}
        />
        <SearchableCombobox
          label="직무"
          placeholder="직무를 선택해 주세요"
          options={JOB_TITLE_OPTIONS}
          value={jobTitle}
          onChange={(e: { target: { value: string } }) => onChange({ ...values, jobTitle: e.target.value })}
          required
          searchPlaceholder="검색"
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
