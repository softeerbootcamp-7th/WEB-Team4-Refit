import { useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { Logo } from '@/shared/assets'
import { Button } from '@/shared/components'
import { ROUTES } from '@/shared/constants/routes'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const status = searchParams.get('status')
  const nickname = searchParams.get('nickname') ?? ''
  const profileImageUrl = searchParams.get('profileImageUrl') ?? ''

  useEffect(() => {
    if (!status) {
      if (window.opener) {
        window.close()
      } else {
        navigate(ROUTES.SIGNIN, { replace: true })
      }
      return
    }

    // 팝업으로 열렸을 때: 부모 창에 메시지 전송 후 팝업 닫기
    if (window.opener) {
      window.opener.postMessage({ type: 'oauth-callback', status, nickname, profileImageUrl }, window.location.origin)
      window.close()
      return
    }

    // 일반 페이지(리다이렉트)로 열렸을 때: 기존 리다이렉트 동작
    if (status === 'loginSuccess') {
      navigate(ROUTES.DASHBOARD, { replace: true })
      return
    }
    if (status === 'signUpRequired') {
      navigate(ROUTES.SIGNUP, { state: { nickname, profileImageUrl }, replace: true })
    }
  }, [status, nickname, profileImageUrl, navigate])

  // 모든 분기에서 리다이렉트하거나, 알 수 없는 status만 UI 표시
  if (!status || status === 'loginSuccess' || status === 'signUpRequired') {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 py-6 sm:px-6 sm:py-8">
      <div className="bg-gray-white flex w-full max-w-118 flex-col items-center rounded-2xl px-6 py-8 shadow-md sm:rounded-4xl sm:px-10 sm:py-12">
        <div className="flex w-full flex-col items-center gap-6 sm:gap-8">
          <Link
            to={ROUTES.HOME}
            className="rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            aria-label="홈으로"
          >
            <Logo className="h-7 w-auto text-orange-500 sm:h-8" aria-hidden />
          </Link>
          <div className="flex flex-col items-center gap-4">
            <h1 className="headline-m-bold text-center text-gray-900">로그인 결과</h1>
            <p className="body-l-regular text-center text-gray-900">상태: {status}</p>
          </div>
          <Button
            type="button"
            variant="fill-orange-500"
            size="lg"
            radius="default"
            className="w-full"
            onClick={() => navigate(ROUTES.DASHBOARD)}
          >
            대시보드로 이동
          </Button>
        </div>
      </div>
    </div>
  )
}
