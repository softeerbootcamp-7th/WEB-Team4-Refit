import { useState } from 'react'
import { NavLink } from 'react-router'
import { LightningIcon, Logo } from '@/designs/assets'
import Button from '@/designs/components/button'
import { ROUTES } from '@/routes/routes'
import InstantRecordModal from './InstantRecordModal'
import UserProfile from './UserProfile'

const navItems = [
  { to: ROUTES.DASHBOARD, label: '홈', end: true },
  { to: ROUTES.DASHBOARD_MY_INTERVIEWS, label: '내 면접 모아보기', end: true },
  { to: ROUTES.DASHBOARD_TREND_QUESTIONS, label: '질문 트렌드 모아보기' },
  { to: ROUTES.DASHBOARD_MY_COLLECTIONS, label: '스크랩' },
]

export default function Navbar() {
  const [isInstantRecordOpen, setIsInstantRecordOpen] = useState(false)

  return (
    <>
      <nav className="bg-gray-white fixed top-0 right-0 left-0 z-50 h-15 border-b border-gray-100">
        <div className="mx-auto flex h-full w-7xl items-center gap-8">
          <NavLink to={ROUTES.DASHBOARD} className="flex items-center">
            <Logo className="h-6 w-auto text-orange-500" />
          </NavLink>

          <div className="flex h-full items-center gap-2">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={getNavLinkClassName}>
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-4">
            <Button variant="fill-orange-500" size="xs" onClick={() => setIsInstantRecordOpen(true)}>
              <LightningIcon className="w- h-4" />
              면접 바로 복기하기
            </Button>
            <UserProfile />
          </div>
        </div>
      </nav>

      <InstantRecordModal open={isInstantRecordOpen} onClose={() => setIsInstantRecordOpen(false)} />
    </>
  )
}

const getNavLinkClassName = ({ isActive }: { isActive: boolean }) => {
  const baseStyles = 'relative flex h-full items-center px-4 transition-colors'
  const activeStyles =
    'body-m-semibold text-gray-800 after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5 after:bg-orange-500 after:content-[""]'
  const inactiveStyles = 'body-m-medium text-gray-400 hover:text-gray-800'

  return isActive ? `${baseStyles} ${activeStyles}` : `${baseStyles} ${inactiveStyles}`
}
