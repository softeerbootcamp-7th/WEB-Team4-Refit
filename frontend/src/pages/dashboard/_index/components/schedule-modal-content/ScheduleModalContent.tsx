import { useState } from 'react'
import { InterviewInfoContent } from '@/pages/dashboard/_index/components/schedule-modal-content/InterviewInfoContent'
import type { InterviewInfoFormValues } from '@/pages/dashboard/_index/components/schedule-modal-content/InterviewInfoContent'
import { InterviewScheduleContent } from '@/pages/dashboard/_index/components/schedule-modal-content/InterviewScheduleContent'
import type { InterviewScheduleFormValues } from '@/pages/dashboard/_index/components/schedule-modal-content/InterviewScheduleContent'

export interface ScheduleFormSubmitValues extends InterviewInfoFormValues, InterviewScheduleFormValues {}

export interface ScheduleModalContentProps {
  step: 1 | 2
  onStepChange: (step: 1 | 2) => void
  onSubmit?: (values: ScheduleFormSubmitValues) => void
}

export function ScheduleModalContent({ step, onStepChange, onSubmit }: ScheduleModalContentProps) {
  const [interviewInfoValues, setInterviewInfoValues] = useState<InterviewInfoFormValues>({
    companyName: '',
    industry: '',
    jobTitle: '',
  })
  const [interviewScheduleValues, setInterviewScheduleValues] = useState<InterviewScheduleFormValues>({
    interviewType: '',
    interviewDate: '',
    interviewTime: '',
  })

  const handleSubmit = () => {
    onSubmit?.({ ...interviewInfoValues, ...interviewScheduleValues })
  }

  if (step === 2) {
    return (
      <InterviewScheduleContent
        values={interviewScheduleValues}
        onChange={setInterviewScheduleValues}
        onPrev={() => onStepChange(1)}
        onNext={handleSubmit}
      />
    )
  }

  return (
    <InterviewInfoContent
      values={interviewInfoValues}
      onChange={setInterviewInfoValues}
      onNext={() => onStepChange(2)}
    />
  )
}
