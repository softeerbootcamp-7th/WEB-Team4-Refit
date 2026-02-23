# Mobile (모바일)

## 개요

모바일 기기에서 음성 녹음으로 면접 내용을 기록하는 경량 버전. 데스크톱 Record 기능의 1단계(기록)만 모바일에 최적화하여 제공.

## 유저 플로우

### 모바일 감지 → 리다이렉트

`HandleMobileRouting` 미들웨어가 HOME(`/`), SIGNIN, SIGNUP 라우트에 적용:
- User Agent에서 `Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini` 감지 시 `/mobile`로 리다이렉트
- 모바일 기기가 데스크톱 라우트에 직접 접근하면 자동 리다이렉트

### 브라우저 지원 확인

`MobileLayout`에서 `isSpeechRecognitionSupported()` 체크:
- `window.SpeechRecognition` 또는 `window.webkitSpeechRecognition` 존재 여부
- 미지원 시 "미지원 브라우저에요 — Chrome 또는 Safari의 최신 버전을 사용해주세요" 모달

### OAuth 로그인 → 회원가입

1. `/mobile` 랜딩 페이지에서 Google OAuth 팝업 (500x600)
2. `loginSuccess` → `/mobile/unrecorded` (면접 목록)
3. `signUpRequired` → `/mobile/signup` (닉네임 + 업종 + 직무 입력)

### 2단계 녹음 플로우 (`/mobile/record/:interviewId`)

**Step 결정**: 서버에 저장된 rawText가 있으면 → `edit`, 없으면 → `record`

#### Step 1: Record (녹음)

1. 마이크 권한 요청 (`getUserMedia`)
2. Web Speech API로 음성 인식 시작 (`lang: 'ko-KR'`, `continuous: true`)
3. 실시간 텍스트 표시 (Android는 최종 결과만, iOS는 중간 결과 포함)
4. 오디오 시각화 (Android: 정적 REC 인디케이터, iOS: 캔버스 주파수 시각화)
5. "완료" → Edit 스텝으로 이동 / "취소" → 텍스트 클리어

**빈 음성 인식 처리**: 녹음 완료 시 텍스트가 비어있으면 "음성을 인식하지 못했습니다" 모달

#### Step 2: Edit (편집)

1. 인식된 텍스트를 편집 가능한 textarea에 표시
2. "다시 녹음하기" → Record 스텝으로 복귀
3. "기록 저장하기" → `ensureLoggingStarted()` (NOT_LOGGED면 startLogging) → `updateRawText()` API

## 비즈니스 규칙

### Web Speech API 플랫폼 차이

| 기능 | Android | iOS |
|------|---------|-----|
| interimResults | `false` (오동작 이슈) | `true` |
| 실시간 텍스트 | 최종 인식 결과만 반영 | 중간 결과 실시간 업데이트 |
| 오디오 시각화 | StaticRecordingIndicator | DynamicRecordingIndicator (캔버스) |
| MediaStream 캡처 | 건너뜀 | 시각화용으로 캡처 |

### 오디오 시각화 설정

- FFT Size: 256, 바 20개, 갱신 간격 50ms, 볼륨 스케일 40x, 색상 #fe6f0f

### 미녹음 면접 목록

`useUnrecordedInterviews`: DEBRIEF_COMPLETED가 아닌 면접 목록 조회

경과 시간 표시:
- 0일 → "오늘"
- 1일 → "1일 전"
- 7~13일 → "1주 전"
- 14~20일 → "2주 전"
- … N주 단위

### 라우트 구조

```
/mobile                    — 랜딩 (Google OAuth)
/mobile/signup             — 회원가입 폼
/mobile/unrecorded         — 미녹음 면접 목록
/mobile/record/:interviewId — 녹음/편집
```

## 도메인 용어

| 용어 | 정의 |
|------|------|
| Speech Recognition | Web Speech API 기반 음성→텍스트 변환 |
| Interim Results | 음성 인식 중간 결과 (확정 전 실시간 텍스트) |
| Committed Transcript | 확정된 음성 인식 결과 (final = true) |
| Unrecorded Interview | DEBRIEF_COMPLETED가 아닌 면접 (녹음 대상) |

## 주요 파일

- `src/routes/middleware/handle-mobile-routing.ts` — 모바일 감지 + 리다이렉트 미들웨어
- `src/layouts/MobileLayout.tsx` — 모바일 레이아웃 셸 + 브라우저 지원 체크
- `src/features/mobile/record/components/RecordStepContent.tsx` — 녹음 UI
- `src/features/mobile/record/components/EditStepContent.tsx` — 편집 UI
- `src/features/_common/record/components/useSpeechRecognition.ts` — Web Speech API 래퍼 (Android 분기 포함)
- `src/features/_common/record/components/useAudioRecorder.ts` — 녹음 + 음성인식 통합 훅
- `src/features/_common/record/components/useAudioVisualizer.ts` — 캔버스 시각화 훅
- `src/features/mobile/unrecorded/hooks/useUnrecordedInterviews.ts` — 미녹음 면접 목록
