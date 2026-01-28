export const ROUTES = {
  HOME: '/',
  SIGNUP: '/signup',
  SIGNIN: '/signin',
  TERMS: '/terms',

  DASHBOARD: '/dashboard',
  DASHBOARD_MY_INTERVIEWS: '/dashboard/my-interviews',
  DASHBOARD_TREND_QUESTIONS: '/dashboard/trend-questions',
  DASHBOARD_MY_COLLECTIONS: '/dashboard/my-collections',
  DASHBOARD_COLLECTION_DETAIL: '/dashboard/my-collections/:folderId',

  RECORD: '/record/:interviewId',
  RECORD_CONFIRM: '/record/:interviewId/confirm',
  RECORD_LINK: '/record/:interviewId/link',

  RETRO: '/retro/:interviewId',
  RETRO_QUESTION: '/retro/:interviewId/:questionId',
  RETRO_DETAILS: '/retro/:interviewId/details',
} as const
