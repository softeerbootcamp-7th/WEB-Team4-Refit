import { Suspense } from 'react'
import { useGetMyProfileInfoSuspense } from '@/apis/generated/user-api/user-api'

const PROFILE_STALE_TIME = 1000 * 60 * 60 // 1시간

export default function UserProfile() {
  return (
    <Suspense fallback={<UserProfileSkeleton />}>
      <UserProfileContent />
    </Suspense>
  )
}

function UserProfileContent() {
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

  return (
    <button
      className="flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-orange-400 transition-all hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
      aria-label={`${nickname} 프로필`}
    >
      {profileImageUrl ? (
        <img src={profileImageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <span className="caption-l-semibold text-white">{initial}</span>
      )}
    </button>
  )
}

function UserProfileSkeleton() {
  return <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
}
