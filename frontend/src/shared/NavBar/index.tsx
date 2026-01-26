import { NavLink } from 'react-router'
import { Logo } from '@/assets'
import { ROUTES } from '@/routes'
import UserProfile from '@/shared/NavBar/UserProfile'

export default function NavBar() {
  return (
    <nav className="bg-gray-white fixed top-0 right-0 left-0 z-50 flex h-15 items-center gap-6 px-6 py-3">
      <NavLink to={ROUTES.DASHBOARD} className="flex items-center">
        <Logo className="h-6 w-auto" />
      </NavLink>

      <div className="flex items-center gap-2">
        <NavLink to={ROUTES.DASHBOARD} end className={getNavLinkClassName}>
          홈
        </NavLink>
        <NavLink
          to={ROUTES.DASHBOARD_MY_INTERVIEWS}
          end
          className={getNavLinkClassName}
        >
          내 면접 모아보기
        </NavLink>
        <NavLink
          to={ROUTES.DASHBOARD_TREND_QUESTIONS}
          className={getNavLinkClassName}
        >
          질문 트렌드 모아보기
        </NavLink>
        <NavLink
          to={ROUTES.DASHBOARD_MY_COLLECTIONS}
          className={getNavLinkClassName}
        >
          스크랩
        </NavLink>
      </div>

      <UserProfile />
    </nav>
  )
}

const getNavLinkClassName = ({ isActive }: { isActive: boolean }) => {
  const baseStyles = 'px-7'
  const activeStyles = 'body-m-semibold text-gray-800'
  const inactiveStyles = 'body-m-medium text-gray-400 hover:text-gray-800'

  return isActive
    ? `${baseStyles} ${activeStyles}`
    : `${baseStyles} ${inactiveStyles}`
}
