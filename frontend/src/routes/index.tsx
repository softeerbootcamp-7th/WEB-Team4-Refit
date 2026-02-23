import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'

import { DashboardLayout, MobileLayout } from '@/layouts'
import MainLayout from '@/layouts/MainLayout'
import {
  AuthCallbackPage,
  CollectionDetailPage,
  DashboardPage,
  DifficultQuestionPage,
  Forbidden,
  InterviewNotFound,
  MobilePage,
  MobileRecordPage,
  MobileSignupPage,
  MobileUnrecordedPage,
  MyCollectionsPage,
  MyInterviewsPage,
  MyPage,
  NotFound,
  RecordConfirmPage,
  RecordLinkPage,
  RecordPage,
  RetroDetailPage,
  RetroQuestionPage,
  SigninPage,
  SignupPage,
  TrendQuestionsPage,
} from '@/pages'
import InterviewRouteErrorBoundary from '@/routes/InterviewRouteErrorBoundary'
import { handleAuthRouting, HandleMobileRouting } from '@/routes/middleware'
import { ROUTES } from '@/routes/routes'

const getChildPath = (fullPath: string, rootPath: string): string => {
  return fullPath.replace(rootPath, '').replace(/^\//, '')
}

const router = createBrowserRouter([
  {
    middleware: [handleAuthRouting],
    children: [
      {
        path: ROUTES.HOME,
        middleware: [HandleMobileRouting],
        Component: () => <Navigate to={ROUTES.DASHBOARD} replace />,
      },
      { path: ROUTES.SIGNUP, Component: SignupPage, middleware: [HandleMobileRouting] },
      { path: ROUTES.SIGNIN, Component: SigninPage, middleware: [HandleMobileRouting] },
      { path: ROUTES.AUTH_CALLBACK, Component: AuthCallbackPage },
      {
        path: ROUTES.MOBILE,
        Component: MobileLayout,
        children: [
          { index: true, Component: MobilePage },
          {
            path: getChildPath(ROUTES.MOBILE_SIGNUP, ROUTES.MOBILE),
            Component: MobileSignupPage,
          },
          {
            path: getChildPath(ROUTES.MOBILE_UNRECORDED, ROUTES.MOBILE),
            Component: MobileUnrecordedPage,
          },
          {
            path: getChildPath(ROUTES.MOBILE_RECORD, ROUTES.MOBILE),
            Component: MobileRecordPage,
            ErrorBoundary: InterviewRouteErrorBoundary,
          },
        ],
      },
      {
        Component: MainLayout,
        middleware: [HandleMobileRouting],
        children: [
          {
            path: ROUTES.DASHBOARD,
            Component: DashboardLayout,
            children: [
              { index: true, Component: DashboardPage },
              {
                path: getChildPath(ROUTES.DASHBOARD_MY_INTERVIEWS, ROUTES.DASHBOARD),
                Component: MyInterviewsPage,
              },
              {
                path: getChildPath(ROUTES.DASHBOARD_TREND_QUESTIONS, ROUTES.DASHBOARD),
                Component: TrendQuestionsPage,
              },
              {
                path: getChildPath(ROUTES.DASHBOARD_MY_COLLECTIONS, ROUTES.DASHBOARD),
                Component: MyCollectionsPage,
                children: [
                  {
                    index: true,
                    Component: () => (
                      <Navigate
                        to={getChildPath(ROUTES.DASHBOARD_DIFFICULT_QUESTIONS, ROUTES.DASHBOARD_MY_COLLECTIONS)}
                        replace
                      />
                    ),
                  },
                  {
                    path: getChildPath(ROUTES.DASHBOARD_DIFFICULT_QUESTIONS, ROUTES.DASHBOARD_MY_COLLECTIONS),
                    Component: DifficultQuestionPage,
                  },
                  {
                    path: ':folderId',
                    Component: CollectionDetailPage,
                  },
                ],
              },
              {
                path: getChildPath(ROUTES.DASHBOARD_MY_PAGE, ROUTES.DASHBOARD),
                Component: MyPage,
              },
            ],
          },
          {
            path: ROUTES.RECORD,
            ErrorBoundary: InterviewRouteErrorBoundary,
            children: [
              { index: true, Component: RecordPage },
              {
                path: getChildPath(ROUTES.RECORD_CONFIRM, ROUTES.RECORD),
                Component: RecordConfirmPage,
              },
              {
                path: getChildPath(ROUTES.RECORD_LINK, ROUTES.RECORD),
                Component: RecordLinkPage,
              },
            ],
          },
          {
            path: ROUTES.RETRO,
            ErrorBoundary: InterviewRouteErrorBoundary,
            children: [
              {
                index: true,
                Component: RetroQuestionPage,
              },
              {
                path: getChildPath(ROUTES.RETRO_DETAILS, ROUTES.RETRO),
                Component: RetroDetailPage,
              },
            ],
          },
        ],
      },
      {
        path: ROUTES.FORBIDDEN,
        Component: Forbidden,
      },
      {
        path: ROUTES.INTERVIEW_NOT_FOUND,
        Component: InterviewNotFound,
      },
      {
        path: '*',
        Component: NotFound,
      },
    ],
  },
])

export default function Router() {
  return <RouterProvider router={router} />
}
