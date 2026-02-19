import { useState } from 'react'
import { useNavigate } from 'react-router'
import { InterviewCreateRequestInterviewType, useCreateInterview } from '@/apis'
import Modal from '@/designs/components/modal'
import { ScheduleModalContent } from '@/features/dashboard/_index/components/schedule-modal-content/ScheduleModalContent'
import type { ScheduleFormSubmitValues } from '@/features/dashboard/_index/components/schedule-modal-content/ScheduleModalContent'
import { SCHEDULE_MODAL_STEP_CONFIG } from '@/features/dashboard/_index/constants/interviewCalendar'
import type { ScheduleModalStep } from '@/features/dashboard/_index/constants/interviewCalendar'
import { ROUTES } from '@/routes/routes'

interface InstantRecordModalProps {
  open: boolean
  onClose: () => void
}

const toStartAt = (date: string, time: string) => {
  if (!date || !time) return null
  const localDateTime = `${date}T${time}:00`
  const parsed = new Date(localDateTime)
  if (Number.isNaN(parsed.getTime())) return null
  return localDateTime
}

export default function InstantRecordModal({ open, onClose }: InstantRecordModalProps) {
  const navigate = useNavigate()
  const [step, setStep] = useState<ScheduleModalStep>('info')

  const { mutate: createInterview, isPending } = useCreateInterview({
    mutation: {
      onSuccess: (response) => {
        const interviewId = response.result?.interviewId
        onClose()
        setStep('info')
        if (interviewId != null) {
          void navigate(ROUTES.RECORD.replace(':interviewId', String(interviewId)))
        }
      },
    },
  })

  const config = SCHEDULE_MODAL_STEP_CONFIG[step]
  const modalTitle = '면접 데이터 추가'

  const handleClose = () => {
    onClose()
    setStep('info')
  }

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
      data: { startAt, interviewType, companyName, industryId, jobCategoryId, jobRole },
    })
  }

  return (
    <Modal open={open} onClose={handleClose} title={modalTitle} description={config.description}>
      <ScheduleModalContent step={step} onStepChange={setStep} onSubmit={handleSubmit} isSubmitting={isPending} pastOnly />
    </Modal>
  )
}
