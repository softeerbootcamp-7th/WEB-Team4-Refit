import { createContext, useContext } from 'react'
import type { ScheduleModalStep } from '@/features/dashboard/_index/constants/interviewCalendar'

interface ScheduleModalContextValue {
  isOpen: boolean
  step: ScheduleModalStep
  openModal: () => void
  closeModal: () => void
  setStep: (step: ScheduleModalStep) => void
}

export const ScheduleModalContext = createContext<ScheduleModalContextValue | null>(null)

export function useScheduleModal() {
  return useContext(ScheduleModalContext)
}
