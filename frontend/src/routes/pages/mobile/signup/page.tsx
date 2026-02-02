import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ROUTES } from '@/constants/routes'
import { INDUSTRY_OPTIONS, JOB_OPTIONS } from '@/constants/signup'
import Button from '@/shared/Button'
import Combobox from '@/shared/combobox'
import Input from '@/shared/input'

export default function MobileSignupPage() {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState('')
  const [industry, setIndustry] = useState('')
  const [job, setJob] = useState('')

  const isFormValid = nickname.length > 0 && nickname.length <= 5 && industry !== '' && job !== ''

  return (
    <div className="flex h-full flex-col px-5 pb-9">
      <div className="flex-1">
        <h1 className="title-l-bold mt-[18px] mb-10 text-gray-800">회원가입</h1>

        <div className="space-y-10">
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
      </div>

      <div className="mt-8">
        <Button
          variant="fill-orange-500"
          size="md"
          className="w-full"
          disabled={!isFormValid}
          onClick={() => navigate(ROUTES.MOBILE_RECORD)}
        >
          시작하기
        </Button>
      </div>
    </div>
  )
}
