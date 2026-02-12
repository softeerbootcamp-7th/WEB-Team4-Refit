import { redirect } from 'react-router'
import { ROUTES } from '@/routes/routes'

export const isMobileDevice = (): boolean => {
  if (typeof navigator === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export async function mobileRedirectMiddleware(_args: { request: Request }, next: () => Promise<unknown>) {
  if (isMobileDevice()) {
    throw redirect(ROUTES.MOBILE)
  }
  return next()
}
