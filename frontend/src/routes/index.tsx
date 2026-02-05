import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import { DashboardLayout, MobileLayout, RootLayout } from '@/layouts'
import {
  DashboardPage,
  RecordConfirmPage,
  RecordLinkPage,
  RetroQuestionPage,
  NotFound,
  SharedComponentExample,
  SigninPage,
  SignupPage,
  MobilePage,
  MobileSignupPage,
  MobileUnrecordedPage,
  MobileRecordPage,
  MyCollectionsPage,
  CollectionDetailPage,
  DifficultQuestionPage,
  MyInterviewsPage,
} from '@/pages'
import { ROUTES } from '@/shared/constants/routes'

const getChildPath = (fullPath: string, rootPath: string): string => {
  return fullPath.replace(rootPath, '').replace(/^\//, '')
}

const router = createBrowserRouter([
  { path: ROUTES.HOME, Component: () => <Navigate to={ROUTES.DASHBOARD} replace /> },
  { path: ROUTES.SIGNUP, Component: SignupPage },
  { path: ROUTES.SIGNIN, Component: SigninPage },
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
      },
    ],
  },
  {
    Component: RootLayout,
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
            Component: DashboardPage,
          },
          {
            path: getChildPath(ROUTES.DASHBOARD_MY_COLLECTIONS, ROUTES.DASHBOARD),
            Component: MyCollectionsPage,
            children: [
              { index: true, Component: () => <Navigate to="difficult-questions" replace /> },
              {
                path: 'difficult-questions',
                Component: DifficultQuestionPage,
              },
              {
                path: ':folderId',
                Component: CollectionDetailPage,
              },
            ],
          },
        ],
      },
      {
        path: ROUTES.RECORD,
        children: [
          { index: true, Component: DashboardPage },
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
        children: [
          {
            path: getChildPath(ROUTES.RETRO_QUESTION, ROUTES.RETRO),
            Component: RetroQuestionPage,
          },
          {
            path: getChildPath(ROUTES.RETRO_DETAILS, ROUTES.RETRO),
            Component: DashboardPage,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    Component: NotFound,
  },
  { path: 'component-test', Component: SharedComponentExample },
])

export default function Router() {
  return <RouterProvider router={router} />
}
