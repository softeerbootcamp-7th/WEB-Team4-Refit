import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useSignUp } from '@/apis'
import { INDUSTRY_OPTIONS, JOB_OPTIONS } from '@/constants/signup'
import { ROUTES } from '@/routes/routes'

type SignupLocationState = { nickname?: string; profileImageUrl?: string } | null

export function useSignupForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state ?? null) as SignupLocationState

  const [nickname, setNickname] = useState(state?.nickname ?? '')
  const [industry, setIndustry] = useState('')
  const [job, setJob] = useState('')

  const { mutate: signUp, isPending } = useSignUp({
    mutation: {
      onSuccess: () => {
        navigate(ROUTES.DASHBOARD)
      },
    },
  })

  const isFormValid = nickname.length > 0 && nickname.length <= 5 && industry !== '' && job !== ''

  const handleSubmit = () => {
    if (!isFormValid) return
    const industryOption = INDUSTRY_OPTIONS.find((o) => o.value === industry)
    const jobOption = JOB_OPTIONS.find((o) => o.value === job)
    if (!industryOption || !jobOption) return
    signUp({
      data: {
        // email 필드는 추후 백엔드에서 제거될 예정
        email: '',
        env: import.meta.env.VITE_APP_ENV ?? 'LOCAL',
        nickname,
        profileImageUrl: state?.profileImageUrl ?? '',
        industryId: industryOption.id,
        jobCategoryId: jobOption.id,
      },
    })
  }

  return {
    nickname,
    setNickname,
    industry,
    setIndustry,
    job,
    setJob,
    isFormValid,
    isPending,
    handleSubmit,
  }
}
