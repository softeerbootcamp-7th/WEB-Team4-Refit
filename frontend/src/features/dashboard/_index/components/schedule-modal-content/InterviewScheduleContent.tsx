import { useEffect } from 'react'
import { INTERVIEW_TYPE_OPTIONS } from '@/constants/interviews'
import Button from '@/shared/components/button'

const getTodayDateString = () => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const DEFAULT_INTERVIEW_TIME = '00:00'

export interface InterviewScheduleFormValues {
  interviewType: string
  interviewDate: string
  interviewTime: string
}

export interface InterviewScheduleContentProps {
  values: InterviewScheduleFormValues
  onChange: (values: InterviewScheduleFormValues) => void
  onPrev: () => void
  onNext: () => void
}

const inputBaseClass =
  'body-l-medium border-gray-150 w-full rounded-[8px] border px-4 py-3 text-gray-900 outline-none placeholder:text-gray-300 focus:border-orange-500'

export function InterviewScheduleContent({ values, onChange, onPrev, onNext }: InterviewScheduleContentProps) {
  const { interviewType, interviewDate, interviewTime } = values
  const defaultDate = getTodayDateString()
  const displayDate = interviewDate || defaultDate
  const displayTime = interviewTime || DEFAULT_INTERVIEW_TIME

  useEffect(() => {
    const needsDate = interviewDate.trim() === ''
    const needsTime = interviewTime.trim() === ''
    if (needsDate || needsTime) {
      onChange({
        ...values,
        ...(needsDate && { interviewDate: defaultDate }),
        ...(needsTime && { interviewTime: DEFAULT_INTERVIEW_TIME }),
      })
    }
  }, [])

  const isFormValid = interviewType !== '' && interviewDate.trim() !== '' && interviewTime.trim() !== ''

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="body-l-semibold text-gray-600">면접 유형</label>
          <div className="grid grid-cols-3 gap-2">
            {INTERVIEW_TYPE_OPTIONS.map((option) => {
              const isSelected = interviewType === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onChange({ ...values, interviewType: option.value })}
                  className={`body-l-medium cursor-pointer rounded-[10px] p-4 transition-colors ${
                    isSelected ? 'bg-orange-500 text-white' : 'border-gray-150 border bg-white text-gray-600'
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="body-l-semibold text-gray-600">면접 일시</label>
          <div className="flex gap-2">
            <input
              type="date"
              value={displayDate}
              onChange={(e) => onChange({ ...values, interviewDate: e.target.value })}
              className={inputBaseClass}
            />
            <input
              type="time"
              value={displayTime}
              onChange={(e) => onChange({ ...values, interviewTime: e.target.value })}
              className={inputBaseClass}
            />
          </div>
        </div>
      </div>
      <div className="mt-8 flex gap-3">
        <Button type="button" variant="fill-gray-150" size="md" className="flex-1" onClick={onPrev}>
          이전
        </Button>
        <Button
          type="button"
          variant="fill-gray-800"
          size="md"
          className="flex-1"
          disabled={!isFormValid}
          onClick={onNext}
        >
          등록하기
        </Button>
      </div>
    </>
  )
}
