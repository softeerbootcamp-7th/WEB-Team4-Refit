import { useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  getGetDashboardHeadlineQueryKey,
  getGetMyProfileInfoQueryKey,
  useAgreeToTerms,
  useGetAllJobCategories,
  useGetIndustries,
  useGetMyProfileInfo,
  useUpdateMyProfile,
} from '@/apis'
import type { FormValues, SaveFeedback } from '@/features/dashboard/my-page/components'

const FORM_OPTIONS_STALE_TIME = 60 * 60 * 1000

const EMPTY_FORM_VALUES: FormValues = {
  nickname: '',
  industryId: '',
  jobCategoryId: '',
  isAgreedToTerms: false,
}

const normalizeFormValues = (values: FormValues): FormValues => ({
  ...values,
  nickname: values.nickname.trim(),
})

const hasProfileFieldsChanged = (current: FormValues, initial: FormValues): boolean => {
  return (
    current.nickname !== initial.nickname ||
    current.industryId !== initial.industryId ||
    current.jobCategoryId !== initial.jobCategoryId
  )
}

const toFormValues = (profile?: {
  nickname?: string
  industryId?: number
  jobCategoryId?: number
  isAgreedToTerms?: boolean
}): FormValues => {
  return {
    nickname: profile?.nickname ?? '',
    industryId: profile?.industryId !== undefined ? String(profile.industryId) : '',
    jobCategoryId: profile?.jobCategoryId !== undefined ? String(profile.jobCategoryId) : '',
    isAgreedToTerms: profile?.isAgreedToTerms ?? false,
  }
}

export function useMyPageProfile() {
  const queryClient = useQueryClient()

  const [draftValues, setDraftValues] = useState<FormValues | null>(null)
  const [savedValues, setSavedValues] = useState<FormValues | null>(null)
  const [saveFeedback, setSaveFeedback] = useState<SaveFeedback | null>(null)
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false)

  const { data: profileValues, isLoading: isProfileLoading } = useGetMyProfileInfo({
    query: {
      select: (response) => toFormValues(response.result),
    },
  })
  const { data: industries, isLoading: isIndustriesLoading } = useGetIndustries({
    query: { staleTime: FORM_OPTIONS_STALE_TIME },
  })
  const { data: jobCategories, isLoading: isJobCategoriesLoading } = useGetAllJobCategories({
    query: { staleTime: FORM_OPTIONS_STALE_TIME },
  })

  const industryOptions = useMemo(
    () =>
      (industries?.result ?? []).map((item) => ({
        value: String(item.industryId),
        label: item.industryName,
      })),
    [industries?.result],
  )
  const jobOptions = useMemo(
    () =>
      (jobCategories?.result ?? []).map((item) => ({
        value: String(item.jobCategoryId),
        label: item.jobCategoryName,
      })),
    [jobCategories?.result],
  )

  const { mutateAsync: updateMyProfile, isPending: isProfileUpdating } = useUpdateMyProfile()
  const { mutateAsync: agreeToTerms, isPending: isAgreeingToTerms } = useAgreeToTerms()

  const baselineValues = savedValues ?? profileValues ?? EMPTY_FORM_VALUES
  const normalizedInitialValues = normalizeFormValues(baselineValues)
  const normalizedCurrentValues = normalizeFormValues(draftValues ?? baselineValues)

  const isPageLoading = (isProfileLoading && !profileValues) || isIndustriesLoading || isJobCategoriesLoading
  const isSaving = isProfileUpdating || isAgreeingToTerms
  const isNicknameValid = normalizedCurrentValues.nickname.length > 0 && normalizedCurrentValues.nickname.length <= 20
  const isFormValid =
    isNicknameValid && normalizedCurrentValues.industryId !== '' && normalizedCurrentValues.jobCategoryId !== ''

  const hasProfileChanged = hasProfileFieldsChanged(normalizedCurrentValues, normalizedInitialValues)
  const isTermsNewlyAgreed = !normalizedInitialValues.isAgreedToTerms && normalizedCurrentValues.isAgreedToTerms
  const hasChanges = hasProfileChanged || isTermsNewlyAgreed
  const isSaveDisabled = isPageLoading || isSaving || !isFormValid || !hasChanges

  const updateDraft = (updater: (current: FormValues) => FormValues) => {
    setSaveFeedback(null)
    setDraftValues((prev) => updater(prev ?? baselineValues))
  }

  const handleNicknameChange = (value: string) => {
    updateDraft((current) => ({ ...current, nickname: value }))
  }

  const handleIndustryChange = (value: string) => {
    updateDraft((current) => ({ ...current, industryId: value }))
  }

  const handleJobCategoryChange = (value: string) => {
    updateDraft((current) => ({ ...current, jobCategoryId: value }))
  }

  const handleTermsChange = (checked: boolean) => {
    updateDraft((current) => ({ ...current, isAgreedToTerms: checked }))
  }

  const handleOpenTermsModal = () => {
    setIsTermsModalOpen(true)
  }

  const handleCloseTermsModal = () => {
    setIsTermsModalOpen(false)
  }

  const handleSave = async () => {
    if (isSaveDisabled) return

    setSaveFeedback(null)

    const industryId = Number(normalizedCurrentValues.industryId)
    const jobCategoryId = Number(normalizedCurrentValues.jobCategoryId)
    if (Number.isNaN(industryId) || Number.isNaN(jobCategoryId)) {
      setSaveFeedback({ tone: 'error', message: '산업군과 직군을 다시 선택해 주세요.' })
      return
    }

    try {
      if (hasProfileChanged) {
        await updateMyProfile({
          data: {
            nickname: normalizedCurrentValues.nickname,
            industryId,
            jobCategoryId,
          },
        })
      }

      if (isTermsNewlyAgreed) {
        await agreeToTerms()
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getGetMyProfileInfoQueryKey() }),
        queryClient.invalidateQueries({ queryKey: getGetDashboardHeadlineQueryKey() }),
      ])

      setSavedValues(normalizedCurrentValues)
      setDraftValues(null)
      setSaveFeedback({ tone: 'success', message: '변경사항이 저장되었습니다.' })
    } catch (error) {
      console.error(error)
      setSaveFeedback({ tone: 'error', message: '저장에 실패했습니다. 잠시 후 다시 시도해 주세요.' })
    }
  }

  return {
    formProps: {
      values: normalizedCurrentValues,
      initialValues: normalizedInitialValues,
      industryOptions,
      jobOptions,
      saveFeedback,
      isPageLoading,
      isSaving,
      isIndustriesLoading,
      isJobCategoriesLoading,
      isSaveDisabled,
      onNicknameChange: handleNicknameChange,
      onIndustryChange: handleIndustryChange,
      onJobCategoryChange: handleJobCategoryChange,
      onTermsChange: handleTermsChange,
      onOpenTermsModal: handleOpenTermsModal,
      onSave: () => {
        void handleSave()
      },
    },
    isTermsModalOpen,
    closeTermsModal: handleCloseTermsModal,
  }
}
