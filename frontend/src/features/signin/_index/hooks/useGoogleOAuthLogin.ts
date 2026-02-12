import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useBuildOAuth2LoginUrl } from '@/apis'

const POPUP_NAME = 'google-oauth-login'
const POPUP_WIDTH = 500
const POPUP_HEIGHT = 600

type UseGoogleOAuthLoginOptions = {
  redirectTo: { signUp: string; success: string }
}

export function useGoogleOAuthLogin(options: UseGoogleOAuthLoginOptions) {
  const navigate = useNavigate()
  const { signUp: signUpPath, success: successPath } = options.redirectTo
  const { refetch, isFetching } = useBuildOAuth2LoginUrl(
    { env: import.meta.env.VITE_APP_ENV },
    { query: { enabled: false } },
  )

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.data?.type !== 'oauth-callback') return
      const { status, nickname, profileImageUrl } = event.data
      if (status === 'loginSuccess') {
        navigate(successPath, { replace: true })
      } else if (status === 'signUpRequired') {
        navigate(signUpPath, { state: { nickname, profileImageUrl }, replace: true })
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [navigate, signUpPath, successPath])

  const handleGoogleLogin = async () => {
    const left = window.screenX + (window.outerWidth - POPUP_WIDTH) / 2
    const top = window.screenY + (window.outerHeight - POPUP_HEIGHT) / 2
    const oauthWindow = window.open(
      'about:blank',
      POPUP_NAME,
      `width=${POPUP_WIDTH},height=${POPUP_HEIGHT},left=${left},top=${top},scrollbars=yes`,
    )

    if (!oauthWindow) {
      return
    }

    const { data } = await refetch()
    const loginUrl = data?.result?.oAuth2LoginUrl

    if (loginUrl) {
      oauthWindow.location.href = loginUrl
    } else {
      oauthWindow.close()
    }
  }

  return { handleGoogleLogin, isFetching }
}
