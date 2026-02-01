import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { SpeakingChickIcon } from '@/assets'
import { ROUTES } from '@/constants/routes'
import Button from '@/shared/Button'

function fadeUpClass(isVisible: boolean, delay: string) {
  const motion = isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
  return `transform transition-all duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${delay} ${motion}`
}

export default function MobilePage() {
  const navigate = useNavigate()

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="from-orange-050 via-gray-white flex flex-1 flex-col items-center justify-center bg-gradient-to-b to-gray-100 px-6">
      <div className="mx-auto flex w-full max-w-md flex-col items-center">
        <div className={`mb-8 flex justify-center ${fadeUpClass(isVisible, 'delay-0')}`} aria-hidden>
          <SpeakingChickIcon className="h-48 w-48 max-w-[240px]" />
        </div>

        <div className="headline-m-bold text-center text-gray-900">
          <h1 className={`mb-2 ${fadeUpClass(isVisible, 'delay-100')}`}>방금 본 면접,</h1>
          <h1 className={`mb-16 ${fadeUpClass(isVisible, 'delay-200')}`}>바로 기록해볼까요?</h1>
        </div>

        <div className={`w-full ${fadeUpClass(isVisible, 'delay-500')}`}>
          <Button
            variant="fill-orange-500"
            size="md"
            className="w-full cursor-pointer"
            onClick={() => navigate(ROUTES.MOBILE_UNRECORDED)}
          >
            면접 기록 시작하기
          </Button>
        </div>
      </div>
    </div>
  )
}
