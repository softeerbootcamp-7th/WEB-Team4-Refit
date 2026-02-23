import { Link } from 'react-router'
import { ROUTES } from '@/routes/routes'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="title-xl-bold">404</h1>
      <p className="body-m-medium text-gray-600">페이지를 찾을 수 없습니다.</p>
      <Link to={ROUTES.DASHBOARD} className="text-primary-500 body-m-medium underline">
        홈으로 이동
      </Link>
    </div>
  )
}
