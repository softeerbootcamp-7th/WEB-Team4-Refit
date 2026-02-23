import { Suspense, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { useLogout } from '@/apis'
import { useGetMyProfileInfoSuspense } from '@/apis/generated/user-api/user-api'
import { useOnClickOutside } from '@/features/_common/_index/hooks/useOnClickOutside'
import { markUnauthenticated } from '@/routes/middleware/auth-session'
import { ROUTES } from '@/routes/routes'
import { LogoutIcon, UserIcon } from '@/ui/assets'

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
  const { mutate: requestLogout, isPending: isLoggingOut } = useLogout({
    mutation: {
      onSettled: () => {
        markUnauthenticated()
        queryClient.clear()
        navigate(ROUTES.SIGNIN, { replace: true })
      },
    },
  })

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
    if (isLoggingOut) return
    setIsMenuOpen(false)
    requestLogout({ params: { originType: import.meta.env.VITE_APP_ENV } })
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
        <div className="bg-gray-white border-gray-150 absolute top-full right-0 z-20 mt-2 w-32 overflow-hidden rounded-lg border py-1 shadow-lg ring-1 ring-black/5">
          <button
            type="button"
            className="body-s-medium flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
            onClick={handleMoveMyPage}
          >
            <UserIcon className="h-3.5 w-3.5 text-gray-500" />
            마이페이지
          </button>
          <button
            type="button"
            disabled={isLoggingOut}
            className="body-s-medium flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
            onClick={handleLogout}
          >
            <LogoutIcon className="h-3.5 w-3.5 text-gray-500" />
            {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
          </button>
        </div>
      )}
    </div>
  )
}

function UserProfileSkeleton() {
  return <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
}
