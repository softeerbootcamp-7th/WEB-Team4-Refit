import { Link } from 'react-router'
import { ROUTES } from '@/routes/routes'

export default function Forbidden() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="title-xl-bold">403</h1>
      <p className="body-m-medium text-gray-600">접근 권한이 없습니다.</p>
      <Link to={ROUTES.DASHBOARD_MY_INTERVIEWS} className="text-primary-500 body-m-medium underline">
        내 면접 모아보기로 이동
      </Link>
    </div>
  )
}
