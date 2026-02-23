import { useQueryClient } from '@tanstack/react-query'
import {
  getGetDashboardCalendarInterviewsQueryKey,
  getGetDashboardHeadlineQueryKey,
  getGetDebriefIncompletedInterviewsQueryKey,
  getGetUpcomingInterviewsQueryKey,
  InterviewCreateRequestInterviewType,
  useCreateInterview,
} from '@/apis'
import { ScheduleModalContent } from '@/features/dashboard/_index/components/schedule-modal-content/ScheduleModalContent'
import type { ScheduleFormSubmitValues } from '@/features/dashboard/_index/components/schedule-modal-content/ScheduleModalContent'
import { SCHEDULE_MODAL_STEP_CONFIG } from '@/features/dashboard/_index/constants/interviewCalendar'
import { useScheduleModal } from '@/features/dashboard/_index/contexts/ScheduleModalContext'
import Modal from '@/ui/components/modal'

const toStartAt = (date: string, time: string) => {
  if (!date || !time) return null

  const localDateTime = `${date}T${time}:00`
  const parsed = new Date(localDateTime)
  if (Number.isNaN(parsed.getTime())) return null

  return localDateTime
}

export default function InterviewScheduleModal() {
  const modalContext = useScheduleModal()
  const queryClient = useQueryClient()
  const { mutate: createInterview, isPending } = useCreateInterview({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: getGetDashboardCalendarInterviewsQueryKey() })
        void queryClient.invalidateQueries({ queryKey: getGetDashboardHeadlineQueryKey() })
        void queryClient.invalidateQueries({ queryKey: getGetDebriefIncompletedInterviewsQueryKey() })
        void queryClient.invalidateQueries({ queryKey: getGetUpcomingInterviewsQueryKey() })
        modalContext?.closeModal()
      },
    },
  })
  if (!modalContext) return null

  const { isOpen, closeModal, step, setStep, pastOnly, initialScheduleValues } = modalContext
  const config = SCHEDULE_MODAL_STEP_CONFIG[step]

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
      <ScheduleModalContent
        step={step}
        onStepChange={setStep}
        onSubmit={handleSubmit}
        isSubmitting={isPending}
        pastOnly={pastOnly}
        initialScheduleValues={initialScheduleValues}
      />
    </Modal>
  )
}
