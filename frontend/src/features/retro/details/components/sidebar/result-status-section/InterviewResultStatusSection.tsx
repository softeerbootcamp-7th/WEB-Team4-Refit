import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  getGetInterviewFullQueryKey,
  useUpdateInterviewResultStatus,
} from '@/apis/generated/interview-api/interview-api'
import { useOnClickOutside } from '@/features/_common/_index/hooks/useOnClickOutside'
import { RESULT_STATUS_ITEMS, type InterviewResultStatus } from '@/features/dashboard/my-interviews/constants/constants'
import { CaretDownIcon } from '@/ui/assets'

type InterviewResultStatusSectionProps = {
  interviewId: number
  initialStatus: string
}

const DEFAULT_RESULT_STATUS: InterviewResultStatus = 'WAIT'
const RESULT_STATUS_VALUES = new Set(RESULT_STATUS_ITEMS.map((item) => item.value))

function resolveResultStatus(status: string): InterviewResultStatus {
  return RESULT_STATUS_VALUES.has(status) ? (status as InterviewResultStatus) : DEFAULT_RESULT_STATUS
}

export function InterviewResultStatusSection({ interviewId, initialStatus }: InterviewResultStatusSectionProps) {
  const queryClient = useQueryClient()
  const { mutate: updateResultStatus, isPending: isUpdatingResultStatus } = useUpdateInterviewResultStatus({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: getGetInterviewFullQueryKey(interviewId) })
        void queryClient.invalidateQueries({ queryKey: ['my-interviews', 'interview-list'] })
      },
    },
  })
  const [status, setStatus] = useState<InterviewResultStatus>(() => resolveResultStatus(initialStatus))
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(dropdownRef, () => setIsOpen(false))

  useEffect(() => {
    setStatus(resolveResultStatus(initialStatus))
  }, [initialStatus])

  const currentOption = RESULT_STATUS_ITEMS.find((opt) => opt.value === status) ?? RESULT_STATUS_ITEMS[0]

  const handleSelect = (value: InterviewResultStatus) => {
    if (isUpdatingResultStatus || status === value) {
      setIsOpen(false)
      return
    }

    const previousStatus = status
    setStatus(value)
    setIsOpen(false)
    updateResultStatus(
      { interviewId, data: { interviewResultStatus: value } },
      {
        onError: () => setStatus(previousStatus),
      },
    )
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
              {RESULT_STATUS_ITEMS.map((option) => {
                const isSelected = status === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    disabled={isUpdatingResultStatus}
                    onClick={() => handleSelect(resolveResultStatus(option.value))}
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
