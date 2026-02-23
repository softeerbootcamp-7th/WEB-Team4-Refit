import { useState } from 'react'
import { InterviewInfoContent } from '@/features/dashboard/_index/components/schedule-modal-content/InterviewInfoContent'
import type { InterviewInfoFormValues } from '@/features/dashboard/_index/components/schedule-modal-content/InterviewInfoContent'
import { InterviewScheduleContent } from '@/features/dashboard/_index/components/schedule-modal-content/InterviewScheduleContent'
import type { InterviewScheduleFormValues } from '@/features/dashboard/_index/components/schedule-modal-content/InterviewScheduleContent'
import type { ScheduleModalStep } from '@/features/dashboard/_index/constants/interviewCalendar'

export interface ScheduleFormSubmitValues extends InterviewInfoFormValues, InterviewScheduleFormValues {}

interface ScheduleModalInitialValues {
  interviewDate: string
  interviewTime: string
}

export interface ScheduleModalContentProps {
  step: ScheduleModalStep
  onStepChange: (step: ScheduleModalStep) => void
  onSubmit?: (values: ScheduleFormSubmitValues) => void
  isSubmitting?: boolean
  pastOnly?: boolean
  initialScheduleValues?: ScheduleModalInitialValues
}

export function ScheduleModalContent({
  step,
  onStepChange,
  onSubmit,
  isSubmitting,
  pastOnly,
  initialScheduleValues,
}: ScheduleModalContentProps) {
  const [interviewInfoValues, setInterviewInfoValues] = useState<InterviewInfoFormValues>({
    companyName: '',
    industryId: '',
    jobCategoryId: '',
    jobRole: '',
  })
  const [interviewScheduleValues, setInterviewScheduleValues] = useState<InterviewScheduleFormValues>({
    interviewType: '',
    interviewDate: initialScheduleValues?.interviewDate ?? '',
    interviewTime: initialScheduleValues?.interviewTime ?? '',
  })

  const handleSubmit = () => {
    onSubmit?.({ ...interviewInfoValues, ...interviewScheduleValues })
  }

  if (step === 'schedule') {
    return (
      <InterviewScheduleContent
        values={interviewScheduleValues}
        onChange={setInterviewScheduleValues}
        onPrev={() => onStepChange('info')}
        onNext={handleSubmit}
        isSubmitting={isSubmitting}
        pastOnly={pastOnly}
      />
    )
  }

  return (
    <InterviewInfoContent
      values={interviewInfoValues}
      onChange={setInterviewInfoValues}
      onNext={() => onStepChange('schedule')}
    />
  )
}
