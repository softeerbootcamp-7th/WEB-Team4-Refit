import { createContext, useContext, useState } from 'react'
import type { ScheduleModalStep } from '@/pages/dashboard/_index/constants/interviewCalendar'

interface ScheduleModalContextValue {
  isOpen: boolean
  step: ScheduleModalStep
  openModal: () => void
  closeModal: () => void
  setStep: (step: ScheduleModalStep) => void
}

const ScheduleModalContext = createContext<ScheduleModalContextValue | null>(null)

export function ScheduleModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<ScheduleModalStep>('info')

  const openModal = () => {
    setIsOpen(true)
    setStep('info')
  }

  const closeModal = () => {
    setIsOpen(false)
    setStep('info')
  }

  return (
    <ScheduleModalContext.Provider value={{ isOpen, step, openModal, closeModal, setStep }}>
      {children}
    </ScheduleModalContext.Provider>
  )
}

export function useScheduleModal() {
  return useContext(ScheduleModalContext)
}
