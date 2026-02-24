import { Link } from 'react-router'
import { useGoogleOAuthLogin } from '@/features/signin/_index/hooks'
import { ROUTES } from '@/routes/routes'
import { GoogleIcon, Logo } from '@/ui/assets'
import { Button } from '@/ui/components'

const DESKTOP_OAUTH_REDIRECT = {
  signUp: ROUTES.SIGNUP,
  success: ROUTES.DASHBOARD,
} as const

export default function SigninPage() {
  const { handleGoogleLogin, isFetching } = useGoogleOAuthLogin({ redirectTo: DESKTOP_OAUTH_REDIRECT })

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 py-6 sm:px-6 sm:py-8">
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
            <h1 className="headline-m-bold text-center text-gray-900">로그인</h1>
            <p className="body-l-regular text-center text-gray-900">SNS로 간편하게 로그인하고 서비스를 즐겨 보세요!</p>
          </div>
          <Button
            type="button"
            variant="outline-gray-100"
            size="lg"
            radius="default"
            className="bg-gray-white flex w-full items-center justify-center gap-2.5 border border-gray-200 text-gray-900"
            onClick={handleGoogleLogin}
            disabled={isFetching}
          >
            <GoogleIcon className="h-5 w-5 shrink-0" aria-hidden />
            <span className="body-l-medium">{isFetching ? '로그인 중...' : 'Google 계정으로 로그인'}</span>
          </Button>
        </div>
      </div>
    </main>
  )
}
