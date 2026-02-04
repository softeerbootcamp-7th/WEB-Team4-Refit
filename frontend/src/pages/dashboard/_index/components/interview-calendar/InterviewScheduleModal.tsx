import { ScheduleModalContent } from '@/pages/dashboard/_index/components/schedule-modal-content/ScheduleModalContent'
import type { ScheduleFormSubmitValues } from '@/pages/dashboard/_index/components/schedule-modal-content/ScheduleModalContent'
import { SCHEDULE_MODAL_STEP_CONFIG } from '@/pages/dashboard/_index/constants/interviewCalendar'
import { useScheduleModal } from '@/pages/dashboard/_index/contexts/ScheduleModalContext'
import Modal from '@/shared/components/modal'

export default function InterviewScheduleModal() {
  const modalContext = useScheduleModal()
  if (!modalContext) return null

  const { isOpen, closeModal, step, setStep } = modalContext
  const config = SCHEDULE_MODAL_STEP_CONFIG[step]

  const handleSubmit = (values: ScheduleFormSubmitValues) => {
    console.log('Schedule Submitted:', values)
    closeModal()
  }

  return (
    <Modal open={isOpen} onClose={closeModal} title={config.title} description={config.description}>
      <ScheduleModalContent step={step} onStepChange={setStep} onSubmit={handleSubmit} />
    </Modal>
  )
}
