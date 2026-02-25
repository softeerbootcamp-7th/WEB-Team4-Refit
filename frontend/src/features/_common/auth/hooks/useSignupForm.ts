import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useGetAllJobCategories, useGetIndustries, useSignUp } from '@/apis'
import { SIGNUP_OPTIONS_STALE_TIME } from '@/constants/queryCachePolicy'
import { markAuthenticated } from '@/routes/middleware/auth-session'

type SignupLocationState = { nickname?: string; profileImageUrl?: string } | null
type UseSignupFormOptions = {
  redirectTo: string
}

export function useSignupForm(options: UseSignupFormOptions) {
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state ?? null) as SignupLocationState
  const { redirectTo } = options

  const [nickname, setNickname] = useState(state?.nickname ?? '')
  const [industry, setIndustry] = useState('')
  const [job, setJob] = useState('')

  const { data: industries, isLoading: isIndustriesLoading } = useGetIndustries({
    query: { staleTime: SIGNUP_OPTIONS_STALE_TIME },
  })
  const { data: jobCategories, isLoading: isJobCategoriesLoading } = useGetAllJobCategories({
    query: { staleTime: SIGNUP_OPTIONS_STALE_TIME },
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
  const isIndustryOptionsLoading = isIndustriesLoading
  const isJobOptionsLoading = isJobCategoriesLoading
  const isOptionsLoading = isIndustryOptionsLoading || isJobOptionsLoading

  const { mutate: signUp, isPending } = useSignUp({
    mutation: {
      onSuccess: () => {
        markAuthenticated()
        navigate(redirectTo)
      },
    },
  })

  const isFormValid = nickname.length > 0 && nickname.length <= 20 && industry !== '' && job !== ''

  const handleSubmit = () => {
    if (!isFormValid) return
    const industryId = Number(industry)
    const jobCategoryId = Number(job)
    if (Number.isNaN(industryId) || Number.isNaN(jobCategoryId)) return
    signUp({
      params: { originType: import.meta.env.VITE_APP_ENV },
      data: {
        nickname,
        profileImageUrl: state?.profileImageUrl ?? '',
        industryId,
        jobCategoryId,
      },
    })
  }

  return {
    nickname,
    setNickname,
    industry,
    setIndustry,
    industryOptions,
    isIndustryOptionsLoading,
    job,
    setJob,
    jobOptions,
    isJobOptionsLoading,
    isFormValid,
    isOptionsLoading,
    isPending,
    handleSubmit,
  }
}
