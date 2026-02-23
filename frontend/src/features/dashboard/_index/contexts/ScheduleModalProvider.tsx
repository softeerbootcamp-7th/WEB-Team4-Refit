import { useState } from 'react'
import type { ScheduleModalStep } from '@/features/dashboard/_index/constants/interviewCalendar'
import type {
  ScheduleModalInitialValues,
  ScheduleModalOpenOptions,
} from '@/features/dashboard/_index/contexts/ScheduleModalContext'
import { ScheduleModalContext } from '@/features/dashboard/_index/contexts/ScheduleModalContext'

const EMPTY_INITIAL_SCHEDULE_VALUES: ScheduleModalInitialValues = {
  interviewDate: '',
  interviewTime: '',
}

export function ScheduleModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<ScheduleModalStep>('info')
  const [pastOnly, setPastOnly] = useState(false)
  const [initialScheduleValues, setInitialScheduleValues] = useState<ScheduleModalInitialValues>(
    EMPTY_INITIAL_SCHEDULE_VALUES,
  )

  const openModal = (options?: ScheduleModalOpenOptions) => {
    setIsOpen(true)
    setStep('info')
    setPastOnly(Boolean(options?.pastOnly))
    setInitialScheduleValues({
      interviewDate: options?.interviewDate ?? '',
      interviewTime: options?.interviewTime ?? '',
    })
  }

  const closeModal = () => {
    setIsOpen(false)
    setStep('info')
    setPastOnly(false)
    setInitialScheduleValues(EMPTY_INITIAL_SCHEDULE_VALUES)
  }

  return (
    <ScheduleModalContext.Provider
      value={{ isOpen, step, pastOnly, initialScheduleValues, openModal, closeModal, setStep }}
    >
      {children}
    </ScheduleModalContext.Provider>
  )
}
