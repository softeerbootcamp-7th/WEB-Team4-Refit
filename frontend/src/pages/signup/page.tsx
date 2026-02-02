import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Logo } from '@/shared/assets'
import { Button, Combobox, Input } from '@/shared/components'
import { ROUTES } from '@/shared/constants/routes'
import { INDUSTRY_OPTIONS, JOB_OPTIONS } from '@/shared/constants/signup'

export default function SignupPage() {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState('')
  const [industry, setIndustry] = useState('')
  const [job, setJob] = useState('')

  const isFormValid = nickname.length > 0 && nickname.length <= 5 && industry !== '' && job !== ''

  const handleSubmit = () => {
    if (!isFormValid) return
    navigate(ROUTES.DASHBOARD)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 py-8 sm:px-6 sm:py-12">
      <div className="bg-gray-white w-full max-w-120 overflow-hidden rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] sm:rounded-3xl">
        <div className="border-gray-150 flex items-center gap-2 border-b px-6 py-4 sm:px-8 sm:py-5">
          <div
            className="rounded-lg text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            aria-label="리핏 로고"
          >
            <Logo className="h-6 w-auto sm:h-7" aria-hidden />
          </div>
        </div>

        <div className="flex flex-col px-6 py-6 sm:px-8 sm:py-8">
          <h1 className="headline-s-bold mb-2 text-gray-900">기본 정보 입력</h1>
          <p className="body-m-regular mb-8 text-gray-600">주로 지원하시는 산업과 직군을 입력해주세요.</p>

          <div className="flex flex-col gap-5">
            <Input
              label="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="5글자 이내로 입력해주세요"
              maxLength={5}
              required
            />
            <Combobox
              label="관심 산업군"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              options={INDUSTRY_OPTIONS}
              placeholder="주로 지원하시는 산업군을 알려주세요"
              required
            />
            <Combobox
              label="관심 직군"
              value={job}
              onChange={(e) => setJob(e.target.value)}
              options={JOB_OPTIONS}
              placeholder="주로 지원하시는 직군을 알려주세요"
              required
            />
          </div>

          <Button
            type="button"
            variant="fill-orange-500"
            size="lg"
            className="mt-8 w-full"
            disabled={!isFormValid}
            onClick={handleSubmit}
          >
            시작하기
          </Button>
        </div>
      </div>
    </div>
  )
}
