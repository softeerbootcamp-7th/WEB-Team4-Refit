import { Suspense, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { useGetMyProfileInfoSuspense } from '@/apis/generated/user-api/user-api'
import { useOnClickOutside } from '@/features/_common/hooks/useOnClickOutside'
import { markUnauthenticated } from '@/routes/middleware/auth-session'
import { ROUTES } from '@/routes/routes'

const PROFILE_STALE_TIME = 1000 * 60 * 60 // 1시간

export default function UserProfile() {
  return (
    <Suspense fallback={<UserProfileSkeleton />}>
      <UserProfileContent />
    </Suspense>
  )
}

function UserProfileContent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const { data: profile } = useGetMyProfileInfoSuspense({
    query: {
      staleTime: PROFILE_STALE_TIME,
      refetchOnWindowFocus: false, // 탭을 다시 클릭해 포커스가 돌아와도 자동 재요청하지 않음
      select: (response) => ({
        nickname: response.result?.nickname?.trim() || '회원',
        profileImageUrl: response.result?.profileImageUrl,
      }),
    },
  })
  const nickname = profile?.nickname
  const profileImageUrl = profile?.profileImageUrl
  const initial = nickname?.[0]?.toUpperCase() ?? '?'

  useOnClickOutside(containerRef, () => setIsMenuOpen(false), isMenuOpen)

  const handleMoveMyPage = () => {
    setIsMenuOpen(false)
    navigate(ROUTES.DASHBOARD_MY_PAGE)
  }

  const handleLogout = () => {
    setIsMenuOpen(false)
    markUnauthenticated()
    queryClient.clear()
    navigate(ROUTES.SIGNIN, { replace: true })
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        className="flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-orange-400 transition-all hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
        aria-label={`${nickname} 프로필`}
        aria-haspopup="menu"
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        {profileImageUrl ? (
          <img src={profileImageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <span className="caption-l-semibold text-white">{initial}</span>
        )}
      </button>

      {isMenuOpen && (
        <div className="bg-gray-white absolute top-full right-0 z-20 mt-2 w-32 overflow-hidden rounded-lg border border-gray-150 py-1 shadow-lg ring-1 ring-black/5">
          <button
            type="button"
            className="body-s-medium flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
            onClick={handleMoveMyPage}
          >
            <MyPageIcon className="h-4 w-4 text-gray-500" />
            마이페이지
          </button>
          <button
            type="button"
            className="body-s-medium flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
            onClick={handleLogout}
          >
            <LogoutIcon className="h-4 w-4 text-gray-500" />
            로그아웃
          </button>
        </div>
      )}
    </div>
  )
}

function UserProfileSkeleton() {
  return <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
}

type MenuIconProps = {
  className?: string
}

function MyPageIcon({ className }: MenuIconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <circle cx="10" cy="6.5" r="3.1" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M4.8 15.2C5.9 13 7.7 11.8 10 11.8C12.3 11.8 14.1 13 15.2 15.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function LogoutIcon({ className }: MenuIconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path
        d="M12.6 4.6H14.8C15.7 4.6 16.4 5.3 16.4 6.2V13.8C16.4 14.7 15.7 15.4 14.8 15.4H12.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8 13.1L11.2 9.9L8 6.7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M11 9.9H3.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
