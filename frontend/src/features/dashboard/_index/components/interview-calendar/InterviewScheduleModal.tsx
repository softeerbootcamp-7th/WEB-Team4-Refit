import { useCreateInterview } from '@/apis'
import Modal from '@/designs/components/modal'
import { ScheduleModalContent } from '@/features/dashboard/_index/components/schedule-modal-content/ScheduleModalContent'
import type { ScheduleFormSubmitValues } from '@/features/dashboard/_index/components/schedule-modal-content/ScheduleModalContent'
import { SCHEDULE_MODAL_STEP_CONFIG } from '@/features/dashboard/_index/constants/interviewCalendar'
import { useScheduleModal } from '@/features/dashboard/_index/contexts/ScheduleModalContext'
import type { InterviewCreateRequestInterviewType } from '@/apis/generated/refit-api.schemas'

const toStartAt = (date: string, time: string) => {
  const startAt = new Date(`${date}T${time}:00`)
  if (Number.isNaN(startAt.getTime())) return null
  return startAt.toISOString()
}

export default function InterviewScheduleModal() {
  const modalContext = useScheduleModal()
  if (!modalContext) return null

  const { isOpen, closeModal, step, setStep } = modalContext
  const config = SCHEDULE_MODAL_STEP_CONFIG[step]
  const { mutate: createInterview, isPending } = useCreateInterview({
    mutation: {
      onSuccess: () => {
        closeModal()
      },
    },
  })

  const handleSubmit = (values: ScheduleFormSubmitValues) => {
    const companyName = values.companyName.trim()
    const industryId = Number(values.industryId)
    const jobCategoryId = Number(values.jobCategoryId)
    const startAt = toStartAt(values.interviewDate, values.interviewTime)
    const interviewType = values.interviewType as InterviewCreateRequestInterviewType
    const jobRole = values.jobRole.trim()

    if (!companyName) return
    if (!jobRole) return
    if (Number.isNaN(industryId) || Number.isNaN(jobCategoryId)) return
    if (!startAt) return

    createInterview({
      data: {
        startAt,
        interviewType,
        companyName,
        industryId,
        jobCategoryId,
        jobRole,
      },
    })
  }

  return (
    <Modal open={isOpen} onClose={closeModal} title={config.title} description={config.description}>
      <ScheduleModalContent step={step} onStepChange={setStep} onSubmit={handleSubmit} isSubmitting={isPending} />
    </Modal>
  )
}
