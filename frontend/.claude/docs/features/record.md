# Record (면접 기록)

## 개요

면접 내용을 기록하고, AI가 질문-답변으로 분리한 뒤, PDF 자기소개서와 연결하는 3단계 플로우.

## 면접 상태 머신 (전체 기능 공통)

다른 feature 문서에서도 참조하는 핵심 상태 전이:

```
NOT_LOGGED (기록 전)
  → LOG_DRAFT (기록 중)           : 첫 텍스트 입력 시 startLogging API 호출
    → QNA_SET_DRAFT (기록 확인)   : AI 변환 완료 후 Confirm 페이지 진입
      → SELF_REVIEW_DRAFT (회고 중) : Link 페이지에서 completeQnaSetDraft API 호출
        → DEBRIEF_COMPLETED (회고 완료) : Retro에서 completeSelfReview API 호출
```

각 단계의 페이지는 현재 상태를 검증하고, 허용되지 않은 상태면 `getInterviewNavigationPath()`로 리다이렉트한다.

| 상태 | 접근 가능 페이지 |
|------|-----------------|
| NOT_LOGGED, LOG_DRAFT | Record |
| QNA_SET_DRAFT | Confirm, Link |
| SELF_REVIEW_DRAFT | Retro |
| DEBRIEF_COMPLETED | Retro Details (읽기 전용) |

## 유저 플로우

### Step 1: Record (`/record/:interviewId`)

1. 텍스트 입력 또는 음성 녹음으로 면접 내용을 기록
2. 첫 입력 시 `ensureLoggingStarted()` → NOT_LOGGED → LOG_DRAFT 전환
3. 입력 중 자동저장 동작 (아래 "자동저장" 참조)
4. "다음 단계" 클릭 → 확인 모달 → `flushAutoSave()` → `completeRawText()` → `requestConvert()` → Confirm 페이지 이동

### Step 2: Confirm (`/record/:interviewId/confirm`)

1. AI 변환 결과 폴링 (아래 "AI 변환 폴링" 참조)
2. 변환 완료 시 질문-답변 목록 렌더링
3. 사용자가 Q&A 추가/수정/삭제 가능
4. Q&A 삭제 시 PDF 하이라이트가 존재하면 `QNA_DELETE_FAILED_PDF_HIGHLIGHTING_EXISTS` 에러 → 확인 모달로 하이라이트 포함 삭제 유도
5. "다음 단계" → Link 페이지 이동

### Step 3: Link (`/record/:interviewId/link`)

1. 왼쪽: Q&A 목록, 오른쪽: PDF 뷰어
2. Q&A 카드의 "자기소개서 연결하기" 클릭 → 링킹 모드 진입
3. PDF에서 텍스트 드래그 선택 → "연결 저장"으로 하이라이트 저장
4. PDF 업로드는 선택사항 — PDF 없이도 진행 가능
5. "회고 하러 가기" → `completeQnaSetDraft()` → Retro 페이지 이동

## 비즈니스 규칙

### 자동저장 (`useRecordAutoSave`)

- **디바운스**: 1초 (`AUTO_SAVE_DEBOUNCE_MS = 1000`) — 마지막 입력 후 1초 경과 시 저장 요청
- **Race condition 처리**: `lastAutoSaveRequestIdRef`로 요청 ID 추적. 응답 도착 시 현재 ID와 비교하여 stale 응답 무시
- **In-flight 추적**: `inFlightAutoSavePromisesRef` (Set)에 진행 중 Promise 관리. `flushAutoSave()`는 `Promise.allSettled()`로 모든 in-flight 완료 대기
- **상태 표시**: idle → saving → saved → error (UI 피드백용)

### AI 변환 폴링 (`useRecordConfirmConvertGate`)

- `useWaitConvertResult`의 `refetchInterval`로 1.5초 간격 폴링
- `INTERVIEW_CONVERTING_IN_PROGRESS` 에러 코드이면 폴링 계속, 그 외 에러는 폴링 중단
- 게이트 상태: `loading` → `ready` | `failed` | `error`
- `failed`: 변환 실패 모달 (재시도 옵션). `CONVERTING_FAILED`와 `CONVERTING_STATUS_IS_PENDING`에서 메시지 다름

### PDF 하이라이트

- 좌표는 PDF 뷰포트 대비 0~1 비율로 정규화 (`HighlightRect`)
- 부동소수점 오차: `EPSILON = 1e-4` 허용
- 중복 선택 방지: 기존 하이라이트/대기 중 선택과 rect 비교하여 동일하면 무시
- Q&A 1개당 하이라이트 1세트 — 새 선택은 기존 것을 대체
- 색상: 저장됨 = 노랑(`bg-yellow-400/40`), 대기 중 = 회색(`bg-gray-300/40`)

### 텍스트 제한

| 항목 | 글자 수 제한 |
|------|-------------|
| Raw text (면접 기록 원문) | 10,000자 |
| 질문 | 200자 |
| 답변 | 10,000자 |

## 도메인 용어

| 용어 | 정의 |
|------|------|
| Raw Text | AI 변환 전 원본 면접 기록 텍스트 |
| Q&A Set (QnaSet) | AI가 분리한 질문-답변 쌍 |
| Convert | Raw Text → Q&A Set으로 변환하는 AI 처리 |
| PDF Highlighting | 자기소개서 PDF의 특정 영역을 Q&A와 연결하는 것 |
| Presigned URL | S3 직접 업로드용 임시 URL |

## 주요 파일

**Step 1 — Record:**
- `src/features/record/_index/components/RecordPageContent.tsx` — 기록 UI
- `src/features/record/_index/hooks/useRecordAutoSave.ts` — 자동저장 로직

**Step 2 — Confirm:**
- `src/features/record/confirm/hooks/useRecordConfirmConvertGate.ts` — AI 변환 폴링 게이트
- `src/features/record/confirm/components/contents/QnaSetContainer.tsx` — Q&A 카드 (수정/삭제)

**Step 3 — Link:**
- `src/features/record/link/contexts/HighlightProvider.tsx` — 하이라이트 상태 관리
- `src/features/record/link/components/pdf-section/useTextSelection.ts` — PDF 텍스트 선택

**공통:**
- `src/constants/interviewReviewStatus.ts` — 상태 라벨 정의
- `src/features/_common/_index/components/qna-set/QnaSetEditForm.tsx` — Q&A 편집 폼 (텍스트 제한 적용)
