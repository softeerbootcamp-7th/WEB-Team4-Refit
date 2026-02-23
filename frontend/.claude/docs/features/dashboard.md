# Dashboard (대시보드)

## 개요

로그인 후 메인 화면. 면접 일정 배너, 복기 대기 목록, 캘린더, 개인화 질문 섹션을 제공하며, 내 면접/컬렉션/마이페이지/트렌드 서브페이지로 구성.

## 유저 플로우

### 메인 대시보드 (`/dashboard`)

배너 → 복기 대기 카드 → 다가오는 면접 → 캘린더(우측) → 개인화 질문 3열 (자주 받은 질문 카테고리 / 어려웠던 질문 / 인기 질문)

### 서브페이지 구조

| 경로 | 기능 |
|------|------|
| `/dashboard` | 메인 대시보드 |
| `/dashboard/my-interviews` | 내 면접 목록 (검색/필터/정렬) |
| `/dashboard/my-collections` | 스크랩 폴더 관리 |
| `/dashboard/my-collections/:folderId` | 특정 폴더 Q&A 목록 |
| `/dashboard/my-page` | 프로필 설정 |
| `/dashboard/trend-questions` | 트렌드 질문 조회 |

## 비즈니스 규칙

### 배너 4가지 상태

백엔드 `headlineType`에 따라 결정. 닉네임은 동적 삽입.

| 백엔드 타입 | 배너 variant | 조건 | 표시 내용 | 클릭 액션 |
|------------|-------------|------|----------|----------|
| REGISTER_INTERVIEW | no_schedule | 예정 면접 없음 | "면접 일정이 없네요! 캘린더에 등록해보세요" | 일정 등록 모달 |
| PREPARE_INTERVIEW | upcoming | 예정 면접 있음 | "N일 후 면접이 있어요" (당일이면 "오늘") | 트렌드 질문 이동 |
| REVIEW_INTERVIEW | review | 미완료 복기 있음 | "완료되지 않은 작업이 있어요!" | 내 면접 이동 |
| CHECK_INTERVIEW_HISTORY | no_weekly | 이번주 면접 없음 | "면접 히스토리를 미리 확인해 보세요" | 내 면접 이동 |

### 약관 동의 게이팅 (`isAgreedToTerms`)

`useGetMyProfileInfo()`에서 `isAgreedToTerms` 확인. 미동의 시:

- **다가오는 면접** 섹션 — 블러 오버레이 + 약관 동의 유도
- **개인화 질문** 섹션 (자주 받은 카테고리, 인기 질문) — 블러 오버레이

`TermsLockedOverlay`: 블러 처리 + "선택 약관에 동의하고 모든 데이터를 확인해보세요" 메시지. 동의 완료 시 profile + headline 쿼리 무효화.

약관 내용: 면접 질문을 익명 통계 분석에 활용하는 것에 대한 동의. 한 번 동의하면 마이페이지에서도 해제 불가 (체크박스 disabled).

### 캘린더 색상 규칙

| 색상 | 조건 | 의미 |
|------|------|------|
| Orange (bg-orange-100, text-orange-500) | `interviewReviewStatus !== 'DEBRIEF_COMPLETED'` | 미복기 |
| Gray (bg-gray-100, text-gray-500) | `interviewReviewStatus === 'DEBRIEF_COMPLETED'` | 복기 완료 |

선택된 날짜: `bg-orange-500 text-white`, 오늘: `ring-1 ring-orange-200`

### 스크랩 폴더

- **"어려웠던 질문" 고정 폴더**: 항상 첫 번째, `isFixed: true`, 수정/삭제 불가
- ID: `DIFFICULT_FOLDER_ID = 'difficult-questions'`
- folderId 파라미터 없으면 "어려웠던 질문" 폴더 자동 선택
- 선택된 폴더가 존재하지 않으면 "어려웠던 질문"으로 자동 이동
- 사용자 생성 폴더: 생성/이름 변경/삭제 가능, 무한 스크롤

### 내 면접 필터/검색

**필터 항목:**
- 면접 유형: FIRST, SECOND, THIRD, BEHAVIORAL, TECHNICAL, EXECUTIVE, CULTURE_FIT, COFFEE_CHAT, PSEUDO
- 합격 여부: PASS(합격), WAIT(발표 대기), FAIL(불합격)
- 면접 상태: 검색 키워드가 있을 때만 표시 (NOT_LOGGED ~ DEBRIEF_COMPLETED)
- 날짜 범위: startDate ~ endDate

**정렬:**
- `interviewStartAt,desc` — 면접 일시 최신순 (기본)
- `interviewStartAt,asc` — 오래된 순
- `updatedAt,desc` — 최신 업데이트순
- `companyName,asc` — 가나다순

**핵심 규칙**: 검색 키워드 없을 때는 `DEBRIEF_COMPLETED`만 자동 필터링. 키워드 있을 때는 모든 상태 표시.

### 마이페이지 프로필 유효성 검사

| 필드 | 규칙 |
|------|------|
| 닉네임 | 1~20자, 필수 (저장 시 trim) |
| 업종 (industry) | 필수 선택 |
| 직무 (jobCategory) | 필수 선택 |
| 약관 동의 | 선택. 한 번 동의하면 해제 불가 |

`isSaveDisabled = isLoading || isSaving || !isFormValid || !hasChanges`

변경 감지: 프로필 필드 변경 OR 약관 새로 동의 시 저장 버튼 활성화.

## 도메인 용어

| 용어 | 정의 |
|------|------|
| Headline | 배너 상태를 결정하는 백엔드 응답 |
| Terms Lock | 선택 약관 미동의 시 개인화 섹션 잠금 |
| Difficult Folder | "어려웠던 질문" 고정 스크랩 폴더 |
| Review Waiting | 복기 미완료 면접 목록 (DEBRIEF_COMPLETED 아닌 것) |
| Personalized Questions | 약관 동의 후 볼 수 있는 통계 기반 질문 섹션 |

## 주요 파일

- `src/features/dashboard/_index/hooks/useDashboardHeadline.ts` — 배너 상태 결정
- `src/features/dashboard/_index/constants/dashboardBanner.ts` — 배너 variant 매핑
- `src/features/dashboard/_index/hooks/useInterviewCalendar.ts` — 캘린더 이벤트 + 색상
- `src/features/dashboard/_index/components/terms-lock/TermsLockedOverlay.tsx` — 약관 블러 오버레이
- `src/features/dashboard/_common/profile/OptionalTermsAgreeModal.tsx` — 약관 동의 모달
- `src/features/dashboard/my-interviews/constants/constants.ts` — 필터 옵션/정렬 정의
- `src/features/dashboard/my-interviews/components/filter/InterviewFilterModal.tsx` — 필터 모달
- `src/features/dashboard/my-collections/hooks/useCollectionFolders.ts` — 폴더 목록 + 고정 폴더 로직
- `src/features/dashboard/my-collections/mappers.ts` — DIFFICULT_FOLDER_ID 상수
- `src/features/dashboard/my-page/hooks/useMyPageProfile.ts` — 프로필 폼 유효성 검사 + 저장
- `src/features/dashboard/_index/contexts/ScheduleModalProvider.tsx` — 면접 일정 등록 모달 컨텍스트
