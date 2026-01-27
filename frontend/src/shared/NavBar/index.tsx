import { NavLink } from 'react-router'
import { Logo } from '@/assets'
import { ROUTES } from '@/constants/routes'
import UserProfile from '@/shared/NavBar/UserProfile'

const navItems = [
  { to: ROUTES.DASHBOARD, label: '홈', end: true },
  { to: ROUTES.DASHBOARD_MY_INTERVIEWS, label: '내 면접 모아보기', end: true },
  { to: ROUTES.DASHBOARD_TREND_QUESTIONS, label: '질문 트렌드 모아보기' },
  { to: ROUTES.DASHBOARD_MY_COLLECTIONS, label: '스크랩' },
]

export default function NavBar() {
  return (
    <nav className="bg-gray-white fixed top-0 right-0 left-0 z-50 flex h-15 items-center gap-6 px-6 py-3">
      <NavLink to={ROUTES.DASHBOARD} className="flex items-center">
        <Logo className="h-6 w-auto" />
      </NavLink>

      <div className="flex items-center gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={getNavLinkClassName}
          >
            {item.label}
          </NavLink>
        ))}
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
