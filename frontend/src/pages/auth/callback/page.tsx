import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { resetAuthSessionStatus } from '@/routes/middleware/auth-session'
import { ROUTES } from '@/routes/routes'

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

    if (window.opener) {
      window.opener.postMessage({ type: 'oauth-callback', status, nickname, profileImageUrl }, window.location.origin)
      window.close()
      return
    }

    if (status === 'loginSuccess') {
      resetAuthSessionStatus()
      navigate(ROUTES.DASHBOARD, { replace: true })
      return
    }
    if (status === 'signUpRequired') {
      resetAuthSessionStatus()
      navigate(ROUTES.SIGNUP, { state: { nickname, profileImageUrl }, replace: true })
      return
    }

    navigate(ROUTES.SIGNIN, { replace: true })
  }, [status, nickname, profileImageUrl, navigate])

  return null
}
