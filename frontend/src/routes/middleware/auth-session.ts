export type AuthSessionStatus = 'unknown' | 'authenticated' | 'signup_required' | 'unauthenticated'

let authSessionStatus: AuthSessionStatus = 'unknown'

export const getAuthSessionStatus = (): AuthSessionStatus => authSessionStatus

export const markAuthenticated = (): void => {
  authSessionStatus = 'authenticated'
}

export const markUnauthenticated = (): void => {
  authSessionStatus = 'unauthenticated'
}

export const markSignupRequired = (): void => {
  authSessionStatus = 'signup_required'
}

export const resetAuthSessionStatus = (): void => {
  authSessionStatus = 'unknown'
}
