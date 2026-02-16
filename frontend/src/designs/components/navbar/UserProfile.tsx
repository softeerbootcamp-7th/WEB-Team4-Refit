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

  return (
    <div className="ml-auto flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gray-200">
        {profileImageUrl ? (
          <img
            src={profileImageUrl}
            alt={`${nickname}의 프로필`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : null}
      </div>
      <span className="body-l-semibold text-gray-700">{nickname} 님</span>
    </div>
  )
}

function UserProfileSkeleton() {
  return (
    <div className="ml-auto flex items-center gap-2.5">
      <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
      <div className="bg-gray-150 h-5 w-20 animate-pulse rounded" />
    </div>
  )
}
