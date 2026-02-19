import { useRef, useState } from 'react'
import { useUpdateInterviewResultStatus } from '@/apis/generated/interview-api/interview-api'
import { CaretDownIcon, NoteIcon } from '@/designs/assets'
import { SidebarLayout } from '@/designs/components'
import { InterviewInfoSection, QuestionListSection } from '@/features/_common/components/sidebar'
import { useOnClickOutside } from '@/features/_common/hooks/useOnClickOutside'
import type { IdLabelType } from '@/types/global'
import type { InterviewInfoType, QnaSetType } from '@/types/interview'

const RESULT_STATUS_OPTIONS = [
  { value: 'WAIT', label: '대기' },
  { value: 'PASS', label: '합격' },
  { value: 'FAIL', label: '불합격' },
] as const

type ResultStatus = (typeof RESULT_STATUS_OPTIONS)[number]['value']

type DetailSidebarProps = {
  interviewId: number
  interviewInfo: InterviewInfoType
  interviewResultStatus: string
  qnaSets: QnaSetType[]
  activeIndex: number
  onItemClick: (index: number) => void
}

export function DetailSidebar({
  interviewId,
  interviewInfo,
  interviewResultStatus,
  qnaSets,
  activeIndex,
  onItemClick,
}: DetailSidebarProps) {
  const questionItems: IdLabelType[] = [
    ...qnaSets.map(({ qnaSetId, questionText }, index) => ({
      id: qnaSetId,
      label: `${index + 1}. ${questionText}`,
    })),
    { id: -1, label: `${qnaSets.length + 1}. 최종 KPT 회고` },
  ]

  return (
    <SidebarLayout>
      <div className="inline-flex gap-2">
        <NoteIcon width="24" height="24" />
        <span className="body-l-semibold">내 면접 정보</span>
      </div>
      <InterviewResultStatusSection interviewId={interviewId} initialStatus={interviewResultStatus as ResultStatus} />
      <InterviewInfoSection {...interviewInfo} />
      <QuestionListSection
        title="회고 리스트"
        items={questionItems}
        activeIndex={activeIndex}
        onItemClick={onItemClick}
        className="overflow-y-auto"
      />
    </SidebarLayout>
  )
}

type InterviewResultStatusSectionProps = {
  interviewId: number
  initialStatus: ResultStatus
}

function InterviewResultStatusSection({ interviewId, initialStatus }: InterviewResultStatusSectionProps) {
  const { mutate: updateResultStatus } = useUpdateInterviewResultStatus()
  const [status, setStatus] = useState<ResultStatus>(initialStatus)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(dropdownRef, () => setIsOpen(false))

  const currentOption = RESULT_STATUS_OPTIONS.find((opt) => opt.value === status) ?? RESULT_STATUS_OPTIONS[0]

  const handleSelect = (value: ResultStatus) => {
    setStatus(value)
    setIsOpen(false)
    updateResultStatus({ interviewId, data: { interviewResultStatus: value } })
  }

  return (
    <div className="bg-gray-white rounded-lg px-6 py-4">
      <div className="flex items-center gap-2">
        <span className="body-s-semibold w-18.5 text-gray-300">결과</span>
        <div className="relative flex-1" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="body-s-medium inline-flex w-full items-center justify-between"
          >
            {currentOption.label}
            <CaretDownIcon className="h-3 w-3 text-gray-400" />
          </button>
          {isOpen && (
            <div className="absolute top-full -left-4 z-10 mt-5 w-45.5 overflow-hidden rounded-t-xs rounded-b-[10px] bg-white shadow-lg">
              {RESULT_STATUS_OPTIONS.map((option) => {
                const isSelected = status === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`body-s-medium w-full px-4 py-2.5 text-left transition-colors ${
                      isSelected ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
