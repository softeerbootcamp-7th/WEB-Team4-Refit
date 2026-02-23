# Retro (회고)

## 개요

면접 기록의 질문-답변을 하나씩 돌아보며 자기 회고를 작성하고, 마지막에 KPT(Keep/Problem/Try) 종합 회고를 작성하는 플로우.

## 유저 플로우

### 스텝 구조

질문 1 → 질문 2 → … → 질문 N → KPT 종합 (`totalCount = qnaSets.length + 1`)

- URL 해시 기반 네비게이션: `#retro-{index+1}` (1-indexed)
- 스텝 이동 시 현재 스텝 자동 저장 (`saveCurrentStepRef` 패턴)

### 질문별 회고 스텝

1. Q&A 카드 표시 (질문 + 답변 + STAR 분석 결과)
2. 회고 텍스트 입력 (500자 제한)
3. 스크랩/북마크 토글 가능
4. STAR 분석 요청 가능 (AI)

### KPT 종합 스텝

1. Keep / Problem / Try 각각 텍스트 입력 (각 8,000자 제한)
2. 모든 스텝의 작성 상태를 확인 후 완료

### 완료 플로우

1. "완료" 클릭 → 현재 스텝 저장
2. 미작성 항목 검사:
   - `missingRetroNumbers`: 회고 텍스트가 비어있는 질문 번호들
   - `missingKptItems`: 비어있는 KPT 항목 (Keep/Problem/Try)
3. 미작성 있으면 → 경고 모달 ("N번 회고, KPT X 회고가 작성되지 않았습니다. 그래도 완료하시겠습니까?")
4. 확인 시 → `completeSelfReview()` API → SELF_REVIEW_DRAFT → DEBRIEF_COMPLETED
5. 완료 결과 모달 → 대시보드로 이동

## 비즈니스 규칙

### Dirty Flag (미저장 변경 감지)

`useRetroStepDrafts` 훅에서 baseline 비교 방식으로 동작:

- **질문 회고**: `currentRetroText !== baseline` (baseline = 마지막 저장값 또는 초기 서버값)
- **KPT**: keepText/problemText/tryText 중 하나라도 baseline과 다르면 dirty
- 저장 성공 시 `markQuestionSaved()` / `markKptSaved()`로 baseline 갱신

### STAR 분석

AI가 답변의 Situation/Task/Action/Result 포함 수준을 평가:

| 레벨 | 라벨 | 배지 테마 |
|------|------|----------|
| PRESENT | 충분 | green-50-outline |
| INSUFFICIENT | 부족 | orange-50-outline |
| ABSENT | 없음 | red-50-outline |
| NULL | (미분석) | gray-100 |

- `useCreateStarAnalysis` 뮤테이션으로 요청, 결과를 `starAnalysisByQnaSetId`에 캐시
- KPT 스텝에서는 비활성화

### 스크랩/북마크

- **"어려웠던 질문" 마크**: `markDifficultQuestion` / `unmarkDifficultQuestion` API
- **스크랩 폴더**: 사용자 생성 폴더에 Q&A 추가/제거 (폴더명 최대 10자)
- **북마크 상태** = "어려웠던 질문" 마크 OR 어떤 스크랩 폴더에든 포함
- 스크랩 폴더 데이터 staleTime: 30분
- 저장 시 폴더 추가/제거를 `Promise.all`로 병렬 처리

### 텍스트 제한

| 항목 | 글자 수 제한 |
|------|-------------|
| 질문별 회고 | 500자 |
| KPT Keep | 8,000자 |
| KPT Problem | 8,000자 |
| KPT Try | 8,000자 |

## 도메인 용어

| 용어 | 정의 |
|------|------|
| KPT | Keep(유지할 점) / Problem(문제점) / Try(시도할 점) 회고 프레임워크 |
| STAR 분석 | Situation/Task/Action/Result 포함 수준 AI 평가 |
| Difficult Mark | "어려웠던 질문" 토글 (대시보드 고정 폴더와 연동) |
| Scrap Folder | 사용자 생성 Q&A 컬렉션 폴더 |
| Baseline | dirty flag 비교용 기준값 (초기 서버값 또는 마지막 저장값) |

## 주요 파일

- `src/features/retro/_index/components/retro-section/RetroSection.tsx` — 회고 플로우 메인 컨트롤러
- `src/features/retro/_index/components/retro-section/hooks/useRetroSectionController.ts` — 스텝 상태 통합 관리
- `src/features/retro/_index/components/retro-section/hooks/useRetroStepDrafts.ts` — 드래프트 + dirty flag 로직
- `src/features/retro/_index/components/retro-section/hooks/useRetroStepSave.ts` — 저장 API 호출
- `src/features/retro/_index/components/retro-section/hooks/useRetroStarAnalysis.ts` — STAR 분석 상태 관리
- `src/features/retro/_index/components/retro-section/hooks/useRetroBookmarkState.ts` — 스크랩/북마크 상태
- `src/features/retro/_common/components/RetroWriteCard.tsx` — 질문 회고 입력 (500자)
- `src/features/retro/_common/components/KptWriteCard.tsx` — KPT 입력 (8,000자)
- `src/features/retro/_common/components/scrap-modal/ScrapModal.tsx` — 스크랩 폴더 모달
- `src/constants/retro.ts` — STAR 라벨/값/테마 정의
