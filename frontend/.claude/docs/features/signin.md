# SignIn (로그인/회원가입)

## 개요

Google OAuth 팝업 로그인 후, 서비스 가입 여부에 따라 대시보드 또는 회원가입 폼으로 분기하는 2단계 인증 플로우.

## 유저 플로우

### OAuth 팝업 플로우

1. 사용자가 "Google 계정으로 로그인" 클릭
2. 팝업 창 열림 (500x600, 화면 중앙 정렬)
3. Google OAuth 인증 완료 → `/auth/callback`으로 리다이렉트
4. 콜백 페이지에서 `window.opener`에 `postMessage` 전송:
   ```
   { type: 'oauth-callback', status: 'loginSuccess' | 'signUpRequired', nickname, profileImageUrl }
   ```
5. 부모 창이 메시지 수신 → 팝업 닫기 → 라우팅 분기

**Origin 검증**: `event.origin === window.location.origin`으로 XSS 방지

**팝업 없는 직접 접근 대응**: `window.opener`가 없으면 콜백 페이지에서 직접 네비게이트 (loginSuccess → 대시보드, signUpRequired → 회원가입)

### 분기 로직

| status | 데스크톱 라우트 | 모바일 라우트 |
|--------|---------------|-------------|
| loginSuccess | `/dashboard` | `/mobile/unrecorded` |
| signUpRequired | `/signup` | `/mobile/signup` |

`signUpRequired`일 때 nickname, profileImageUrl을 navigation state로 전달하여 회원가입 폼에 미리 채움.

### 회원가입 폼 (`useSignupForm`)

- 닉네임: OAuth에서 가져온 값 pre-fill, 1~20자
- 업종/직무: 드롭다운 (API에서 조회, 1시간 staleTime으로 캐시)
- 완료 시 `markAuthenticated()` → 리다이렉트

## 비즈니스 규칙

### 세션 상태 머신

`auth-session.ts`에서 in-memory 변수로 관리:

```
unknown (초기/리셋)
  ├─ reissue 성공, isNeedSignUp=false → authenticated
  ├─ reissue 성공, isNeedSignUp=true  → signup_required
  └─ reissue 실패 또는 LOGIN_REQUIRED  → unauthenticated
```

| 상태 | 의미 | 라우팅 동작 |
|------|------|-----------|
| unknown | 초기 로드 또는 OAuth 후 리셋 | reissue API 호출하여 판별 |
| authenticated | 로그인 + 서비스 가입 완료 | 보호된 라우트 접근 허용 |
| signup_required | Google 인증만 완료 | `/signin`으로 리다이렉트 |
| unauthenticated | 토큰 없음/만료 | `/signin`으로 리다이렉트 |

### 인증 라우팅 미들웨어 (`handleAuthRouting`)

- **공개 라우트** (인증 체크 건너뜀): `/signin`, `/signup`, `/auth/callback`, `/mobile`
- 최초 라우트 보호 체크 시 `reissue()` API 1회 호출
- `initialAuthCheckPromise`로 동시 네비게이션 시 중복 reissue 방지
- 토큰은 HTTP-only 쿠키 (`credentials: 'include'`)

### 자동 토큰 재발급

`custom-fetch.ts`에서 401 응답 시:
1. `/auth/reissue` 자동 호출
2. `LOGIN_REQUIRED` 코드면 `markUnauthenticated()`
3. 성공이면 `markAuthenticated()` + 원래 요청 재시도
4. in-flight promise 캐시로 동시 reissue 방지

## 도메인 용어

| 용어 | 정의 |
|------|------|
| Reissue | access/refresh 토큰 재발급 API |
| isNeedSignUp | 서비스 회원가입 필요 여부 (Google 인증만 된 상태) |
| Origin Type | 가입 경로 (`import.meta.env.VITE_APP_ENV`) |

## 주요 파일

- `src/features/signin/_index/hooks/useGoogleOAuthLogin.ts` — OAuth 팝업 + postMessage 핸들링
- `src/pages/auth/callback/page.tsx` — OAuth 콜백 (팝업↔부모 통신)
- `src/features/_common/auth/hooks/useSignupForm.ts` — 회원가입 폼 공통 로직
- `src/routes/middleware/auth-session.ts` — 세션 상태 머신 (4상태)
- `src/routes/middleware/handle-auth-routing.ts` — 인증 미들웨어 + reissue
- `src/apis/custom-fetch.ts` — 401 자동 토큰 재발급
