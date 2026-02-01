import { createBrowserRouter, RouterProvider } from 'react-router'
import { ROUTES } from '@/constants/routes'
import { DashboardLayout, MobileLayout, RootLayout } from '@/routes/layouts'
import {
  Dashboard,
  MobilePage,
  MobileRecordPage,
  MobileSignupPage,
  MobileUnrecordedPage,
  NotFound,
  SharedComponentExample,
  SigninPage,
} from '@/routes/pages'

const getChildPath = (fullPath: string, rootPath: string): string => {
  return fullPath.replace(rootPath, '').replace(/^\//, '')
}

const router = createBrowserRouter([
  { path: ROUTES.HOME, Component: Dashboard },
  { path: ROUTES.SIGNUP, Component: Dashboard },
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
  { path: ROUTES.TERMS, Component: Dashboard },
  {
    Component: RootLayout,
    children: [
      {
        path: ROUTES.DASHBOARD,
        Component: DashboardLayout,
        children: [
          { index: true, Component: Dashboard },
          {
            path: getChildPath(ROUTES.DASHBOARD_MY_INTERVIEWS, ROUTES.DASHBOARD),
            Component: Dashboard,
          },
          {
            path: getChildPath(ROUTES.DASHBOARD_TREND_QUESTIONS, ROUTES.DASHBOARD),
            Component: Dashboard,
          },
          {
            path: getChildPath(ROUTES.DASHBOARD_MY_COLLECTIONS, ROUTES.DASHBOARD),
            Component: Dashboard,
          },
          {
            path: getChildPath(ROUTES.DASHBOARD_COLLECTION_DETAIL, ROUTES.DASHBOARD),
            Component: Dashboard,
          },
        ],
      },
      {
        path: ROUTES.RECORD,
        children: [
          { index: true, Component: Dashboard },
          {
            path: getChildPath(ROUTES.RECORD_CONFIRM, ROUTES.RECORD),
            Component: Dashboard,
          },
          {
            path: getChildPath(ROUTES.RECORD_LINK, ROUTES.RECORD),
            Component: Dashboard,
          },
        ],
      },
      {
        path: ROUTES.RETRO,
        children: [
          {
            path: getChildPath(ROUTES.RETRO_QUESTION, ROUTES.RETRO),
            Component: Dashboard,
          },
          {
            path: getChildPath(ROUTES.RETRO_DETAILS, ROUTES.RETRO),
            Component: Dashboard,
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
