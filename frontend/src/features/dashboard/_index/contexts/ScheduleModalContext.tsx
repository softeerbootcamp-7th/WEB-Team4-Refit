import { createContext, useContext } from 'react'
import type { ScheduleModalStep } from '@/features/dashboard/_index/constants/interviewCalendar'

export interface ScheduleModalInitialValues {
  interviewDate: string
  interviewTime: string
}

export interface ScheduleModalOpenOptions {
  interviewDate?: string
  interviewTime?: string
  pastOnly?: boolean
}

interface ScheduleModalContextValue {
  isOpen: boolean
  step: ScheduleModalStep
  pastOnly: boolean
  initialScheduleValues: ScheduleModalInitialValues
  openModal: (options?: ScheduleModalOpenOptions) => void
  closeModal: () => void
  setStep: (step: ScheduleModalStep) => void
}

export const ScheduleModalContext = createContext<ScheduleModalContextValue | null>(null)

export function useScheduleModal() {
  return useContext(ScheduleModalContext)
}
