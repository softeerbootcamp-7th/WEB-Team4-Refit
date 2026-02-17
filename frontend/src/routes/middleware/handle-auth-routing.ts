import { redirect } from 'react-router'
import { reissue } from '@/apis/generated/auth-controller/auth-controller'
import {
  getAuthSessionStatus,
  markAuthenticated,
  markSignupRequired,
  markUnauthenticated,
  type AuthSessionStatus,
} from '@/routes/middleware/auth-session'
import { ROUTES } from '@/routes/routes'

export const handleAuthRouting = async (_args: { request: Request }, next: () => Promise<unknown>) => {
  const url = new URL(_args.request.url)
  const path = url.pathname

  /* 모든 사람에게 공개된 routes에 대해서는 auth check를 건너뜁니다. */
  if (isPublicRoute(path)) {
    return next()
  }

  /* 최초 진입 시나리오 */
  const authStatus = await validateAuthOnce()
  if (authStatus !== 'authenticated') {
    throw redirect(ROUTES.SIGNIN)
  }

  return next()
}

const isPublicRoute = (path: string): boolean => {
  const publicRoutes = [ROUTES.SIGNIN, ROUTES.SIGNUP, ROUTES.AUTH_CALLBACK, ROUTES.MOBILE]
  return publicRoutes.some((route) => path.startsWith(route))
}

let initialAuthCheckPromise: Promise<AuthSessionStatus> | null = null
const validateAuthOnce = async (): Promise<AuthSessionStatus> => {
  const sessionStatus = getAuthSessionStatus()
  if (sessionStatus !== 'unknown') return sessionStatus

  /* 
    Promise에 대한 in-flight 캐시
  */
  if (initialAuthCheckPromise) return initialAuthCheckPromise

  initialAuthCheckPromise = (async () => {
    try {
      const response = await reissue()
      const isNeedSignUp = response.result?.isNeedSignUp ?? true
      /* 
        isNeedSignUp이 false인 경우는 구글 가입 완료 && 서비스 회원가입 완료
        isNeedSignUp이 true인 경우는 구글 가입 완료 && 서비스 회원가입 미완료
      */
      if (isNeedSignUp === false) {
        markAuthenticated()
        return 'authenticated'
      }

      markSignupRequired()
      return 'signup_required'
    } catch (error) {
      markUnauthenticated()
      console.error(error)
      return 'unauthenticated'
    } finally {
      initialAuthCheckPromise = null
    }
  })()

  return initialAuthCheckPromise
}
