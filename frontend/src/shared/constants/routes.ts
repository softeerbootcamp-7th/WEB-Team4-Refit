export const ROUTES = {
  HOME: '/',
  SIGNUP: '/signup',
  SIGNIN: '/signin',
  TERMS: '/terms',

  DASHBOARD: '/dashboard',
  DASHBOARD_MY_INTERVIEWS: '/dashboard/my-interviews',
  DASHBOARD_TREND_QUESTIONS: '/dashboard/trend-questions',
  DASHBOARD_MY_COLLECTIONS: '/dashboard/my-collections',
  DASHBOARD_HARD_QUESTIONS: '/dashboard/my-collections/hard',
  DASHBOARD_COLLECTION_DETAIL: '/dashboard/my-collections/:folderId',

  MOBILE: '/mobile',
  MOBILE_SIGNUP: '/mobile/signup',
  MOBILE_UNRECORDED: '/mobile/unrecorded',
  MOBILE_RECORD: '/mobile/record/:interviewId',

  RECORD: '/record/:interviewId',
  RECORD_CONFIRM: '/record/:interviewId/confirm',
  RECORD_LINK: '/record/:interviewId/link',

  RETRO: '/retro/:interviewId',
  RETRO_QUESTION: '/retro/:interviewId',
  RETRO_DETAILS: '/retro/:interviewId/details',
} as const
