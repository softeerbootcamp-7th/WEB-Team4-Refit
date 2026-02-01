import { createBrowserRouter, RouterProvider } from 'react-router'
import { ROUTES } from '@/constants/routes'
import { DashboardLayout, MobileLayout, RootLayout } from '@/routes/layouts'
import {
  DashboardPage,
  RecordConfirmPage,
  RecordLinkPage,
  NotFound,
  SharedComponentExample,
  SigninPage,
  MobilePage,
  MobileSignupPage,
  MobileUnrecordedPage,
  MobileRecordPage,
} from '@/routes/pages'

const getChildPath = (fullPath: string, rootPath: string): string => {
  return fullPath.replace(rootPath, '').replace(/^\//, '')
}

const router = createBrowserRouter([
  { path: ROUTES.HOME, Component: DashboardPage },
  { path: ROUTES.SIGNUP, Component: DashboardPage },
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
            Component: DashboardPage,
          },
          {
            path: getChildPath(ROUTES.DASHBOARD_TREND_QUESTIONS, ROUTES.DASHBOARD),
            Component: DashboardPage,
          },
          {
            path: getChildPath(ROUTES.DASHBOARD_MY_COLLECTIONS, ROUTES.DASHBOARD),
            Component: DashboardPage,
          },
          {
            path: getChildPath(ROUTES.DASHBOARD_COLLECTION_DETAIL, ROUTES.DASHBOARD),
            Component: DashboardPage,
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
            Component: DashboardPage,
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
