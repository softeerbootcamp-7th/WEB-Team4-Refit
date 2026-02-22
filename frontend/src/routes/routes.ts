export const ROUTES = {
  HOME: '/',
  LANDING: '/landing',
  SIGNUP: '/signup',
  SIGNIN: '/signin',
  AUTH_CALLBACK: '/auth/callback',
  TERMS: '/terms',

  DASHBOARD: '/dashboard',
  DASHBOARD_MY_INTERVIEWS: '/dashboard/my-interviews',
  DASHBOARD_TREND_QUESTIONS: '/dashboard/trend-questions',
  DASHBOARD_MY_COLLECTIONS: '/dashboard/my-collections',
  DASHBOARD_MY_PAGE: '/dashboard/my-page',
  DASHBOARD_DIFFICULT_QUESTIONS: '/dashboard/my-collections/difficult-questions',
  DASHBOARD_COLLECTION_DETAIL: '/dashboard/my-collections/:folderId',

  MOBILE: '/mobile',
  MOBILE_SIGNUP: '/mobile/signup',
  MOBILE_UNRECORDED: '/mobile/unrecorded',
  MOBILE_RECORD: '/mobile/record/:interviewId',

  RECORD: '/record/:interviewId',
  RECORD_CONFIRM: '/record/:interviewId/confirm',
  RECORD_LINK: '/record/:interviewId/link',

  RETRO: '/retro/:interviewId',
  RETRO_DETAILS: '/retro/:interviewId/details',
} as const
