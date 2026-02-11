interface User {
  nickname: string
  profileImage?: string
}

export default function UserProfile() {
  // TODO: 유저 정보 받는 커스텀 hook으로 변경
  const user: User = {
    nickname: '샤샤샤',
    profileImage: 'https://placehold.co/400',
  }

  return (
    <div className="ml-auto flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gray-200">
        <img
          src={user.profileImage}
          alt={`${user.nickname}의 프로필`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <span className="body-l-semibold text-gray-700">{user.nickname} 님</span>
    </div>
  )
}
