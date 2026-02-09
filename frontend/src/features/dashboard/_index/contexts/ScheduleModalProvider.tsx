import { useState } from 'react'
import type { ScheduleModalStep } from '@/features/dashboard/_index/constants/interviewCalendar'
import { ScheduleModalContext } from '@/features/dashboard/_index/contexts/ScheduleModalContext'

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
